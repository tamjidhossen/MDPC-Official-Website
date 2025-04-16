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
import { codeforcesApi } from "@/services/api";

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const response = await codeforcesApi.getLeaderboard();
        console.log(response)
        // Sort the data by rating (highest to lowest)
        const sortedData = response.data.sort((a, b) => b.rating - a.rating);

        // Add rank to each user
        const rankedData = sortedData.map((user, index) => ({
          ...user,
          position: index + 1,
        }));

        setLeaderboardData(rankedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  // Get the color for a CF rank
  const getRankColor = (rank) => {
    switch (rank) {
      case "legendary grandmaster":
        return "text-red-500 font-bold";
      case "international grandmaster":
        return "text-red-500";
      case "grandmaster":
        return "text-red-500";
      case "master":
        return "text-orange-500";
      case "candidate master":
        return "text-purple-500";
      case "expert":
        return "text-blue-500";
      case "specialist":
        return "text-cyan-500";
      case "pupil":
        return "text-green-500";
      case "newbie":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Leaderboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our top competitive programmers ranked by their Codeforces ratings
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span>Top Performers</span>
          </CardTitle>
          <CardDescription>Leaderboard data from Codeforces</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-wrap gap-2">
            <Button variant="default">All Time</Button>
            {/* Monthly and weekly filters could be added in the future */}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading leaderboard data...</span>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-rose-500">
              <p>{error}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Handle</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Max Rating</TableHead>
                    <TableHead>CF Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((user) => (
                    <TableRow key={user.handle}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {user.position <= 3 ? (
                            <Medal
                              className={`h-5 w-5 ${
                                user.position === 1
                                  ? "text-amber-500"
                                  : user.position === 2
                                  ? "text-gray-400"
                                  : "text-amber-700"
                              }`}
                            />
                          ) : (
                            user.position
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`https://codeforces.com/profile/${user.handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {user.handle}
                        </a>
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.rating}
                      </TableCell>
                      <TableCell>{user.maxRating}</TableCell>
                      <TableCell>
                        <span className={getRankColor(user.rank)}>
                          {user.rank.charAt(0).toUpperCase() +
                            user.rank.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold mb-4">About Codeforces Rating</h2>
        <div className="max-w-3xl mx-auto text-muted-foreground">
          <p>
            Codeforces uses the Elo rating system to evaluate contestant
            performance. Ratings are updated after each contest.
          </p>
          <ul className="list-disc list-inside mt-4">
            <li>Newbie: &lt; 1200</li>
            <li>Pupil: 1200 - 1399</li>
            <li>Specialist: 1400 - 1599</li>
            <li>Expert: 1600 - 1899</li>
            <li>Candidate Master: 1900 - 2099</li>
            <li>Master: 2100 - 2299</li>
            <li>Grandmaster: 2300 - 2599</li>
            <li>International Grandmaster: 2600 - 2999</li>
            <li>Legendary Grandmaster: &gt;= 3000</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
