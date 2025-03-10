// src/components/User/Dashboard/DashboardPage.jsx
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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Trophy,
  Calendar,
  BookOpen,
  ArrowRight,
  Clock,
  Star,
  Code,
  Activity,
  BookMarked,
  Settings,
  User,
  FileCode,
  CheckCircle,
  BarChart2,
  List,
} from "lucide-react";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const userProfile = {
    name: "Ahmed Khan",
    username: "ahmed_cp",
    email: "ahmed@example.com",
    avatar: "/avatar-placeholder.jpg",
    joinDate: "January 2024",
    ranking: 7,
    totalPoints: 620,
    contestsParticipated: 15,
    problemsSolved: 187,
    badges: [
      { name: "Dynamic Programming Expert", type: "skill" },
      { name: "Top 10 Finisher", type: "achievement" },
      { name: "Contest Winner - May 2024", type: "achievement" },
    ],
  };

  // Recent contest performance
  const recentContests = [
    {
      id: 1,
      name: "Weekly Algorithm Contest #24",
      date: "May 18, 2024",
      rank: 3,
      solved: "5/7",
      points: 820,
    },
    {
      id: 2,
      name: "Graph Theory Special",
      date: "May 10, 2024",
      rank: 5,
      solved: "4/6",
      points: 720,
    },
    {
      id: 3,
      name: "Monthly IUPC Style Contest",
      date: "April 28, 2024",
      rank: 12,
      solved: "6/10",
      points: 650,
    },
  ];

  // Skills data for radar chart
  const skillsData = [
    { category: "Dynamic Programming", value: 85 },
    { category: "Graph Algorithms", value: 75 },
    { category: "String Algorithms", value: 60 },
    { category: "Greedy Algorithms", value: 90 },
    { category: "Data Structures", value: 70 },
  ];

  // Progress over time
  const progressData = [
    { month: "Jan", points: 350 },
    { month: "Feb", points: 400 },
    { month: "Mar", points: 450 },
    { month: "Apr", points: 520 },
    { month: "May", points: 620 },
  ];

  // Problems solved by category
  const problemCategoryData = [
    { name: "Dynamic Programming", value: 42 },
    { name: "Graph Algorithms", value: 35 },
    { name: "String Manipulation", value: 28 },
    { name: "Greedy Algorithms", value: 45 },
    { name: "Data Structures", value: 37 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Recent submissions
  const recentSubmissions = [
    {
      id: 1,
      problem: "Maximum Subarray Sum",
      status: "Accepted",
      language: "C++",
      timestamp: "2 hours ago",
      runtime: "120ms",
    },
    {
      id: 2,
      problem: "Shortest Path in Binary Matrix",
      status: "Accepted",
      language: "C++",
      timestamp: "1 day ago",
      runtime: "85ms",
    },
    {
      id: 3,
      problem: "Minimum Spanning Tree",
      status: "Wrong Answer",
      language: "Python",
      timestamp: "2 days ago",
      runtime: "N/A",
    },
    {
      id: 4,
      problem: "Binary Tree Maximum Path Sum",
      status: "Accepted",
      language: "Java",
      timestamp: "3 days ago",
      runtime: "150ms",
    },
  ];

  // Upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Weekly Algorithm Contest",
      date: "May 25, 2024",
      time: "3:00 PM",
      registered: true,
    },
    {
      id: 2,
      title: "Dynamic Programming Workshop",
      date: "May 28, 2024",
      time: "5:00 PM",
      registered: true,
    },
  ];

  // Bookmarked resources
  const bookmarkedResources = [
    {
      id: 1,
      title: "Dynamic Programming",
      type: "Resource",
      date: "Bookmarked 2 weeks ago",
    },
    {
      id: 2,
      title: "CP Roadmap",
      type: "Resource",
      date: "Bookmarked 1 month ago",
    },
    {
      id: 3,
      title: "Common CP Mistakes to Avoid",
      type: "Blog",
      date: "Bookmarked 3 days ago",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>

      {/* User Profile Card */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <Card className="col-span-3 md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback>
                {userProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{userProfile.name}</CardTitle>
              <CardDescription>@{userProfile.username}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Rank</span>
                  <span className="font-medium flex items-center">
                    #{userProfile.ranking}{" "}
                    <Trophy className="ml-1 h-4 w-4 text-amber-500" />
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Points</span>
                  <span className="font-medium">{userProfile.totalPoints}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Contests</span>
                  <span className="font-medium">
                    {userProfile.contestsParticipated}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Problems</span>
                  <span className="font-medium">
                    {userProfile.problemsSolved}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-medium mb-2">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.badges.map((badge, index) => (
                    <Badge
                      key={index}
                      variant={
                        badge.type === "achievement" ? "default" : "outline"
                      }
                      className={
                        badge.type === "achievement"
                          ? ""
                          : "bg-primary/10 text-primary border-primary/20"
                      }
                    >
                      {badge.type === "achievement" && (
                        <Star className="mr-1 h-3 w-3" />
                      )}
                      {badge.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                View Full Profile
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Stats */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="points"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-primary">#7</div>
                <div className="text-xs text-muted-foreground">
                  Current Rank
                </div>
              </div>
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-primary">620</div>
                <div className="text-xs text-muted-foreground">
                  Total Points
                </div>
              </div>
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-primary">15</div>
                <div className="text-xs text-muted-foreground">Contests</div>
              </div>
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-primary">187</div>
                <div className="text-xs text-muted-foreground">
                  Problems Solved
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-5 md:w-auto w-full">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="contests" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Contests</span>
          </TabsTrigger>
          <TabsTrigger value="submissions" className="flex items-center gap-1">
            <FileCode className="h-4 w-4" />
            <span className="hidden sm:inline">Submissions</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Contests</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recentContests.slice(0, 3).map((contest) => (
                    <li
                      key={contest.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{contest.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{contest.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Rank: {contest.rank}</p>
                        <p className="text-sm text-muted-foreground">
                          {contest.solved} solved • {contest.points} pts
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="ml-auto">
                  <Link to="/contests/history">
                    View all contests <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Problems by Category</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={problemCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {problemCategoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recentSubmissions.slice(0, 3).map((submission) => (
                    <li
                      key={submission.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{submission.problem}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{submission.timestamp}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          submission.status === "Accepted"
                            ? "default"
                            : "destructive"
                        }
                        className={
                          submission.status === "Accepted" ? "bg-green-500" : ""
                        }
                      >
                        {submission.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="ml-auto">
                  <Link to="/submissions">
                    View all submissions <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <li
                      key={event.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {event.date} • {event.time}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        Registered
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="ml-auto">
                  <Link to="/events">
                    View all events <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Contests Tab */}
        <TabsContent value="contests">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contest History</CardTitle>
                <CardDescription>
                  Your performance in previous contests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contest</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Problems Solved</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentContests.map((contest) => (
                      <TableRow key={contest.id}>
                        <TableCell className="font-medium">
                          {contest.name}
                        </TableCell>
                        <TableCell>{contest.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={contest.rank <= 3 ? "default" : "outline"}
                          >
                            {contest.rank}
                          </Badge>
                        </TableCell>
                        <TableCell>{contest.solved}</TableCell>
                        <TableCell className="text-right">
                          {contest.points}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto" asChild>
                  <Link to="/contests/history">Load more</Link>
                </Button>
              </CardFooter>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                  <CardDescription>
                    Your contest ranking over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={progressData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="points"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skill Breakdown</CardTitle>
                  <CardDescription>
                    Strengths based on problem categories
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={skillsData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="category" type="category" width={100} />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))">
                          {skillsData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Submission History</CardTitle>
                <CardDescription>
                  Your recent problem submissions
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Code className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <List className="mr-2 h-4 w-4" />
                  Sort
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Problem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Runtime</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        <Link
                          to={`/problems/${submission.id}`}
                          className="hover:text-primary"
                        >
                          {submission.problem}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            submission.status === "Accepted"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            submission.status === "Accepted"
                              ? "bg-green-500"
                              : ""
                          }
                        >
                          {submission.status === "Accepted" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : null}
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{submission.language}</TableCell>
                      <TableCell>{submission.runtime}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {submission.timestamp}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-between w-full">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page 1 of 5
                </span>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Registered Events</CardTitle>
                <CardDescription>
                  Upcoming events you've registered for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {event.title}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary border-primary/20"
                          >
                            Registered
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {event.date} • {event.time}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/events/${event.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" asChild>
                  <Link to="/events">Browse More Events</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Past Events</CardTitle>
                <CardDescription>
                  Events you've previously attended
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">
                          Dynamic Programming Workshop
                        </CardTitle>
                        <Badge variant="secondary">Attended</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>April 15, 2024 • 4:00 PM</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/resources/dynamic-programming">
                          View Materials
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bookmarked Resources</CardTitle>
                <CardDescription>
                  Quick access to saved learning materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {bookmarkedResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded">
                          {resource.type === "Resource" ? (
                            <BookOpen className="h-4 w-4 text-primary" />
                          ) : (
                            <BookMarked className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {resource.date}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/resources/${resource.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild className="ml-auto">
                  <Link to="/resources">
                    Explore all resources{" "}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Resources</CardTitle>
                <CardDescription>
                  Based on your recent learning activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Graph Algorithms
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        Advanced techniques for solving graph problems: network
                        flow, minimum spanning trees and more.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">Advanced</Badge>
                        <Badge variant="outline">Algorithms</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/resources/graph-algorithms">
                          Open Resource
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <BookMarked className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Contest Strategies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        Effective strategies for time management and problem
                        selection during competitive programming contests.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">Strategy</Badge>
                        <Badge variant="outline">Technique</Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/resources/contest-strategies">
                          Open Resource
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <BookMarked className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="mx-auto">
                  View more recommendations
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Proficiency Tab - An extra useful tab */}
        <TabsContent value="proficiency" className="hidden">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Assessment</CardTitle>
                <CardDescription>
                  Track your progress in different problem categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillsData.map((skill, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {skill.category}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {skill.value}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${skill.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Future Contests */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Upcoming Contests</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Weekly Algorithm Contest #25
                  </CardTitle>
                  <CardDescription>May 25, 2024 • 3:00 PM</CardDescription>
                </div>
                <Badge variant="secondary">2 days left</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Test your skills with 7 algorithmic problems across various
                difficulty levels.
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>2 hours</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="mr-1 h-3 w-3" />
                  <span>Rating: +/-</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  <span>120 registered</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="default" className="w-full" asChild>
                <Link to="/contests/25">Register Now</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Dynamic Programming Special
                  </CardTitle>
                  <CardDescription>May 30, 2024 • 5:00 PM</CardDescription>
                </div>
                <Badge variant="secondary">7 days left</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                A specialized contest focusing exclusively on dynamic
                programming challenges.
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>3 hours</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="mr-1 h-3 w-3" />
                  <span>Rating: +/-</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  <span>56 registered</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contests/dp-special">Register Now</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    Monthly IUPC Style Contest
                  </CardTitle>
                  <CardDescription>June 5, 2024 • 10:00 AM</CardDescription>
                </div>
                <Badge variant="secondary">13 days left</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Modeled after ICPC-style competitions with team registration
                available.
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>5 hours</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="mr-1 h-3 w-3" />
                  <span>Rating: +/-</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  <span>23 teams</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contests/monthly-iupc">Register Team</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
