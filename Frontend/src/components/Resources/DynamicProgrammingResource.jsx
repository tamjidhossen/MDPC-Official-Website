import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, ExternalLink, FileText, BookMarked, Code } from "lucide-react";

const DynamicProgrammingResource = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  // Mock data for DP practice problems
  const practiceProblems = [
    // ...existing problem data...
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-10">
        <Button variant="outline" asChild className="hover:bg-muted">
          <Link to="/resources">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resources
          </Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main content */}
        <div className="flex-grow">
          <div className="mb-10">
            <Badge className="mb-3 px-3 py-1 text-sm font-medium">Intermediate</Badge>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Dynamic Programming</h1>
            <p className="text-muted-foreground text-lg">
              Master DP with step-by-step explanations and practice problems from various online judges.
            </p>
          </div>

          {/* Navigation tabs */}
          <div className="flex border-b mb-8 overflow-x-auto">
            {["introduction", "techniques", "practice"].map((section) => (
              <Button
                key={section}
                variant="ghost"
                className={`rounded-none px-6 py-3 font-medium transition-all ${
                  activeSection === section 
                    ? "border-b-2 border-primary text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Button>
            ))}
          </div>

          {/* Content sections with improved styling */}
          {activeSection === "introduction" && (
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h2 className="text-3xl font-bold mb-6">Introduction to Dynamic Programming</h2>
              <p className="text-lg leading-relaxed mb-6">
                Dynamic Programming (DP) is a method for solving complex problems by breaking them down into simpler subproblems. 
                It is applicable to problems exhibiting the properties of overlapping subproblems and optimal substructure.
              </p>
              
              <h3 className="text-2xl font-semibold mt-8 mb-4">When to use Dynamic Programming</h3>
              <ul className="space-y-2 mb-6">
                <li>The problem can be broken down into "overlapping subproblems" - smaller versions of the original problem that are re-used multiple times</li>
                <li>The problem has an "optimal substructure" - an optimal solution can be constructed from optimal solutions of its subproblems</li>
              </ul>
              
              <h3 className="text-2xl font-semibold mt-8 mb-4">Key Concepts</h3>
              <div className="space-y-4 mb-6">
                <div className="p-4 border-l-4 border-primary bg-muted/30 rounded">
                  <p className="font-semibold mb-2">Memoization</p>
                  <p className="text-muted-foreground">
                    Storing the results of expensive function calls and returning the cached result when the same inputs occur again
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-primary bg-muted/30 rounded">
                  <p className="font-semibold mb-2">Tabulation</p>
                  <p className="text-muted-foreground">
                    Building up a table from the bottom up and returning the last entry
                  </p>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl my-8 overflow-hidden shadow-sm">
                <div className="bg-muted px-6 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <p className="font-semibold">Example: Fibonacci Sequence</p>
                  </div>
                </div>
                <pre className="bg-background p-6 rounded-b-xl overflow-x-auto text-sm">
                  <code>{`// Recursive with memoization
function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}

// Iterative with tabulation
function fibTab(n) {
  if (n <= 1) return n;
  let dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp[n];
}`}</code>
                </pre>
              </div>
            </div>
          )}

          {activeSection === "techniques" && (
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h2 className="text-3xl font-bold mb-6">Common DP Techniques</h2>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-8 h-8 text-sm font-bold">1</span>
                    Top-down with Memoization
                  </h3>
                  <p className="text-lg leading-relaxed mb-4">
                    Start with the original problem and recursively break it down into subproblems, storing solutions to avoid recomputation.
                  </p>
                  <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-muted px-6 py-3 border-b">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-primary" />
                        <p className="font-semibold">Implementation</p>
                      </div>
                    </div>
                    <pre className="bg-background p-6 rounded-b-xl overflow-x-auto text-sm">
                      <code>{`function topDownDP(n, memo = {}) {
  // Check if we've already solved this
  if (n in memo) return memo[n];
  
  // Base case
  if (n == 0) return baseValue;
  
  // Recursive case with memoization
  let result = /* recursive formula */;
  memo[n] = result;
  return result;
}`}</code>
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-8 h-8 text-sm font-bold">2</span>
                    Bottom-up with Tabulation
                  </h3>
                  <p className="text-lg leading-relaxed mb-4">
                    Start with the smallest subproblems and work your way up to the original problem, filling in a table as you go.
                  </p>
                  <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-muted px-6 py-3 border-b">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-primary" />
                        <p className="font-semibold">Implementation</p>
                      </div>
                    </div>
                    <pre className="bg-background p-6 rounded-b-xl overflow-x-auto text-sm">
                      <code>{`function bottomUpDP(n) {
  // Create a table to store results
  let dp = Array(n+1).fill(initialValue);
  
  // Initialize base case
  dp[0] = baseValue;
  
  // Fill table in bottom-up manner
  for (let i = 1; i <= n; i++) {
    dp[i] = /* formula using previous results */;
  }
  
  return dp[n];
}`}</code>
                    </pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-8 h-8 text-sm font-bold">3</span>
                    State Reduction
                  </h3>
                  <p className="text-lg leading-relaxed mb-4">
                    For some problems, you can optimize space complexity by only keeping track of the last few states.
                  </p>
                  <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-muted px-6 py-3 border-b">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-primary" />
                        <p className="font-semibold">Implementation</p>
                      </div>
                    </div>
                    <pre className="bg-background p-6 rounded-b-xl overflow-x-auto text-sm">
                      <code>{`function optimizedSpaceDP(n) {
  // Only store necessary previous states
  let prev = baseValue;
  let current = nextValue;
  
  for (let i = 2; i <= n; i++) {
    let next = /* formula using prev and current */;
    prev = current;
    current = next;
  }
  
  return current;
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "practice" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Practice Problems</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Apply your DP skills by solving these carefully selected problems from various online judges:
              </p>
              
              <div className="grid gap-5">
                {practiceProblems.map((problem, index) => (
                  <Card key={index} className="overflow-hidden border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between p-5">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{problem.name}</h3>
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline"
                            className={`px-2 py-0.5 ${
                              problem.difficulty === "Easy" 
                                ? "bg-green-500/10 text-green-500 border-green-200" 
                                : problem.difficulty === "Medium" 
                                ? "bg-orange-500/10 text-orange-500 border-orange-200" 
                                : "bg-red-500/10 text-red-500 border-red-200"
                            }`}
                          >
                            {problem.difficulty}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{problem.platform}</code>
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a href={problem.link} target="_blank" rel="noopener noreferrer">
                          Solve <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar with improved styling */}
        <div className="w-full lg:w-72 shrink-0">
          <Card className="sticky top-8 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold">Additional Resources</CardTitle>
              <CardDescription>
                Helpful links to enhance your DP knowledge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <Button variant="outline" className="w-full justify-start h-auto py-3 text-left" asChild>
                <a href="https://cp-algorithms.com/dynamic_programming/intro-to-dp.html" target="_blank" rel="noopener noreferrer">
                  <BookOpen className="mr-3 h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="font-medium">CP Algorithms: DP</div>
                    <div className="text-xs text-muted-foreground mt-1">Comprehensive guide to DP</div>
                  </div>
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto py-3 text-left" asChild>
                <a href="https://www.geeksforgeeks.org/dynamic-programming/" target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-3 h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="font-medium">GeeksforGeeks: DP</div>
                    <div className="text-xs text-muted-foreground mt-1">Practice-oriented tutorials</div>
                  </div>
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto py-3 text-left" asChild>
                <a href="https://codeforces.com/blog/entry/43256" target="_blank" rel="noopener noreferrer">
                  <BookMarked className="mr-3 h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="font-medium">DP Tutorial on Codeforces</div>
                    <div className="text-xs text-muted-foreground mt-1">In-depth dp guide</div>
                  </div>
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DynamicProgrammingResource;