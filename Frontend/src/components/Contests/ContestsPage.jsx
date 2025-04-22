import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Users, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contestApi } from "@/services/api";
import { format } from "date-fns";

const ContestsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const response = await contestApi.getAll({
          status: activeTab,
        });
        // Sort contests with most recent first
        const sortedContests = [...(response.data.contests || [])].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setContests(sortedContests);
        setError(null);
      } catch (err) {
        console.error("Error fetching contests:", err);
        setError("Failed to load contests. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load contests. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [activeTab, toast]);

  const handleRegister = async (contestId) => {
    try {
      await contestApi.register(contestId);
      toast({
        title: "Success",
        description: "You have successfully registered for this contest.",
      });

      // Refresh contests to update registration status
      const response = await contestApi.getAll({
        status: activeTab,
      });
      setContests(response.data.contests || []);
    } catch (err) {
      console.error("Error registering for contest:", err);
      toast({
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

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Contests
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Participate in our programming competitions to enhance your skills and
          compete with fellow programmers
        </p>
      </div>

      <Tabs
        defaultValue="upcoming"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
          <TabsTrigger value="upcoming">Upcoming Contests</TabsTrigger>
          <TabsTrigger value="completed">Past Contests</TabsTrigger>
        </TabsList>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Loading contests...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <TabsContent value="upcoming">
              {contests.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    No upcoming contests found.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {contests.map((contest) => (
                    <Card key={contest._id} className="flex flex-col">
                      <Link to={`/contests/${contest._id}`}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>{contest.title}</CardTitle>
                            {contest.difficultyLevel && (
                              <Badge
                                variant={
                                  contest.difficultyLevel
                                    .toLowerCase()
                                    .includes("easy")
                                    ? "secondary"
                                    : contest.difficultyLevel
                                        .toLowerCase()
                                        .includes("medium")
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {contest.difficultyLevel}
                              </Badge>
                            )}
                          </div>
                          <CardDescription>
                            {contest.description}
                          </CardDescription>
                        </CardHeader>
                      </Link>
                      <CardContent className="flex-grow">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(contest.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {contest.time} ({contest.duration} minutes)
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {contest.participants?.length || 0} participants
                              registered
                            </span>
                          </div>
                          {/* <div className="flex items-center gap-2 text-sm">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={contest.contestLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {contest.platform}
                            </a>
                          </div> */}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRegister(contest._id);
                          }}
                        >
                          Register Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {contests.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    No past contests found.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {contests.map((contest) => (
                    <Card key={contest._id}>
                      <Link to={`/contests/${contest._id}/lobby`}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>{contest.title}</CardTitle>
                            {contest.difficultyLevel && (
                              <Badge variant="outline">
                                {contest.difficultyLevel}
                              </Badge>
                            )}
                          </div>
                          <CardDescription>
                            {contest.description}
                          </CardDescription>
                        </CardHeader>
                      </Link>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(contest.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {contest.participants?.length || 0} participants
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={contest.contestLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {contest.platform}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/contests/${contest._id}/lobby`;
                          }}
                        >
                          Enter Contest
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>

      <div className="mt-16 rounded-xl bg-primary/5 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Host a Contest</h2>
        <p className="text-muted-foreground mb-6">
          Are you interested in hosting a problem-setting contest or have ideas
          for new contest formats?
        </p>
        <Button asChild>
          <Link to="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
};

export default ContestsPage;
