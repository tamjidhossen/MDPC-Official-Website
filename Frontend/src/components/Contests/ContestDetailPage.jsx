import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { contestApi } from "@/services/api";
import { format } from "date-fns";
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

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        setLoading(true);
        const response = await contestApi.getById(id);
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
      await contestApi.register(id);
      toast({
        title: "Success",
        description: "You have successfully registered for this contest.",
      });

      // Refresh contest details to update registration status
      const response = await contestApi.getById(id);
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
            {hasStarted ? (
              <Button
                onClick={() => (window.location.href = `/contests/${id}/lobby`)}
                className="w-full md:w-auto"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Enter Contest Lobby
              </Button>
            ) : !isRegistered ? (
              <Button onClick={handleRegister} className="w-full md:w-auto">
                Register Now
              </Button>
            ) : (
              <Badge variant="outline" className="py-2 px-4">
                You are registered
              </Badge>
            )}
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

            <TabsContent value="details" className="py-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contest Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p>
                      {contest.description ||
                        "No detailed description available."}
                    </p>
                  </div>

                  {contest.problems && contest.problems.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Problems</h3>
                      <p>
                        This contest includes {contest.problems.length}{" "}
                        problems.
                      </p>
                    </div>
                  )}

                  {contest.registrationDeadline && (
                    <div>
                      <h3 className="font-medium mb-2">
                        Registration Deadline
                      </h3>
                      <p>{formatDate(contest.registrationDeadline)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules" className="py-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contest Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  {contest.rules ? (
                    <div className="space-y-4">
                      {contest.rules.split("\n").map((rule, index) => (
                        <p key={index}>{rule}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p>
                        1. This is a virtual contest hosted on our platform.
                      </p>
                      <p>
                        2. You are allowed to use any programming language
                        supported by our judge system.
                      </p>
                      <p>
                        3. Internet access is allowed, but collaboration with
                        others during the contest is prohibited.
                      </p>
                      <p>
                        4. Each participant must submit their own solutions.
                      </p>
                      <p>5. Plagiarism will result in disqualification.</p>
                      <p>
                        6. The contest leaderboard is determined by the number
                        of problems solved and submission time.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prizes" className="py-4">
              <Card>
                <CardHeader>
                  <CardTitle>Prizes & Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  {contest.prizes ? (
                    <div dangerouslySetInnerHTML={{ __html: contest.prizes }} />
                  ) : (
                    <div className="space-y-4">
                      <p>
                        Winners will be recognized on our leaderboard and social
                        media channels.
                      </p>
                      <p>Certificates will be provided to top performers.</p>
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
