import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import ContestProblemsTab from "./ContestLobby/ContestProblemsTab";
import ContestStandingsTab from "./ContestLobby/ContestStandingsTab";
import ContestSubmissionsTab from "./ContestLobby/ContestSubmissionsTab";
import ContestCountdown from "./ContestLobby/ContestCountdown";

const ContestLobbyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [lobbyData, setLobbyData] = useState(null);
  const [activeTab, setActiveTab] = useState("problems");
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Get user ID (either authenticated user ID or temporary ID for non-logged in users)
  const getUserId = () => {
    if (isAuthenticated() && user) {
      return user._id; // Use the authenticated user's ID
    }

    // Fallback to temporary ID for non-authenticated users
    let tempUserId = localStorage.getItem("tempUserId");
    if (!tempUserId) {
      tempUserId = "user_" + Date.now();
      localStorage.setItem("tempUserId", tempUserId);
    }
    return tempUserId;
  };

  // Fetch contest lobby data
  useEffect(() => {
    const fetchLobbyData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/contests/${id}/lobby`
        );

        setLobbyData(response.data.data);

        // Also fetch registration status
        const contestResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/contests/${id}`
        );

        setIsRegistered(contestResponse.data.isRegistered);
      } catch (error) {
        console.error("Error fetching lobby data:", error);
        toast({
          title: "Error",
          description: "Failed to load contest data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLobbyData();
  }, [id, navigate, toast]);

  // Handle contest registration
  const handleRegister = async () => {
    // Check if already registered
    if (isRegistered) return;

    try {
      setRegistering(true);

      // Register with user ID
      await axios.post(
        `${import.meta.env.VITE_API_URL}/contests/${id}/register`,
        { userId: getUserId() }
      );

      toast({
        title: "Successfully registered",
        description: "You have been registered for this contest",
      });

      setIsRegistered(true);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Failed to register for contest",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!lobbyData) {
    return (
      <div className="container my-8 px-4">
        <div className="text-center py-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold">Contest not found</h2>
          <p className="mt-2">The contest you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/contests")} className="mt-4">
            Back to Contests
          </Button>
        </div>
      </div>
    );
  }

  const { contest, contestStatus, problems, participantCount } = lobbyData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">{contest.title}</h1>
            <p className="text-muted-foreground mt-1">
              {participantCount} participant{participantCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Registration button or status */}
          {!isRegistered ? (
            <Button
              onClick={handleRegister}
              disabled={registering || contestStatus.isEnded || isRegistered}
              className="bg-primary hover:bg-primary/90 w-full md:w-auto"
            >
              {registering ? "Registering..." : "Register for Contest"}
            </Button>
          ) : (
            <Badge
              variant="outline"
              className="py-2 px-4 text-center md:text-left"
            >
              {contestStatus.isStarted
                ? "You are participating"
                : "You are registered"}
            </Badge>
          )}
        </div>

        {/* Contest description */}
        <div className="mt-4 prose dark:prose-invert max-w-none">
          <p>{contest.description}</p>
        </div>

        {/* Contest timing information */}
        <div className="my-6 p-4 rounded-lg bg-muted">
          {!contestStatus.isStarted ? (
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold">Contest starts in:</h3>
              <ContestCountdown targetDate={contestStatus.startTime} />
            </div>
          ) : !contestStatus.isEnded ? (
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold">Contest ends in:</h3>
              <ContestCountdown targetDate={contestStatus.endTime} />
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-semibold">Contest has ended</h3>
            </div>
          )}
        </div>

        {/* Tabs for problems, standings, and submissions */}
        <div className="mt-8">
          <Tabs
            defaultValue="problems"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="overflow-x-auto">
              <TabsList className="w-full md:w-auto justify-start">
                <TabsTrigger value="problems">Problems</TabsTrigger>
                <TabsTrigger value="standings">Standings</TabsTrigger>
                <TabsTrigger value="submissions">My Submissions</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="problems">
              <ContestProblemsTab
                contestId={id}
                problems={problems || []}
                isStarted={true}
              />
            </TabsContent>

            <TabsContent value="standings">
              <ContestStandingsTab contestId={id} />
            </TabsContent>

            <TabsContent value="submissions">
              <ContestSubmissionsTab contestId={id} userId={getUserId()} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContestLobbyPage;
