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

import { useAuth } from "@/context/AuthContext";

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

    const { user, isAuthenticated } = useAuth();

  // Create a temp user ID if needed
  const getUserId = () => {
    if (isAuthenticated() && user) {
      return user._id; // Use the authenticated user's ID
    }

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
        {/* Better navigation with sticky controls */}
        <div className="sticky top-4 z-10 mb-6 flex justify-between items-center bg-background/95 backdrop-blur-sm p-3 rounded-lg shadow-sm border">
          <Button
            variant="outline"
            onClick={() => navigate(`/contests/${contestId}/lobby`)}
            className="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Contest
          </Button>
          {problem.difficulty && (
            <div className="flex gap-2">
              <Badge variant={problem.difficulty === "Easy" ? "success" : problem.difficulty === "Medium" ? "warning" : "destructive"} className="px-3 py-1">
                {problem.difficulty}
              </Badge>
              {problem.timeLimit && (
                <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {problem.timeLimit}ms
                </Badge>
              )}
              {problem.memoryLimit && (
                <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                    <line x1="12" y1="6" x2="12" y2="10"/>
                    <line x1="12" y1="14" x2="12" y2="18"/>
                  </svg>
                  {problem.memoryLimit}MB
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced problem description section */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-t-4 border-t-primary">
              <CardHeader className="bg-muted/40">
                <CardTitle className="text-2xl font-bold">{problem.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="prose max-w-none dark:prose-invert">
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>
                      </svg>
                      Description
                    </h3>
                    <pre className="mt-3">{problem.description}</pre>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                      </svg>
                      Input Format
                    </h3>
                    <pre className="mt-3">{problem.inputFormat}</pre>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                      </svg>
                      Output Format
                    </h3>
                    <pre className="mt-3">{problem.outputFormat}</pre>
                  </div>

                  {/* Enhanced example test cases */}
                  {problem.testCases &&
                    problem.testCases.filter((tc) => tc.isExample).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        Examples
                      </h3>
                      <div className="mt-4 grid gap-6">
                        {problem.testCases
                          .filter((tc) => tc.isExample)
                          .map((testCase, idx) => (
                          <div key={idx} className="bg-muted/30 rounded-lg overflow-hidden border transition-all hover:shadow-md">
                            <div className="bg-primary/10 px-4 py-2 font-medium">
                              Example {idx + 1}
                            </div>
                            <div className="p-4 grid gap-4">
                              <div>
                                <div className="flex items-center gap-2 text-sm font-medium mb-2 text-muted-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m15 15-6 6"/>
                                    <path d="m21 15-12 12"/>
                                    <path d="M8 9h7v7"/>
                                    <path d="M9 1v8"/>
                                    <path d="M1 9h8"/>
                                  </svg>
                                  Input:
                                </div>
                                <pre className="whitespace-pre-wrap bg-muted/50 p-3 rounded border text-sm overflow-x-auto">
                                  {testCase.input}
                                </pre>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 text-sm font-medium mb-2 text-muted-foreground">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m9 9-6 6"/>
                                    <path d="m3 9 6 6"/>
                                    <path d="M15 15h7v7"/>
                                    <path d="M15 9h7v7"/>
                                  </svg>
                                  Output:
                                </div>
                                <pre className="whitespace-pre-wrap bg-muted/50 p-3 rounded border text-sm overflow-x-auto">
                                  {testCase.output}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
