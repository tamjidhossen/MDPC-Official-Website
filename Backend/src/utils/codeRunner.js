import { promises as fs } from "fs";
import { exec } from "child_process";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import util from "util";

const execAsync = util.promisify(exec);

// Configure paths
const tempDir = path.resolve(process.cwd(), "public", "temp");
const submissionsDir = path.resolve(tempDir, "submissions");

// Helper function to ensure directories exist
async function ensureDirExists(dir) {
  try {
    await fs.access(dir);
  } catch (error) {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Create necessary directories
async function initDirectories() {
  await ensureDirExists(tempDir);
  await ensureDirExists(submissionsDir);
}

// Function to run C++ code
export async function runCppCode(code, testCases) {
  try {
    // Check if testCases is valid and not empty
    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      console.warn("No test cases provided, using a default test case");
      testCases = [{ input: "", output: "" }];
    }

    await initDirectories();
    const submissionId = uuidv4();

    // Create submission file paths
    const cppFilePath = path.join(submissionsDir, `${submissionId}.cpp`);
    const exeFilePath = path.join(submissionsDir, `${submissionId}`);
    const inputFilePath = path.join(
      submissionsDir,
      `${submissionId}_input.txt`
    );
    const outputFilePath = path.join(
      submissionsDir,
      `${submissionId}_output.txt`
    );

    // Log the code that's being written to the file
    console.log("Code to be compiled:", code);

    // Write code to file
    await fs.writeFile(cppFilePath, code);

    // Log the file path and contents for verification
    console.log(`Created file at: ${cppFilePath}`);
    const writtenCode = await fs.readFile(cppFilePath, "utf-8");
    console.log("Code written to file:", writtenCode);

    // Compile the code - updated to use C++20 instead of C++11
    try {
      // Add quotes around the file paths to handle spaces correctly
      const compileCommand = `g++ -std=c++20 -o "${exeFilePath}" "${cppFilePath}"`;
      console.log("Executing compile command:", compileCommand);
      await execAsync(compileCommand);
      console.log("Compilation successful");
    } catch (compileError) {
      // Log compilation error details
      console.error("Compilation Error Details:", compileError.stderr);

      // Clean up files
      await cleanup(cppFilePath);

      return {
        verdict: "Compilation Error",
        error: compileError.stderr,
        results: testCases.map((_, index) => ({
          testCase: index,
          verdict: "Compilation Error",
          executionTime: 0,
        })),
      };
    }

    // Run each test case
    const results = [];
    let overallVerdict = "Accepted";
    let totalExecutionTime = 0;

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      // Write input to file
      await fs.writeFile(inputFilePath, testCase.input);

      let executionTime = 0;
      let output = "";
      let verdict = "Accepted";

      try {
        // Run the code with a timeout (e.g., 5000ms)
        const timeLimit = 5000; // 5 seconds
        const startTime = Date.now();

        const { stdout } = await Promise.race([
          execAsync(`timeout 5s "${exeFilePath}" < "${inputFilePath}"`),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Time Limit Exceeded")),
              timeLimit
            )
          ),
        ]);

        executionTime = Date.now() - startTime;
        output = stdout.trim();

        // Compare output with expected output
        const expectedOutput = testCase.output.trim();

        if (output !== expectedOutput) {
          verdict = "Wrong Answer";
          overallVerdict = "Wrong Answer";
        }
      } catch (error) {
        // Initialize startTime if it's not defined in this scope
        const startTime = Date.now();

        if (error.message === "Time Limit Exceeded") {
          verdict = "Time Limit Exceeded";
          executionTime = 5000; // Set to max time
        } else {
          verdict = "Runtime Error";
          executionTime = Date.now() - startTime || 0;
        }

        overallVerdict = verdict;
      }

      results.push({
        testCase: i,
        verdict,
        executionTime,
        output,
      });

      totalExecutionTime += executionTime;
    }

    // Calculate average execution time
    const avgExecutionTime = totalExecutionTime / testCases.length;

    // Clean up files
    await cleanup(cppFilePath, exeFilePath, inputFilePath, outputFilePath);

    return {
      verdict: overallVerdict,
      executionTime: avgExecutionTime,
      results,
    };
  } catch (error) {
    console.error("Error in code execution:", error);
    return {
      verdict: "Internal Error",
      error: error.message,
      results: [],
    };
  }
}

// Function to calculate submission score based on problem points and time penalty
export function calculateScore(problem, contest, submissionTime) {
  // Base score from problem
  let score = problem.points || 100;

  // If no contest or no penalty, just return base score
  if (!contest) return score;

  // Apply time penalty if submission is during contest
  const startTime = new Date(contest.date);
  const endTime = new Date(
    startTime.getTime() + parseInt(contest.duration) * 60000
  );

  if (submissionTime >= startTime && submissionTime <= endTime) {
    // Calculate time elapsed as a fraction of total contest duration
    const totalDuration = endTime - startTime;
    const elapsed = submissionTime - startTime;
    const timeRatio = elapsed / totalDuration;

    // Apply small penalty for later submissions (e.g., 10% maximum)
    const penalty = 0.1 * timeRatio * score;

    score = Math.max(Math.floor(score - penalty), 1); // Ensure at least 1 point
  }

  return score;
}

// Clean up temporary files
async function cleanup(...files) {
  for (const file of files) {
    try {
      // Check if file exists before attempting to delete
      try {
        await fs.access(file);
        await fs.unlink(file);
      } catch (accessError) {
        // File doesn't exist, no need to delete
        continue;
      }
    } catch (error) {
      console.error(`Failed to delete ${file}:`, error);
    }
  }
}
