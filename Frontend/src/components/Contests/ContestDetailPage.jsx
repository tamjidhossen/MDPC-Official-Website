import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { contestApi } from "@/services/api";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  ExternalLink,
  LogIn,
} from "lucide-react";

const ContestDetailPage = () => {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Get user ID (either authenticated user ID or temporary ID for non-logged in users)
  const getUserId = () => {
    if (isAuthenticated && user) {
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

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        setLoading(true);
        const userId = getUserId();
        const response = await contestApi.getById(id, { userId });
        setContest(response.data.contest);
        setIsRegistered(response.data.isRegistered);
      } catch (err) {
        console.error("Error fetching contest details:", err);
        setError("Failed to load contest details. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Failed to load contest details. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContestDetails();
    }
  }, [id, toast]);

  const handleRegister = async () => {
    try {
      const userId = getUserId();
      await contestApi.register(id, { userId });
      toast({
        title: "Success",
        description: "You have successfully registered for this contest.",
      });

      // Refresh contest details to update registration status
      const response = await contestApi.getById(id, { userId });
      setContest(response.data.contest);
      setIsRegistered(response.data.isRegistered);
    } catch (err) {
      console.error("Error registering for contest:", err);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Failed to register for this contest.",
      });
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Check if contest has started
  const hasStarted = contest ? new Date(contest.date) <= new Date() : false;

  // Check if contest has ended
  const hasEnded = contest
    ? new Date(new Date(contest.date).getTime() + contest.duration * 60000) <=
      new Date()
    : false;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading contest details...</p>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">
            {error || "Contest not found"}
          </p>
          <Button asChild>
            <Link to="/contests">Back to Contests</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Contest Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-3xl font-bold">{contest.title}</h1>
            {contest.difficultyLevel && (
              <Badge
                variant={
                  contest.difficultyLevel.toLowerCase().includes("easy")
                    ? "secondary"
                    : contest.difficultyLevel.toLowerCase().includes("medium")
                    ? "default"
                    : "destructive"
                }
              >
                {contest.difficultyLevel}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mb-6">{contest.description}</p>

          {/* Key Contest Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>{formatDate(contest.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>
                {contest.time} ({contest.duration} minutes)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>{contest.participants?.length || 0} participants</span>
            </div>
            {contest.platform && (
              <div className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary" />
                <a
                  href={contest.contestLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {contest.platform}
                </a>
              </div>
            )}
          </div>

          {/* Registration/Entry Button */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Button
              onClick={() => (window.location.href = `/contests/${id}/lobby`)}
              className="w-full md:w-auto"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Enter Contest Lobby
            </Button>
          </div>

          {/* Tabs Section */}
          <Tabs
            defaultValue="details"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="prizes">Prizes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="py-6">
              <Card className="border-t-0 rounded-t-none shadow-sm">
                <CardContent className="pt-6 pb-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-3">Description</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {contest.description ||
                          "No detailed description available."}
                      </p>
                    </div>

                    {contest.problems && contest.problems.length > 0 && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-primary mb-3 flex items-center">
                          <Trophy className="h-5 w-5 mr-2" />
                          Problems
                        </h3>
                        <p className="text-gray-700">
                          This contest includes <span className="font-medium">{contest.problems.length}</span>{" "}
                          carefully selected problems to challenge your skills.
                        </p>
                      </div>
                    )}

                    {contest.registrationDeadline && (
                      <div className="border-l-4 border-primary pl-4">
                        <h3 className="text-lg font-semibold text-primary mb-3">Registration Deadline</h3>
                        <p className="text-gray-700 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatDate(contest.registrationDeadline)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules" className="py-6">
              <Card className="border-t-0 rounded-t-none shadow-sm">
                <CardContent className="pt-6 pb-4">
                  {contest.rules ? (
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      {contest.rules.split("\n").map((rule, index) => (
                        <p key={index} className="flex gap-2">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{rule}</span>
                        </p>
                      ))}
                    </div>
                  ) : (
                    <ol className="space-y-4 text-gray-700 list-none">
                      {[
                        "This is a virtual contest hosted on our platform.",
                        "You are allowed to use any programming language supported by our judge system.",
                        "Internet access is allowed, but collaboration with others during the contest is prohibited.",
                        "Each participant must submit their own solutions.",
                        "Plagiarism will result in disqualification.",
                        "The contest leaderboard is determined by the number of problems solved and submission time."
                      ].map((rule, index) => (
                        <li key={index} className="flex items-baseline gap-3 p-2 border-b last:border-0">
                          <span className="bg-primary/10 text-primary font-medium rounded-full h-6 w-6 flex items-center justify-center text-sm">
                            {index + 1}
                          </span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prizes" className="py-6">
              <Card className="border-t-0 rounded-t-none shadow-sm">
                <CardContent className="pt-6 pb-4">
                  <div className="flex items-center justify-center mb-6">
                    <Trophy className="h-12 w-12 text-yellow-500" />
                  </div>
                  
                  {contest.prizes ? (
                    <div 
                      className="prose prose-zinc max-w-none"
                      dangerouslySetInnerHTML={{ __html: contest.prizes }} 
                    />
                  ) : (
                    <div className="space-y-6">
                      <div className="">
                        <h3 className="text-lg font-semibold text-primary mb-2">Recognition</h3>
                        <p className="text-gray-700">
                          Winners will be recognized on our leaderboard and social
                          media channels.
                        </p>
                      </div>
                      
                      <div className="">
                        <h3 className="text-lg font-semibold text-primary mb-2">Certificates</h3>
                        <p className="text-gray-700">
                          Certificates will be provided to top performers.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContestDetailPage;
