import React, { useState, useEffect } from "react";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getImageUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import useCodeforcesData from "@/hooks/useCodeforcesData"; // Import our custom hook

// Helper function to get color based on rating
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

const ProfileSection = ({ setActiveSection }) => {
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
            userDashboardResult.error || "Failed to load Codeforces profile"
          );
          setUserData(null);
        }
      } catch (err) {
        console.error("Error fetching Codeforces data:", err);
        if (isMounted) {
          setError("Failed to fetch Codeforces profile data");
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
        <p>Loading Codeforces profile...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-semibold mb-2">
          Codeforces Profile Not Available
        </h2>
        <p className="text-muted-foreground mb-4">
          {error ||
            "Could not load Codeforces profile. Please check your handle in settings."}
        </p>
        <Button
          variant="secondary"
          onClick={() => setActiveSection("settings")}
        >
          Go to Settings
        </Button>
      </div>
    );
  }

  // Destructure userInfo for easier access
  const { userInfo, ratingHistory, contestStats } = userData;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Codeforces Profile</h1>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Avatar */}
            <Avatar className="w-32 h-32 border-2">
              <AvatarImage src={userInfo.titlePhoto} alt={userInfo.handle} />
              <AvatarFallback className="text-3xl">
                {userInfo.handle?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">{userInfo.handle}</h2>
                <p className="text-muted-foreground">{userInfo.organization}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-lg font-bold">{userInfo.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    Current Rating
                  </span>
                </div>

                <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-lg font-bold">
                    {userInfo.maxRating}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Max Rating
                  </span>
                </div>

                <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-lg font-bold">
                    {contestStats.totalParticipated}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Contests
                  </span>
                </div>

                <div className="flex flex-col items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-lg font-bold">
                    {userInfo.contribution}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Contribution
                  </span>
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
          </div>
        </CardContent>
      </Card>

      {/* Rating History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Rating History</CardTitle>
          <CardDescription>Your performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
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

      {/* Recent Contests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contests</CardTitle>
          <CardDescription>
            Performance in the most recent Codeforces contests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contest</TableHead>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="text-right">Rank</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData.contestStats.recentContests.map((contest) => (
                  <TableRow key={contest.contestId}>
                    <TableCell className="font-medium">
                      {contest.contestName}
                    </TableCell>
                    <TableCell>{contest.date}</TableCell>
                    <TableCell className="text-right">
                      {contest.rank.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          contest.ratingChange > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {contest.ratingChange > 0 ? "+" : ""}
                        {contest.ratingChange}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {contest.newRating}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setActiveSection("analytics")}
          >
            View Problem Statistics
          </Button>
          <Button
            variant="default"
            onClick={() =>
              window.open(
                `https://codeforces.com/profile/${userInfo.handle}`,
                "_blank"
              )
            }
          >
            View on Codeforces
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSection;
