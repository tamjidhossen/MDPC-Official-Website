import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { useToast } from "../../../hooks/use-toast";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import axios from "axios";

const ProblemDetailPage = () => {
  const { contestId, problemId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [submissionResult, setSubmissionResult] = useState(null);

  // Create a temp user ID if needed
  const getUserId = () => {
    let tempUserId = localStorage.getItem("tempUserId");
    if (!tempUserId) {
      tempUserId = "user_" + Date.now();
      localStorage.setItem("tempUserId", tempUserId);
    }
    return tempUserId;
  };

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        setLoading(true);
        // No token needed
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/problems/${problemId}`
        );

        setProblem(response.data.data.problem);
      } catch (error) {
        console.error("Error fetching problem details:", error);
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to load problem details",
          variant: "destructive",
        });

        // Redirect to lobby on error
        navigate(`/contests/${contestId}/lobby`);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemDetails();
  }, [contestId, problemId, navigate, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter your code before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      setSubmissionResult(null);

      // Submit with temp user ID instead of requiring token
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/judge/submit`,
        {
          code,
          problemId,
          contestId,
          language,
          userId: getUserId(),
        }
      );

      setSubmissionResult(response.data.data.submission);

      toast({
        title: "Submission received",
        description: `Verdict: ${response.data.data.submission.verdict}`,
        variant:
          response.data.data.submission.verdict === "Accepted"
            ? "default"
            : "destructive",
      });
    } catch (error) {
      console.error("Error submitting code:", error);
      toast({
        title: "Submission failed",
        description:
          error.response?.data?.message || "Failed to submit your code",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Function to get color for verdict badge
  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case "Accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Wrong Answer":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Compilation Error":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Runtime Error":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "Time Limit Exceeded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="container my-8 px-4">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold">Problem not found</h2>
          <p className="mt-2">The problem you're looking for doesn't exist.</p>
          <Button
            onClick={() => navigate(`/contests/${contestId}/lobby`)}
            className="mt-4"
          >
            Back to Contest Lobby
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back to lobby button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(`/contests/${contestId}/lobby`)}
          >
            ← Back to Contest
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Problem description section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{problem.name}</CardTitle>
                    <CardDescription>
                      <Badge className="mt-2">
                        {problem.difficulty || "Medium"}
                      </Badge>
                      {problem.timeLimit && (
                        <Badge className="ml-2 mt-2">
                          Time: {problem.timeLimit}ms
                        </Badge>
                      )}
                      {problem.memoryLimit && (
                        <Badge className="ml-2 mt-2">
                          Memory: {problem.memoryLimit}MB
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none dark:prose-invert">
                  <h3>Description</h3>
                  <p>{problem.description}</p>

                  <h3>Input Format</h3>
                  <p>{problem.inputFormat}</p>

                  <h3>Output Format</h3>
                  <p>{problem.outputFormat}</p>

                  {/* Display example test cases */}
                  {problem.testCases &&
                    problem.testCases.filter((tc) => tc.isExample).length >
                      0 && (
                      <>
                        <h3>Examples</h3>
                        {problem.testCases
                          .filter((tc) => tc.isExample)
                          .map((testCase, idx) => (
                            <div key={idx} className="mb-6">
                              <h4>Example {idx + 1}</h4>
                              <div className="bg-muted p-4 rounded-md mb-2">
                                <h5 className="font-semibold">Input:</h5>
                                <pre className="whitespace-pre-wrap">
                                  {testCase.input}
                                </pre>
                              </div>
                              <div className="bg-muted p-4 rounded-md">
                                <h5 className="font-semibold">Output:</h5>
                                <pre className="whitespace-pre-wrap">
                                  {testCase.output}
                                </pre>
                              </div>
                            </div>
                          ))}
                      </>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code submission section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Submit Your Solution</CardTitle>
                <CardDescription>
                  Write your code and submit it for evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Textarea
                    className="min-h-[300px] font-mono"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={
                      language === "cpp"
                        ? "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}"
                        : language === "java"
                        ? "public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}"
                        : 'def main():\n    # Your code here\n    pass\n\nif __name__ == "__main__":\n    main()'
                    }
                  />

                  <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Solution"}
                  </Button>
                </form>

                {/* Submission result */}
                {submissionResult && (
                  <div className="mt-6 border rounded-md p-4">
                    <h3 className="font-semibold text-lg mb-2">Result</h3>
                    <div className="flex items-center mb-2">
                      <span className="font-medium mr-2">Verdict:</span>
                      <Badge
                        className={getVerdictColor(submissionResult.verdict)}
                      >
                        {submissionResult.verdict}
                      </Badge>
                    </div>

                    <div className="flex items-center mb-2">
                      <span className="font-medium mr-2">Score:</span>
                      <span>{submissionResult.score}</span>
                    </div>

                    <div className="flex items-center">
                      <span className="font-medium mr-2">Execution Time:</span>
                      <span>
                        {Math.round(submissionResult.executionTime)}ms
                      </span>
                    </div>

                    {submissionResult.testResults && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Test Results:</h4>
                        <div className="space-y-2">
                          {submissionResult.testResults.map((result, idx) => (
                            <div key={idx} className="flex items-center">
                              <span className="mr-2">
                                Test {result.testCase + 1}:
                              </span>
                              <Badge
                                className={getVerdictColor(result.verdict)}
                              >
                                {result.verdict}
                              </Badge>
                              {result.executionTime && (
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {Math.round(result.executionTime)}ms
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
