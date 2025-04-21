// src/codeRunner.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");


router.post("/run", async (req, res) => {
  try {
    const { code, input, expectedOutput } = req.body;

    if (!code || !input || !expectedOutput) {
      return res.status(400).json({ error: "Missing code/input/output" });
    }

    const filePath = path.join(__dirname, "main.cpp");
    const inputFile = path.join(__dirname, "input.txt");

    fs.writeFileSync(filePath, code);
    fs.writeFileSync(inputFile, input);

    exec(`g++ ${filePath} -o main.exe`, (err, _, stderr) => {
      if (err || stderr) {
        return res.status(400).json({ error: stderr || "Compilation error" });
      }

      exec(`main.exe < ${inputFile}`, (err, stdout, stderr) => {
        if (err || stderr) {
          return res.status(400).json({ error: stderr || "Runtime error" });
        }

        const cleanedOutput = stdout.trim();
        const cleanedExpected = expectedOutput.trim();

        if (cleanedOutput === cleanedExpected) {
          return res.json({ output: `${cleanedOutput}\n✅ Accepted` });
        } else {
          return res.json({
            output: `${cleanedOutput}\n❌ Wrong Answer\nExpected: ${cleanedExpected}`,
          });
        }

      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Server error occurred" });
  }
});

module.exports = router;