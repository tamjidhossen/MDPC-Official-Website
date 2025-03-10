// src/components/Contests/ContestsPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Users, AlertCircle } from "lucide-react";

const ContestsPage = () => {
  // Mock data for contests
  const upcomingContests = [
    {
      id: 1,
      title: "Weekly Algorithm Contest",
      description: "Topic-focused contest on Dynamic Programming with 6 problems of varying difficulty levels.",
      date: "May 25, 2024",
      time: "3:00 PM - 6:00 PM",
      duration: "3 hours",
      participants: 48,
      difficulty: "Medium",
      registrationOpen: true,
    },
    {
      id: 2,
      title: "Monthly IUPC Style Contest",
      description: "5-hour long contest with 10 problems covering various algorithms and data structures.",
      date: "June 2, 2024",
      time: "10:00 AM - 3:00 PM",
      duration: "5 hours",
      participants: 35,
      difficulty: "Hard",
      registrationOpen: true,
    },
    {
      id: 3,
      title: "Beginner's Contest",
      description: "Friendly contest for beginners with basic problems on arrays, strings and basic algorithms.",
      date: "June 10, 2024",
      time: "4:00 PM - 6:00 PM",
      duration: "2 hours",
      participants: 62,
      difficulty: "Easy",
      registrationOpen: false,
    },
  ];

  const pastContests = [
    {
      id: 101,
      title: "Graph Theory Special",
      description: "Contest focusing on graph algorithms and techniques.",
      date: "May 1, 2024",
      participants: 55,
      difficulty: "Medium",
    },
    {
      id: 102,
      title: "Spring Programming Competition",
      description: "Seasonal programming contest with varied problem set.",
      date: "April 15, 2024",
      participants: 72,
      difficulty: "Medium-Hard",
    },
    {
      id: 103,
      title: "Data Structures Challenge",
      description: "Contest focusing on advanced data structures and their applications.",
      date: "March 28, 2024",
      participants: 40,
      difficulty: "Hard",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Contests</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Participate in our programming competitions to enhance your skills and compete with fellow programmers
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
          <TabsTrigger value="upcoming">Upcoming Contests</TabsTrigger>
          <TabsTrigger value="past">Past Contests</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingContests.map((contest) => (
              <Card key={contest.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{contest.title}</CardTitle>
                    <Badge variant={contest.difficulty === "Easy" ? "secondary" : contest.difficulty === "Medium" ? "default" : "destructive"}>
                      {contest.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{contest.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{contest.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{contest.time} ({contest.duration})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{contest.participants} participants registered</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {contest.registrationOpen ? (
                    <Button className="w-full">Register Now</Button>
                  ) : (
                    <Button variant="outline" className="w-full" disabled>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Registration Opens Soon
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastContests.map((contest) => (
              <Card key={contest.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{contest.title}</CardTitle>
                    <Badge variant="outline">{contest.difficulty}</Badge>
                  </div>
                  <CardDescription>{contest.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{contest.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{contest.participants} participants</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Results</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-16 rounded-xl bg-primary/5 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Host a Contest</h2>
        <p className="text-muted-foreground mb-6">
          Are you interested in hosting a problem-setting contest or have ideas for new contest formats?
        </p>
        <Button asChild>
          <Link to="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
};

export default ContestsPage;