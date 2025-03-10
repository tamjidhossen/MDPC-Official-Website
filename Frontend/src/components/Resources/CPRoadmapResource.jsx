// src/components/Resources/CPRoadmapResource.jsx
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
import {
  ArrowLeft,
  BookOpen,
  Code,
  CodepenIcon,
  ExternalLink,
  FileText,
  GraduationCap,
  LucideCode,
  Layers,
  ArrowUpRight,
  BookMarked,
  MapPin,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CPRoadmapResource = () => {
  const [activeSection, setActiveSection] = useState("beginner");

  // Platform recommendations
  const platforms = [
    {
      name: "CodeForces",
      description:
        "Popular competitive programming platform with regular contests",
      link: "https://codeforces.com",
      difficulty: "Beginner to Advanced",
      icon: <CodepenIcon className="h-8 w-8 text-primary" />,
    },
    {
      name: "LeetCode",
      description:
        "Platform with focus on interview preparation and algorithm practice",
      link: "https://leetcode.com",
      difficulty: "Beginner to Advanced",
      icon: <Code className="h-8 w-8 text-primary" />,
    },
    {
      name: "HackerRank",
      description: "Good for beginners with structured learning tracks",
      link: "https://www.hackerrank.com",
      difficulty: "Beginner to Intermediate",
      icon: <Layers className="h-8 w-8 text-primary" />,
    },
    {
      name: "AtCoder",
      description:
        "Japanese competitive programming platform with high-quality problems",
      link: "https://atcoder.jp",
      difficulty: "Intermediate to Advanced",
      icon: <LucideCode className="h-8 w-8 text-primary" />,
    },
  ];

  // Study plans
  const beginner = [
    {
      title: "Programming Fundamentals",
      topics: [
        "Variables & Data Types",
        "Control Flow",
        "Functions",
        "Basic I/O",
      ],
      resources: [
        {
          name: "C++ for Competitive Programming",
          link: "https://www.geeksforgeeks.org/c-plus-plus/",
        },
        {
          name: "Basic Data Types & STL",
          link: "https://www.topcoder.com/community/competitive-programming/tutorials/power-up-c-with-the-standard-template-library-part-1/",
        },
      ],
    },
    {
      title: "Basic Data Structures",
      topics: ["Arrays", "Strings", "Stacks", "Queues", "Basic Linked Lists"],
      resources: [
        {
          name: "Data Structures for Beginners",
          link: "https://www.geeksforgeeks.org/data-structures/",
        },
        {
          name: "Array Problems (50 Essential)",
          link: "https://medium.com/techie-delight/top-algorithms-data-structures-concepts-every-computer-science-student-should-know-e0549c67b4ac",
        },
      ],
    },
    {
      title: "Basic Algorithms",
      topics: [
        "Linear Search",
        "Binary Search",
        "Bubble Sort",
        "Insertion Sort",
        "Selection Sort",
      ],
      resources: [
        {
          name: "Sorting Algorithms Visualization",
          link: "https://visualgo.net/en/sorting",
        },
        {
          name: "Binary Search Tutorial",
          link: "https://www.topcoder.com/community/competitive-programming/tutorials/binary-search/",
        },
      ],
    },
    {
      title: "Problem Solving Approach",
      topics: [
        "Breaking down problems",
        "Time & Space Complexity",
        "Contest strategies",
      ],
      resources: [
        {
          name: "How to approach CP problems",
          link: "https://codeforces.com/blog/entry/66909",
        },
        {
          name: "A2OJ Ladder (First 100 problems)",
          link: "https://a2oj.com/Ladders.html",
        },
      ],
    },
  ];

  const intermediate = [
    {
      title: "Advanced Data Structures",
      topics: [
        "Trees",
        "Heaps",
        "Hash Tables",
        "Disjoint Set Union (DSU)",
        "Segment Trees",
      ],
      resources: [
        {
          name: "Tree Algorithms Guide",
          link: "https://cp-algorithms.com/data_structures/segment_tree.html",
        },
        {
          name: "Disjoint Set Union Tutorial",
          link: "https://cp-algorithms.com/data_structures/disjoint_set_union.html",
        },
      ],
    },
    {
      title: "Graph Algorithms",
      topics: [
        "Graph Representation",
        "DFS & BFS",
        "Shortest Path Algorithms",
        "Minimum Spanning Tree",
        "Topological Sort",
      ],
      resources: [
        {
          name: "Graph Algorithms Explained",
          link: "https://cp-algorithms.com/graph/breadth-first-search.html",
        },
        {
          name: "Dijkstra, Bellman-Ford & Floyd-Warshall",
          link: "https://cp-algorithms.com/graph/dijkstra.html",
        },
      ],
    },
    {
      title: "Dynamic Programming",
      topics: [
        "DP Foundations",
        "1D and 2D DP",
        "Knapsack Problems",
        "DP on Trees",
        "Bitmask DP",
      ],
      resources: [
        {
          name: "Dynamic Programming Guide",
          link: "/resources/dynamic-programming",
        },
        {
          name: "AtCoder DP Contest",
          link: "https://atcoder.jp/contests/dp/tasks",
        },
      ],
    },
    {
      title: "Greedy Algorithms",
      topics: [
        "Greedy Approach",
        "Activity Selection",
        "Huffman Coding",
        "Fractional Knapsack",
      ],
      resources: [
        {
          name: "Greedy Algorithms Introduction",
          link: "https://www.geeksforgeeks.org/greedy-algorithms/",
        },
        {
          name: "When to use Greedy vs DP",
          link: "https://codeforces.com/blog/entry/13713",
        },
      ],
    },
  ];

  const advanced = [
    {
      title: "Advanced Algorithms",
      topics: [
        "Network Flow",
        "Bipartite Matching",
        "String Algorithms (KMP, Z, Suffix Array)",
        "Lowest Common Ancestor",
      ],
      resources: [
        {
          name: "Network Flow Tutorial",
          link: "https://cp-algorithms.com/graph/flow_networks.html",
        },
        {
          name: "String Processing Algorithms",
          link: "https://cp-algorithms.com/string/prefix-function.html",
        },
      ],
    },
    {
      title: "Mathematics for CP",
      topics: [
        "Number Theory",
        "Combinatorics",
        "Linear Algebra",
        "Probability",
        "Game Theory",
      ],
      resources: [
        {
          name: "Number Theory for CP",
          link: "https://www.codechef.com/wiki/tutorial-number-theory/",
        },
        {
          name: "Combinatorics Problems",
          link: "https://codeforces.com/blog/entry/66951",
        },
      ],
    },
    {
      title: "Advanced Data Structures",
      topics: [
        "Sparse Tables",
        "Treaps",
        "Sqrt Decomposition",
        "Fenwick Trees",
        "Persistent Data Structures",
      ],
      resources: [
        {
          name: "Advanced DS Overview",
          link: "https://codeforces.com/blog/entry/15729",
        },
        {
          name: "Sqrt Decomposition Technique",
          link: "https://cp-algorithms.com/data_structures/sqrt_decomposition.html",
        },
      ],
    },
    {
      title: "ICPC/IOI Training",
      topics: [
        "Team Strategies",
        "Contest Heuristics",
        "Advanced Problem Solving",
      ],
      resources: [
        {
          name: "Preparing for ICPC World Finals",
          link: "https://codeforces.com/blog/entry/17842",
        },
        {
          name: "IOI Training Resources",
          link: "https://ioinformatics.org/page/getting-started/10",
        },
      ],
    },
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
            <Badge className="mb-3 px-3 py-1 text-sm font-medium">
              All Levels
            </Badge>
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              Complete CP Roadmap
            </h1>
            <p className="text-muted-foreground text-lg">
              A comprehensive guide to competitive programming from beginner to
              advanced levels, with topic-wise resources.
            </p>
          </div>

          {/* Navigation tabs */}
          <Tabs
            defaultValue="beginner"
            onValueChange={setActiveSection}
            value={activeSection}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <div className="mt-8">
              <TabsContent value="beginner">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <h2 className="text-3xl font-bold mb-6">
                    Beginner Stage (0-3 months)
                  </h2>
                  <p className="text-lg leading-relaxed mb-6">
                    Start your competitive programming journey by building a
                    strong foundation in programming basics, simple data
                    structures, and algorithmic thinking. Focus on solving a lot
                    of easy problems.
                  </p>

                  <div className="mt-8 space-y-8">
                    {beginner.map((section, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-8 h-8 text-sm font-bold">
                                {index + 1}
                              </span>
                              {section.title}
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {section.topics.map((topic, i) => (
                              <Badge
                                variant="outline"
                                key={i}
                                className="px-2 py-1"
                              >
                                {topic}
                              </Badge>
                            ))}
                          </div>
                          <div className="space-y-2 mt-4">
                            <p className="font-semibold">
                              Recommended Resources:
                            </p>
                            <ul className="space-y-1">
                              {section.resources.map((resource, i) => (
                                <li key={i}>
                                  <a
                                    href={resource.link}
                                    target={
                                      resource.link.startsWith("http")
                                        ? "_blank"
                                        : "_self"
                                    }
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline inline-flex items-center"
                                  >
                                    {resource.name}
                                    <ArrowUpRight className="ml-1 h-3 w-3" />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="intermediate">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <h2 className="text-3xl font-bold mb-6">
                    Intermediate Stage (3-12 months)
                  </h2>
                  <p className="text-lg leading-relaxed mb-6">
                    Build on your foundation by learning more advanced data
                    structures and algorithms. Start participating regularly in
                    contests and improve your problem-solving speed.
                  </p>

                  <div className="mt-8 space-y-8">
                    {intermediate.map((section, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-8 h-8 text-sm font-bold">
                                {index + 1}
                              </span>
                              {section.title}
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {section.topics.map((topic, i) => (
                              <Badge
                                variant="outline"
                                key={i}
                                className="px-2 py-1"
                              >
                                {topic}
                              </Badge>
                            ))}
                          </div>
                          <div className="space-y-2 mt-4">
                            <p className="font-semibold">
                              Recommended Resources:
                            </p>
                            <ul className="space-y-1">
                              {section.resources.map((resource, i) => (
                                <li key={i}>
                                  <a
                                    href={resource.link}
                                    target={
                                      resource.link.startsWith("http")
                                        ? "_blank"
                                        : "_self"
                                    }
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline inline-flex items-center"
                                  >
                                    {resource.name}
                                    <ArrowUpRight className="ml-1 h-3 w-3" />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <h2 className="text-3xl font-bold mb-6">
                    Advanced Stage (1+ years)
                  </h2>
                  <p className="text-lg leading-relaxed mb-6">
                    Master complex algorithms and data structures. Focus on
                    specialized topics and optimize your approach to difficult
                    problems. Prepare for high-level competitions.
                  </p>

                  <div className="mt-8 space-y-8">
                    {advanced.map((section, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary w-8 h-8 text-sm font-bold">
                                {index + 1}
                              </span>
                              {section.title}
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {section.topics.map((topic, i) => (
                              <Badge
                                variant="outline"
                                key={i}
                                className="px-2 py-1"
                              >
                                {topic}
                              </Badge>
                            ))}
                          </div>
                          <div className="space-y-2 mt-4">
                            <p className="font-semibold">
                              Recommended Resources:
                            </p>
                            <ul className="space-y-1">
                              {section.resources.map((resource, i) => (
                                <li key={i}>
                                  <a
                                    href={resource.link}
                                    target={
                                      resource.link.startsWith("http")
                                        ? "_blank"
                                        : "_self"
                                    }
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline inline-flex items-center"
                                  >
                                    {resource.name}
                                    <ArrowUpRight className="ml-1 h-3 w-3" />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Platform recommendations section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Recommended Platforms</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {platforms.map((platform, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {platform.icon}
                        <CardTitle>{platform.name}</CardTitle>
                      </div>
                      <Badge variant="outline">{platform.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-muted-foreground">
                      {platform.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      asChild
                    >
                      <a
                        href={platform.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Platform <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Practice tips section */}
          <div className="mt-16 p-8 border rounded-lg bg-muted/30">
            <h2 className="text-2xl font-bold mb-4">Practice Tips</h2>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Consistency over intensity:</strong> Solve 2-3
                  problems daily rather than many problems irregularly
                </span>
              </li>
              <li className="flex gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Virtual contests:</strong> Participate in past
                  contests in a timed environment to improve speed
                </span>
              </li>
              <li className="flex gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Upsolve:</strong> After contests, attempt to solve
                  problems you couldn't solve during the contest
                </span>
              </li>
              <li className="flex gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Study editorials:</strong> Read solutions of problems
                  you solved to learn better approaches
                </span>
              </li>
              <li className="flex gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Join communities:</strong> Participate in forums like
                  Codeforces, LeetCode, or Discord servers
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar with resources */}
        <div className="w-full lg:w-72 shrink-0">
          <Card className="sticky top-8 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold">
                Additional Resources
              </CardTitle>
              <CardDescription>
                Helpful links for your CP journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3 text-left"
                asChild
              >
                <a
                  href="https://cses.fi/book/book.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookOpen className="mr-3 h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="font-medium">CSES Handbook</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      CP Handbook
                    </div>
                  </div>
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3 text-left"
                asChild
              >
                <a
                  href="https://cp-algorithms.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="mr-3 h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="font-medium">CP Algorithms</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Algorithms used in CP
                    </div>
                  </div>
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3 text-left"
                asChild
              >
                <a
                  href="https://www.youtube.com/c/Errichto"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookMarked className="mr-3 h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="font-medium">Errichto YouTube</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Educational CP videos
                    </div>
                  </div>
                </a>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3 text-left"
                asChild
              >
                <a
                  href="https://codeforces.com/blog/entry/57282"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GraduationCap className="mr-3 h-4 w-4 text-primary shrink-0" />
                  <div>
                    <div className="font-medium">
                      CP Tools
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Resources and extensions
                    </div>
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

export default CPRoadmapResource;
