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
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { useToast } from "../../../hooks/use-toast";
import axios from "axios";

const ContestSubmissionsTab = ({ contestId, userId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!userId) {
        setLoading(false);
        setSubmissions([]);
        return;
      }

      try {
        setLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/judge/submissions`,
          {
            params: {
              contestId,
              userId,
              page,
              limit: 10,
            },
          }
        );

        setSubmissions(response.data.data.submissions || []);
        setTotalPages(response.data.data.pagination?.pages || 1);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to load submissions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [contestId, userId, page, toast]);

  // Function to get color for verdict badge
  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case "Accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Wrong Answer":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Compilation Error":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Runtime Error":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "Time Limit Exceeded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold">No user ID provided</h3>
        <p className="text-muted-foreground mt-2">
          Unable to fetch submissions without a user ID.
        </p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold">No submissions yet</h3>
        <p className="text-muted-foreground mt-2">
          Your submissions for this contest will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Table>
        <TableCaption>Your submissions for this contest</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Problem</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Verdict</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission._id}>
              <TableCell className="font-medium">
                {submission.problemId?.name || "Unknown Problem"}
              </TableCell>
              <TableCell>{formatDate(submission.createdAt)}</TableCell>
              <TableCell>{submission.language}</TableCell>
              <TableCell>
                <Badge className={getVerdictColor(submission.verdict)}>
                  {submission.verdict}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{submission.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="py-2 px-3">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContestSubmissionsTab;
