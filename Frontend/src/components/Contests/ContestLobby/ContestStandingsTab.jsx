import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useToast } from "../../../hooks/use-toast";
import axios from "axios";

const ContestStandingsTab = ({ contestId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [standings, setStandings] = useState([]);
  const [problems, setProblems] = useState([]);

  const fetchStandings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/judge/contests/${contestId}/standings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStandings(response.data.data.standings || []);
      setProblems(response.data.data.problems || []);
    } catch (error) {
      console.error("Error fetching standings:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to load standings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(fetchStandings, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, [contestId, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold">No standings available</h3>
        <p className="text-muted-foreground mt-2">
          The contest leaderboard will be shown here once participants start
          submitting solutions.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Table>
        <TableCaption>Current contest standings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((standing, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{standing.rank}</TableCell>
              <TableCell>
                {standing.user
                  ? standing.user.name || standing.user.username
                  : "Unknown User"}
              </TableCell>
              <TableCell className="text-right">{standing.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContestStandingsTab;
