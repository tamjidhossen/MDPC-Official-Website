// src/components/User/Dashboard/DashboardPage.jsx
import { useEffect, useState } from "react";
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
  List,
  PanelLeft,
  LogOut,
  ChevronRight,
  Home,
  BarChart2,
  PenTool,
  ChevronDown,
  X,
  Bold,
  Italic,
  Link2,
  ThumbsUp,
  MessageSquare,
  Eye,
  MapPin,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [timeFrame, setTimeFrame] = useState("all-time");
  const [indexFilter, setIndexFilter] = useState("all");
  const [contestTypeFilter, setContestTypeFilter] = useState("all");

  // Hide footer in dashboard
  useEffect(() => {
    // Hide footer when component mounts
    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.display = "none";
    }

    // Show footer when component unmounts
    return () => {
      if (footer) {
        footer.style.display = "";
      }
    };
  }, []);

  // Mock CF user data
  const cfUserProfile = {
    handle: "ahmed_coder",
    rating: 1842,
    maxRating: 1950,
    rank: "expert",
    avatar: "/avatar-placeholder.jpg",
    joinDate: "January 2022",
    lastOnline: "2 hours ago",
    contribution: 15,
    friendsCount: 23,
  };

  // Codeforces rating graph data
  const cfRatingHistory = [
    { contest: "Educational Round 152", date: "Jan 05", rating: 1720 },
    { contest: "Div2 Round 835", date: "Jan 21", rating: 1756 },
    { contest: "Div2 Round 837", date: "Feb 12", rating: 1789 },
    { contest: "Educational Round 154", date: "Mar 05", rating: 1842 },
    { contest: "Div2 Round 841", date: "Mar 25", rating: 1820 },
    { contest: "Div2 Round 845", date: "Apr 10", rating: 1795 },
    { contest: "Educational Round 156", date: "Apr 30", rating: 1842 },
    { contest: "Div2 Round 850", date: "May 15", rating: 1842 },
  ];

  // CF problem analytics data
  const problemIndexData = [
    { index: "A", solved: 45, attempted: 50 },
    { index: "B", solved: 38, attempted: 45 },
    { index: "C", solved: 29, attempted: 40 },
    { index: "D", solved: 18, attempted: 30 },
    { index: "E", solved: 10, attempted: 20 },
    { index: "F", solved: 5, attempted: 15 },
  ];

  const problemRatingData = [
    { rating: "800-999", solved: 40, count: 45 },
    { rating: "1000-1199", solved: 32, count: 40 },
    { rating: "1200-1399", solved: 25, count: 32 },
    { rating: "1400-1599", solved: 18, count: 25 },
    { rating: "1600-1799", solved: 12, count: 18 },
    { rating: "1800-1999", solved: 8, count: 15 },
    { rating: "2000-2199", solved: 5, count: 10 },
    { rating: "2200+", solved: 2, count: 8 },
  ];

  const contestTypeData = [
    { type: "Div. 1", participated: 2, solved: 5 },
    { type: "Div. 2", participated: 15, solved: 42 },
    { type: "Div. 3", participated: 18, solved: 65 },
    { type: "Div. 4", participated: 10, solved: 48 },
    { type: "Educational", participated: 12, solved: 38 },
    { type: "Global", participated: 4, solved: 12 },
  ];

  // Time-filtered problem data
  const timeFilteredData = {
    "last-week": [
      { rating: "800-999", solved: 3, count: 4 },
      { rating: "1000-1199", solved: 2, count: 3 },
      { rating: "1200-1399", solved: 1, count: 2 },
    ],
    "last-month": [
      { rating: "800-999", solved: 8, count: 10 },
      { rating: "1000-1199", solved: 7, count: 9 },
      { rating: "1200-1399", solved: 5, count: 7 },
      { rating: "1400-1599", solved: 3, count: 5 },
    ],
    "last-3-months": [
      { rating: "800-999", solved: 15, count: 18 },
      { rating: "1000-1199", solved: 12, count: 15 },
      { rating: "1200-1399", solved: 10, count: 13 },
      { rating: "1400-1599", solved: 7, count: 10 },
      { rating: "1600-1799", solved: 5, count: 8 },
    ],
    "last-year": [
      { rating: "800-999", solved: 30, count: 35 },
      { rating: "1000-1199", solved: 25, count: 30 },
      { rating: "1200-1399", solved: 20, count: 25 },
      { rating: "1400-1599", solved: 15, count: 20 },
      { rating: "1600-1799", solved: 10, count: 15 },
      { rating: "1800-1999", solved: 7, count: 12 },
    ],
    "all-time": problemRatingData,
  };

  // Draft blogs
  const draftBlogs = [
    {
      id: 1,
      title: "My approach to Dynamic Programming",
      lastEdited: "May 22, 2024",
      status: "draft",
      excerpt: "In this blog, I explain my approach to tackling DP problems...",
    },
    {
      id: 2,
      title: "Graph Theory Made Simple",
      lastEdited: "May 15, 2024",
      status: "draft",
      excerpt: "Understanding graph algorithms and their applications...",
    },
  ];

  // Published blogs
  const publishedBlogs = [
    {
      id: 3,
      title: "How I improved my Codeforces rating",
      publishDate: "April 30, 2024",
      views: 256,
      likes: 45,
      comments: 12,
    },
    {
      id: 4,
      title: "Tips for solving combinatorial problems",
      publishDate: "March 15, 2024",
      views: 432,
      likes: 78,
      comments: 23,
    },
  ];

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Function to get rating color
  const getRatingColor = (rating) => {
    if (rating < 1200) return "#808080"; // Gray for Newbie
    if (rating < 1400) return "#008000"; // Green for Pupil
    if (rating < 1600) return "#03a89e"; // Cyan for Specialist
    if (rating < 1900) return "#0000ff"; // Blue for Expert
    if (rating < 2100) return "#aa00aa"; // Purple for Candidate Master
    if (rating < 2400) return "#ff8c00"; // Orange for Master
    return "#ff0000"; // Red for higher ranks
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Render the current section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverviewSection();
      case "profile":
        return renderProfileSection();
      case "analytics":
        return renderAnalyticsSection();
      case "blogs":
        return renderBlogsSection();
      case "settings":
        return renderSettingsSection();
      default:
        return renderOverviewSection();
    }
  };

  // Overview section
  const renderOverviewSection = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveSection("profile")}
          >
            View Profile
          </Button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">CF Rating</CardTitle>
              <CardDescription>Current performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div
                  className="text-3xl font-bold"
                  style={{ color: getRatingColor(cfUserProfile.rating) }}
                >
                  {cfUserProfile.rating}
                </div>
                <Badge
                  style={{
                    backgroundColor: getRatingColor(cfUserProfile.rating),
                    color: "white",
                  }}
                >
                  {cfUserProfile.rank}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Max:{" "}
                <span className="font-medium">{cfUserProfile.maxRating}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Problems Solved</CardTitle>
              <CardDescription>All time statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">142</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">
                  Last week:{" "}
                </span>
                <Badge variant="outline">+8</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Contests Participated</CardTitle>
              <CardDescription>Your activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">27</div>
              <p className="text-sm text-muted-foreground mt-2">
                Next contest: <span className="font-medium">2 days</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Rating graph */}
        <Card>
          <CardHeader>
            <CardTitle>Rating History</CardTitle>
            <CardDescription>
              Your performance in recent contests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cfRatingHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis domain={["dataMin - 100", "dataMax + 100"]} />
                  <Tooltip
                    formatter={(value) => [`Rating: ${value}`, "Rating"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke={getRatingColor(cfUserProfile.rating)}
                    strokeWidth={2}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent activity & Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Participated in Div2 Round 850
                      </p>
                      <p className="text-sm text-muted-foreground">
                        2 days ago
                      </p>
                    </div>
                  </div>
                  <Badge>+22 rating</Badge>
                </li>
                <li className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Solved "Minimum Path Sum"</p>
                      <p className="text-sm text-muted-foreground">
                        3 days ago
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">1600</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <PenTool className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Published new blog post</p>
                      <p className="text-sm text-muted-foreground">
                        1 week ago
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/blogs/3">View</Link>
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                onClick={() => setActiveSection("blogs")}
                className="justify-start"
              >
                <PenTool className="mr-2 h-4 w-4" />
                Write New Blog
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveSection("analytics")}
                className="justify-start"
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                View Problem Analytics
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link to="/contests">
                  <Trophy className="mr-2 h-4 w-4" />
                  Upcoming Contests
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link to="/resources">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Learning Resources
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Profile section
  const renderProfileSection = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Codeforces Profile</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveSection("settings")}
          >
            Edit Profile
          </Button>
        </div>

        {/* CF Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar
                className="h-32 w-32 border-4"
                style={{ borderColor: getRatingColor(cfUserProfile.rating) }}
              >
                <AvatarImage
                  src={cfUserProfile.avatar}
                  alt={cfUserProfile.handle}
                />
                <AvatarFallback>
                  {cfUserProfile.handle[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-4 text-center md:text-left">
                <div>
                  <h2 className="text-2xl font-bold">{cfUserProfile.handle}</h2>
                  <p className="text-muted-foreground">
                    Joined {cfUserProfile.joinDate}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-card border rounded-xl p-4 min-w-[100px] text-center">
                    <div
                      className="text-xl font-bold"
                      style={{ color: getRatingColor(cfUserProfile.rating) }}
                    >
                      {cfUserProfile.rating}
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>

                  <div className="bg-card border rounded-xl p-4 min-w-[100px] text-center">
                    <div
                      className="text-xl font-bold"
                      style={{ color: getRatingColor(cfUserProfile.maxRating) }}
                    >
                      {cfUserProfile.maxRating}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Max Rating
                    </div>
                  </div>

                  <div className="bg-card border rounded-xl p-4 min-w-[100px] text-center">
                    <div
                      className="text-xl font-bold capitalize"
                      style={{ color: getRatingColor(cfUserProfile.rating) }}
                    >
                      {cfUserProfile.rank}
                    </div>
                    <div className="text-sm text-muted-foreground">Rank</div>
                  </div>

                  <div className="bg-card border rounded-xl p-4 min-w-[100px] text-center">
                    <div className="text-xl font-bold">
                      {cfUserProfile.contribution}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Contribution
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://codeforces.com/profile/${cfUserProfile.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Codeforces Profile
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={`https://codeforces.com/submissions/${cfUserProfile.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View All Submissions
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CF Rating Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Rating History</CardTitle>
            <CardDescription>Your performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cfRatingHistory}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis domain={["dataMin - 100", "dataMax + 100"]} />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `Rating: ${value}`,
                      props.payload.contest,
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke={getRatingColor(cfUserProfile.rating)}
                    strokeWidth={2}
                    dot={{ r: 5, fill: getRatingColor(cfUserProfile.rating) }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent contests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Contests</CardTitle>
            <CardDescription>
              Your performance in the last 5 contests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contest</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Solved</TableHead>
                  <TableHead className="text-right">Rating Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cfRatingHistory.slice(0, 5).map((contest, index) => {
                  const ratingChange =
                    index > 0
                      ? contest.rating - cfRatingHistory[index - 1].rating
                      : 0;

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {contest.contest}
                      </TableCell>
                      <TableCell>{contest.date}</TableCell>
                      <TableCell>
                        {1000 + Math.floor(Math.random() * 5000)}
                      </TableCell>
                      <TableCell>
                        {Math.floor(Math.random() * 6) + 1}/8
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            ratingChange >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {ratingChange >= 0
                            ? `+${ratingChange}`
                            : ratingChange}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild className="ml-auto">
              <a
                href={`https://codeforces.com/contests/with/${cfUserProfile.handle}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View All Contests
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  // Analytics section
  const renderAnalyticsSection = () => {
    // Get the current data based on selected time frame
    const currentData = timeFilteredData[timeFrame] || problemRatingData;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">CF Problem Analytics</h1>
          <div className="flex items-center gap-2">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-week">Last Week</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Problem Index Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Problems by Index</CardTitle>
            <CardDescription>
              Distribution of problems solved by index (A, B, C, etc)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={problemIndexData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="solved" name="Solved" fill="#0088FE" />
                  <Bar dataKey="attempted" name="Attempted" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Problem Rating Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Problems by Rating</CardTitle>
            <CardDescription>
              Distribution of problems by difficulty rating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="solved" name="Solved" fill="#00C49F" />
                  <Bar dataKey="count" name="Available" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Contest Type Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Problems by Contest Type</CardTitle>
            <CardDescription>
              Distribution of problems solved by contest division
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={contestTypeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="participated"
                    name="Contests Participated"
                    fill="#8884d8"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="solved"
                    name="Problems Solved"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Advanced filters card */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Analysis</CardTitle>
            <CardDescription>
              Detailed breakdown with customizable filters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Contest Type
                </label>
                <Select
                  value={contestTypeFilter}
                  onValueChange={setContestTypeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contest type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contests</SelectItem>
                    <SelectItem value="div1">Div. 1</SelectItem>
                    <SelectItem value="div2">Div. 2</SelectItem>
                    <SelectItem value="div3">Div. 3</SelectItem>
                    <SelectItem value="div4">Div. 4</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Problem Index
                </label>
                <Select value={indexFilter} onValueChange={setIndexFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select problem index" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Indices</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                    <SelectItem value="F+">F+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Time Period
                </label>
                <Select value={timeFrame} onValueChange={setTimeFrame}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="all-time">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Problem Solving Rate</h3>
                  <Badge>
                    {Math.floor(Math.random() * 8) + 2} problems/week
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Accuracy Rate</h3>
                  <Badge variant="outline">
                    {Math.floor(Math.random() * 26) + 75}%
                  </Badge>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on your performance
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Suggested Problems
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Blogs section
  const renderBlogsSection = () => {
    const [blogTitle, setBlogTitle] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const [activeBlogTab, setActiveBlogTab] = useState("write");

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <Tabs
            value={activeBlogTab}
            onValueChange={setActiveBlogTab}
            className="w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="pt-2">
          {/* Write blog tab */}
          {activeBlogTab === "write" && (
            <Card>
              <CardHeader>
                <CardTitle>Write New Blog</CardTitle>
                <CardDescription>
                  Share your competitive programming insights and experiences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blog Title</label>
                  <Input
                    placeholder="Enter a descriptive title"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Content</label>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Code className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Write your blog content here..."
                    className="min-h-[300px]"
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <Input placeholder="e.g., dynamic-programming, graphs, algorithms" />
                  <p className="text-xs text-muted-foreground">
                    Separate tags with commas
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Save as Draft</Button>
                <Button disabled={!blogTitle || !blogContent}>
                  Publish Blog
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Drafts tab */}
          {activeBlogTab === "drafts" && (
            <Card>
              <CardHeader>
                <CardTitle>Draft Blogs</CardTitle>
                <CardDescription>
                  Continue working on your unfinished blogs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {draftBlogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    You don't have any draft blogs yet. Start writing!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {draftBlogs.map((blog) => (
                      <Card key={blog.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            {blog.title}
                          </CardTitle>
                          <CardDescription>
                            Last edited: {blog.lastEdited}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {blog.excerpt}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button size="sm">Publish</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Published tab */}
          {activeBlogTab === "published" && (
            <Card>
              <CardHeader>
                <CardTitle>Published Blogs</CardTitle>
                <CardDescription>Manage your published content</CardDescription>
              </CardHeader>
              <CardContent>
                {publishedBlogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    You haven't published any blogs yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {publishedBlogs.map((blog) => (
                      <Card key={blog.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            {blog.title}
                          </CardTitle>
                          <CardDescription>
                            Published: {blog.publishDate}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" /> {blog.views}{" "}
                              views
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" /> {blog.likes}{" "}
                              likes
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />{" "}
                              {blog.comments} comments
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/blogs/${blog.id}`}>View</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  // Settings section
  const renderSettingsSection = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    src={cfUserProfile.avatar}
                    alt={cfUserProfile.handle}
                  />
                  <AvatarFallback>
                    {cfUserProfile.handle[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <Button size="sm">Change Avatar</Button>
                  <Button variant="outline" size="sm">
                    Remove Photo
                  </Button>
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input defaultValue="Ahmed Khan" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input defaultValue="ahmed@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea defaultValue="Competitive programmer and algorithm enthusiast. I love solving challenging problems and sharing knowledge with the CP community." />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Handles</CardTitle>
            <CardDescription>
              Connect your competitive programming accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Codeforces Handle</label>
              <Input defaultValue={cfUserProfile.handle} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">AtCoder Handle</label>
              <Input placeholder="Enter your AtCoder handle" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LeetCode Handle</label>
              <Input placeholder="Enter your LeetCode handle" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SPOJ Handle</label>
              <Input placeholder="Enter your SPOJ handle" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Update Handles</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password & Security</CardTitle>
            <CardDescription>
              Update your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input
                type="password"
                placeholder="Enter your current password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Confirm New Password
              </label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Change Password</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Manage how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about contests via email
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Upcoming Contest Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about contests you've registered for
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Blog Comment Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when someone comments on your blog
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>

        <Card className="border-destructive/10 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`border-r bg-card ${
          isSidebarOpen ? "w-64" : "w-16"
        } flex-shrink-0 transition-all duration-300`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header with toggle */}
          <div className="p-4 border-b flex items-center justify-between">
            {isSidebarOpen ? (
              <>
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span className="font-semibold">{cfUserProfile.handle}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                  <PanelLeft className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="w-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Sidebar links */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              <Button
                variant={activeSection === "overview" ? "secondary" : "ghost"}
                className={`w-full justify-${
                  isSidebarOpen ? "start" : "center"
                }`}
                onClick={() => setActiveSection("overview")}
              >
                <Home className="h-4 w-4 mr-2" />
                {isSidebarOpen && <span>Overview</span>}
              </Button>
              <Button
                variant={activeSection === "profile" ? "secondary" : "ghost"}
                className={`w-full justify-${
                  isSidebarOpen ? "start" : "center"
                }`}
                onClick={() => setActiveSection("profile")}
              >
                <User className="h-4 w-4 mr-2" />
                {isSidebarOpen && <span>CF Profile</span>}
              </Button>
              <Button
                variant={activeSection === "analytics" ? "secondary" : "ghost"}
                className={`w-full justify-${
                  isSidebarOpen ? "start" : "center"
                }`}
                onClick={() => setActiveSection("analytics")}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                {isSidebarOpen && <span>Problem Analytics</span>}
              </Button>
              <Button
                variant={activeSection === "blogs" ? "secondary" : "ghost"}
                className={`w-full justify-${
                  isSidebarOpen ? "start" : "center"
                }`}
                onClick={() => setActiveSection("blogs")}
              >
                <PenTool className="h-4 w-4 mr-2" />
                {isSidebarOpen && <span>Blog Writing</span>}
              </Button>
              <Button
                variant={activeSection === "settings" ? "secondary" : "ghost"}
                className={`w-full justify-${
                  isSidebarOpen ? "start" : "center"
                }`}
                onClick={() => setActiveSection("settings")}
              >
                <Settings className="h-4 w-4 mr-2" />
                {isSidebarOpen && <span>Settings</span>}
              </Button>
            </div>
          </ScrollArea>

          {/* Logout button */}
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              className={`w-full justify-${
                isSidebarOpen ? "start" : "center"
              } text-red-500 hover:text-red-600 hover:bg-red-50`}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isSidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <ScrollArea className="flex-1">
        <div className="container py-6 px-4 md:px-6 max-w-7xl">
          {renderSectionContent()}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DashboardPage;
