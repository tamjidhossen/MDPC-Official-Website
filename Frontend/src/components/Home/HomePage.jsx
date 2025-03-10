// src/components/Home/HomePage.jsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, Trophy, Calendar, Book, Users, ArrowRight } from "lucide-react";

const HomePage = () => {
  const features = [
    {
      icon: <Trophy className="h-10 w-10 text-primary" />,
      title: "Competitive Programming",
      description: "Train for contests like ICPC, IUPC, NCPC with our structured resources and workshops",
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Regular Contests",
      description: "Participate in our weekly topic-based contests and monthly full-length programming contests",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Community",
      description: "Join a vibrant community of programmers to learn, grow and excel together",
    },
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: "Learning Resources",
      description: "Access curated resources for all skill levels from beginner to advanced competitive programming",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Mid-Day Programming Club
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          A student-led competitive programming club at JKKNIU dedicated to fostering programming
          skills through contests, resources, and community.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/events">Join Events</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/resources">Explore Resources</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">What We Offer</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Upcoming Contest Section */}
      <section className="py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Upcoming Contests</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/contests">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Algorithm Contest</CardTitle>
              <CardDescription>May 25, 2024 • 3:00 PM</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Topic-focused contest on Dynamic Programming with 6 problems of varying difficulty levels.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                Register
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monthly IUPC Style Contest</CardTitle>
              <CardDescription>June 2, 2024 • 10:00 AM</CardDescription>
            </CardHeader>
            <CardContent>
              <p>5-hour long contest with 10 problems covering various algorithms and data structures.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                Register
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Latest Resources Section */}
      <section className="py-16">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Latest Resources</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/resources">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>CP Roadmap</CardTitle>
              <CardDescription>For beginners to advanced</CardDescription>
            </CardHeader>
            <CardContent>
              <p>A complete guideline to becoming proficient in competitive programming with topic-wise resources.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <Link to="/resources/cp-roadmap">Read More</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Graph Algorithms</CardTitle>
              <CardDescription>Intermediate level</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Learn about traversals, shortest paths, minimum spanning trees and network flows.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <Link to="/resources/graph-algorithms">Read More</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Programming</CardTitle>
              <CardDescription>Intermediate level</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Master DP with step-by-step explanations and practice problems from various online judges.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <Link to="/resources/dynamic-programming">Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="my-16 rounded-xl bg-primary/5 p-10 text-center">
        <h2 className="text-3xl font-bold">Join Our Community</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Connect with fellow programmers, participate in discussions, and get help with programming problems.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild>
            <a href="https://discord.gg/yourlink" target="_blank" rel="noopener noreferrer">
              Join Discord Server
            </a>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/register">Create Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;