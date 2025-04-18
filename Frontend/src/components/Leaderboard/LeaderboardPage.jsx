// src/components/Leaderboard/LeaderboardPage.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Medal, Loader2 } from "lucide-react";
import useCodeforcesData from "@/hooks/useCodeforcesData"; // Import our custom hook

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use our custom hook for data fetching
  const { getLeaderboard } = useCodeforcesData();

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);

        // Fetch leaderboard data with our custom hook
        const response = await getLeaderboard();

        if (response.data) {
          // Sort the data by rating (highest to lowest)
          const sortedData = response.data.sort((a, b) => b.rating - a.rating);
          setLeaderboardData(sortedData);
        } else {
          setError(response.error || "Failed to fetch leaderboard data");
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [getLeaderboard]);

  // Helper function to get medal for top positions
  const getMedalIcon = (position) => {
    switch (position) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };

  // Helper function to get color based on Codeforces rating
  const getRatingColor = (rating) => {
    if (!rating) return "#000000";

    if (rating < 1200) return "#808080"; // Gray (Newbie)
    if (rating < 1400) return "#008000"; // Green (Pupil)
    if (rating < 1600) return "#03a89e"; // Cyan (Specialist)
    if (rating < 1900) return "#0000ff"; // Blue (Expert)
    if (rating < 2100) return "#aa00aa"; // Purple (Candidate Master)
    if (rating < 2400) return "#ff8c00"; // Orange (Master)
    if (rating < 2600) return "#ff8c00"; // Orange (International Master)
    if (rating < 3000) return "#ff0000"; // Red (Grandmaster)
    return "#ff0000"; // Red (International Grandmaster)
  };

  // Helper function to get text color based on background color
  const getTextColor = (rating) => {
    if (rating >= 1600) return "text-white";
    return "text-black";
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p>Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Error Loading Leaderboard</CardTitle>
              <CardDescription>
                We encountered an issue while fetching the leaderboard data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-red-500">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">MDPC Leaderboard</h1>
        <p className="text-muted-foreground">
          Ranking based on Codeforces ratings from{" "}
          <span className="font-medium">
            Jatiya Kabi Kazi Nazrul Islam University
          </span>
        </p>
      </div>

      {/* Top 3 Cards */}
      {leaderboardData.length >= 3 && (
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <Card className="border-2 border-gray-300">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="rounded-full bg-gray-200 p-3 mb-4">
                <Medal className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold">{leaderboardData[1].handle}</h3>
              <p
                style={{ color: getRatingColor(leaderboardData[1].rating) }}
                className="font-semibold"
              >
                {leaderboardData[1].rank}
              </p>
              <p className="text-2xl font-bold mt-2">
                {leaderboardData[1].rating}
              </p>
              <p className="text-sm text-muted-foreground">
                Max: {leaderboardData[1].maxRating}
              </p>
            </CardContent>
          </Card>

          {/* 1st Place */}
          <Card className="border-2 border-yellow-500 -mt-4">
            <div className="bg-gradient-to-b from-yellow-200 to-transparent pt-1">
              <CardContent className="pt-8 flex flex-col items-center">
                <div className="rounded-full bg-yellow-100 p-4 mb-4 border-2 border-yellow-500">
                  <Trophy className="h-10 w-10 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold">
                  {leaderboardData[0].handle}
                </h3>
                <p
                  style={{ color: getRatingColor(leaderboardData[0].rating) }}
                  className="font-semibold"
                >
                  {leaderboardData[0].rank}
                </p>
                <p className="text-3xl font-bold mt-2">
                  {leaderboardData[0].rating}
                </p>
                <p className="text-sm text-muted-foreground">
                  Max: {leaderboardData[0].maxRating}
                </p>
              </CardContent>
            </div>
          </Card>

          {/* 3rd Place */}
          <Card className="border-2 border-amber-700">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="rounded-full bg-amber-100 p-3 mb-4">
                <Medal className="h-8 w-8 text-amber-700" />
              </div>
              <h3 className="text-lg font-bold">{leaderboardData[2].handle}</h3>
              <p
                style={{ color: getRatingColor(leaderboardData[2].rating) }}
                className="font-semibold"
              >
                {leaderboardData[2].rank}
              </p>
              <p className="text-2xl font-bold mt-2">
                {leaderboardData[2].rating}
              </p>
              <p className="text-sm text-muted-foreground">
                Max: {leaderboardData[2].maxRating}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Full Rankings</CardTitle>
          <CardDescription>
            Members of the Mid-Day Programming Club ranked by Codeforces rating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Handle</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Max Rating</TableHead>
                  <TableHead>Title</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((user, index) => (
                  <TableRow key={user.handle}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getMedalIcon(index)}
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`https://codeforces.com/profile/${user.handle}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {user.handle}
                      </a>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {user.rating}
                    </TableCell>
                    <TableCell>{user.maxRating}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${getTextColor(
                          user.rating
                        )}`}
                        style={{ backgroundColor: getRatingColor(user.rating) }}
                      >
                        {user.rank || "Unrated"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
