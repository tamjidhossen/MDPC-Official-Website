// src/components/Leaderboard/LeaderboardPage.jsx
import { useState } from "react";
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
  CardTitle 
} from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

const LeaderboardPage = () => {
  // Mock data for leaderboard
  const leaderboardData = [
    { rank: 1, name: "Tamim Iqbal", username: "tamim123", points: 850, contests: 12 },
    { rank: 2, name: "Shakib Khan", username: "shakibkhan", points: 820, contests: 14 },
    { rank: 3, name: "Mashrafe Mortaza", username: "mashrafi", points: 780, contests: 10 },
    { rank: 4, name: "Mushfiqur Rahim", username: "mushi", points: 750, contests: 15 },
    { rank: 5, name: "Mahmudullah Riyad", username: "riyad", points: 720, contests: 9 },
    { rank: 6, name: "Mustafizur Rahman", username: "fizz", points: 690, contests: 11 },
    { rank: 7, name: "Liton Das", username: "liton", points: 650, contests: 13 },
    { rank: 8, name: "Soumya Sarkar", username: "soumya", points: 620, contests: 8 },
    { rank: 9, name: "Taskin Ahmed", username: "taskin", points: 590, contests: 10 },
    { rank: 10, name: "Mehidy Hasan", username: "miraz", points: 560, contests: 7 },
  ];

  // Filter options
  const [filter, setFilter] = useState("all");

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Leaderboard</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our top competitive programmers ranked by their performance in MDPC contests
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span>Top Performers</span>
          </CardTitle>
          <CardDescription>
            Leaderboard is updated after each contest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-wrap gap-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All Time
            </Button>
            <Button 
              variant={filter === "monthly" ? "default" : "outline"}
              onClick={() => setFilter("monthly")}
            >
              Monthly
            </Button>
            <Button 
              variant={filter === "weekly" ? "default" : "outline"}
              onClick={() => setFilter("weekly")}
            >
              Weekly
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="text-right">Contests</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((user) => (
                  <TableRow key={user.rank}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.rank <= 3 ? (
                          <Medal className={`h-5 w-5 ${
                            user.rank === 1 ? "text-amber-500" : 
                            user.rank === 2 ? "text-gray-400" : 
                            "text-amber-700"
                          }`} />
                        ) : (
                          user.rank
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.username}</TableCell>
                    <TableCell className="text-right font-medium">{user.points}</TableCell>
                    <TableCell className="text-right">{user.contests}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold mb-4">How Scoring Works</h2>
        <div className="max-w-3xl mx-auto text-muted-foreground">
          <p>Participants earn points based on their performance in MDPC contests. Points are calculated based on problems solved, time taken, and contest difficulty.</p>
          <ul className="list-disc list-inside mt-4">
            <li>Solving a problem: 100-500 points (based on difficulty)</li>
            <li>Contest placement bonus: Up to 300 additional points</li>
            <li>Early submission bonus: Up to 100 points</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;