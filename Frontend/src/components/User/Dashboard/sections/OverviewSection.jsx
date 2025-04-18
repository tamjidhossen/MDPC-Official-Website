import React, { useState, useEffect } from "react";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Trophy,
  BookOpen,
  CheckCircle,
  PenTool,
  BarChart2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import useCodeforcesData from "@/hooks/useCodeforcesData"; // Import our custom hook

// Function to get color based on Codeforces rating
const getRatingColor = (rating) => {
  if (!rating) return "#000000";

  if (rating < 1200) return "#808080"; // Gray (Newbie)
  if (rating < 1400) return "#008000"; // Green (Pupil)
  if (rating < 1600) return "#03a89e"; // Cyan (Specialist)
  if (rating < 1900) return "#0000ff"; // Blue (Expert)
  if (rating < 2100) return "#aa00aa"; // Violet (Candidate Master)
  if (rating < 2400) return "#ff8c00"; // Orange (Master)
  if (rating < 2600) return "#ff8c00"; // Orange (International Master)
  if (rating < 3000) return "#ff0000"; // Red (Grandmaster)
  return "#ff0000"; // Red (International Grandmaster / Legendary Grandmaster)
};

const OverviewSection = ({ setActiveSection }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  // User's CF handle
  const cfHandle = user?.programmingHandles?.codeforces || "";

  // Use our custom hook for data fetching
  const { getUserDashboard } = useCodeforcesData();

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (!cfHandle) {
        if (isMounted) {
          setLoading(false);
          setError("No Codeforces handle found");
          setDataFetched(true);
        }
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
        }

        // Fetch user dashboard data with our custom hook
        const userDashboardResult = await getUserDashboard(cfHandle);

        if (!isMounted) return;

        if (userDashboardResult.data) {
          setUserData(userDashboardResult.data);
          setError(null);
        } else {
          setError(
            userDashboardResult.error || "Failed to load Codeforces data"
          );
          setUserData(null);
        }
      } catch (err) {
        console.error("Error fetching Codeforces data:", err);
        if (isMounted) {
          setError("Failed to fetch Codeforces data");
          setUserData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setDataFetched(true);
        }
      }
    };

    fetchUserData();

    // Cleanup function to prevent state updates after component unmount
    return () => {
      isMounted = false;
    };
  }, [cfHandle, getUserDashboard]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading user dashboard...</p>
      </div>
    );
  }

  // If no Codeforces handle is found, show a setup prompt
  if (!cfHandle) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your MDPC dashboard, {user?.name || "User"}!
        </p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Set Up Your Codeforces Account</CardTitle>
            <CardDescription>
              Connect your Codeforces account to access problem analytics and
              personalized content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To get the most out of your MDPC dashboard, connect your
              Codeforces handle in settings.
            </p>
            <Button onClick={() => setActiveSection("settings")}>
              Go to Settings
            </Button>
          </CardContent>
        </Card>

        {/* Show other non-CF dependent dashboard content */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Club Status</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.isMember ? "Member" : "Non-member"}
              </div>
              <p className="text-xs text-muted-foreground">
                {user?.isMember
                  ? "You are a registered member of MDPC"
                  : "Apply for membership to access exclusive content"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Club Blogs</CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Latest Articles</div>
              <p className="text-xs text-muted-foreground">
                Check out recent blogs from fellow MDPC members
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View Blogs
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Learning Materials</div>
              <p className="text-xs text-muted-foreground">
                Access problem-solving guides and resources
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link to="/resources">View Resources</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-semibold mb-2">
          Dashboard Data Not Available
        </h2>
        <p className="text-muted-foreground mb-4">
          {error || "Could not load dashboard data. Please try again later."}
        </p>
        <Button
          variant="secondary"
          onClick={() => setActiveSection("settings")}
        >
          Check Your Settings
        </Button>
      </div>
    );
  }

  // Destructure user data for easier access
  const { userInfo, problemStats, contestStats, ratingHistory } = userData;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || "User"}!
        </p>
      </div>

      {/* Codeforces Profile Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Codeforces Profile Summary</CardTitle>
          <CardDescription>Your competitive programming stats</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Handle</p>
                <p className="text-lg font-medium">{userInfo.handle}</p>
              </div>
            </div>
            <Badge
              style={{
                backgroundColor: getRatingColor(userInfo.rating),
                color: userInfo.rating >= 1600 ? "white" : "black",
              }}
              className="text-md py-1 px-4"
            >
              {userInfo.rank || "Unrated"}
            </Badge>
          </div>

          <div className="flex items-center justify-between space-x-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Rating</p>
              <p className="text-xl font-bold">{userInfo.rating}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Max Rating</p>
              <p className="text-xl font-bold">{userInfo.maxRating}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Problems Solved</p>
              <p className="text-xl font-bold">{problemStats.totalSolved}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contests</p>
              <p className="text-xl font-bold">
                {contestStats.totalParticipated}
              </p>
            </div>
          </div>

          <div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setActiveSection("profile")}
            >
              View Full Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rating Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Rating History</CardTitle>
          <CardDescription>Your Codeforces rating progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ratingHistory}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={["dataMin - 200", "dataMax + 200"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="newRating"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Stats and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-700 dark:text-green-300" />
                </div>
                <div>
                  <p className="font-medium">
                    {problemStats.lastWeekSolved} problems solved
                  </p>
                  <p className="text-muted-foreground">in the last week</p>
                </div>
              </div>

              {contestStats.recentContests &&
              contestStats.recentContests.length > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                    <Trophy className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Participated in{" "}
                      {contestStats.recentContests[0].contestName}
                    </p>
                    <p className="text-muted-foreground">
                      Rank:{" "}
                      {contestStats.recentContests[0].rank.toLocaleString()},{" "}
                      Rating change:{" "}
                      <span
                        className={
                          contestStats.recentContests[0].ratingChange > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {contestStats.recentContests[0].ratingChange > 0
                          ? "+"
                          : ""}
                        {contestStats.recentContests[0].ratingChange}
                      </span>
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setActiveSection("profile")}
            >
              More Activity
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Problem Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {problemStats.totalSolved}
              <span className="text-muted-foreground text-sm ml-1">solved</span>
            </div>
            <p className="text-xs text-muted-foreground">
              View detailed problem statistics
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex items-center"
              onClick={() => setActiveSection("analytics")}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Write a Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Share
              <span className="text-muted-foreground text-sm ml-1">
                knowledge
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Contribute to the MDPC community
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex items-center"
              onClick={() => setActiveSection("blogs")}
            >
              <PenTool className="h-4 w-4 mr-2" />
              Write Blog
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>
            Stay updated with upcoming programming events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <div>
              <p className="font-medium">Dynamic Programming Workshop</p>
              <p className="text-sm text-muted-foreground">
                Wed, Apr 24, 2025 • 5:30 PM
              </p>
            </div>
            <Badge variant="outline">Registration Open</Badge>
          </div>
          <div className="flex justify-between items-center pb-2">
            <div>
              <p className="font-medium">Spring Programming Contest</p>
              <p className="text-sm text-muted-foreground">
                Sun, Apr 28, 2025 • All Day
              </p>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link to="/events">View All Events</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OverviewSection;
