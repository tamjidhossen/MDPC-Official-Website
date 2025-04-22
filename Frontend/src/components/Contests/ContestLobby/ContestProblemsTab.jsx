import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { useToast } from "../../../hooks/use-toast";
import axios from "axios";

const ContestProblemsTab = ({ contestId, problems = [], isStarted }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [problemsList, setProblemsList] = useState(problems);

  useEffect(() => {
    const fetchProblems = async () => {
      // If problems are already provided and contest has started, use them
      if (problems.length > 0 && isStarted) {
        setProblemsList(problems);
        setLoading(false);
        return;
      }

      // Otherwise, fetch problems from the API
      if (isStarted) {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");

          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/judge/contests/${contestId}/problems`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setProblemsList(response.data.data.problems || []);
        } catch (error) {
          console.error("Error fetching problems:", error);
          toast({
            title: "Error",
            description:
              error.response?.data?.message || "Failed to load problems",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [contestId, problems, isStarted, toast]);

  // Function to get color for difficulty badge
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold">Contest has not started yet</h3>
        <p className="text-muted-foreground mt-2">
          Problems will be available when the contest begins.
        </p>
      </div>
    );
  }

  if (problemsList.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold">No problems available</h3>
        <p className="text-muted-foreground mt-2">
          This contest doesn&apos;t have any problems yet.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4 overflow-x-auto">
      <Table>
        <TableCaption>List of problems for this contest</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problemsList.map((problem, index) => (
            <TableRow key={problem._id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{problem.name}</TableCell>
              <TableCell>
                <Badge className={getDifficultyColor(problem.difficulty)}>
                  {problem.difficulty || "Medium"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.location.href = `/contests/${contestId}/problem/${problem._id}`;
                  }}
                >
                  Solve
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContestProblemsTab;
