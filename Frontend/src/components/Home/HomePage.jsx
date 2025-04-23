// src/components/Home/HomePage.jsx
import { useState, useEffect } from "react";
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
import {
  Code,
  Trophy,
  Calendar,
  Book,
  Users,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { eventApi, resourceApi } from "@/services/api";
import { format } from "date-fns";

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState({
    events: true,
    resources: true,
  });
  const [error, setError] = useState({
    events: null,
    resources: null,
  });

  // Fetch upcoming events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventApi.getAll({
          status: "upcoming",
          limit: 2, // Only fetch 2 events for the homepage
          sort: "date", // Sort by date to get the nearest events
        });

        setUpcomingEvents(response.data.events || []);
        setError((prev) => ({ ...prev, events: null }));
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
        setError((prev) => ({
          ...prev,
          events: "Failed to load upcoming events.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, events: false }));
      }
    };

    fetchEvents();
  }, []);

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await resourceApi.getAll({
          limit: 3, // Only fetch 3 resources for the homepage
        });

        let resourceData = [];
        if (response.data?.resources) {
          resourceData = response.data.resources;
        } else if (response.data?.data?.resources) {
          resourceData = response.data.data.resources;
        }

        setResources(resourceData);
        setError((prev) => ({ ...prev, resources: null }));
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError((prev) => ({
          ...prev,
          resources: "Failed to load resources.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, resources: false }));
      }
    };

    fetchResources();
  }, []);

  const features = [
    {
      icon: <Trophy className="h-10 w-10 text-primary" />,
      title: "Competitive Programming",
      description:
        "Train for contests like ICPC, IUPC, NCPC with our structured resources and workshops",
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Regular Contests",
      description:
        "Participate in our weekly topic-based contests and monthly full-length programming contests",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Community",
      description:
        "Join a vibrant community of programmers to learn, grow and excel together",
    },
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: "Learning Resources",
      description:
        "Access curated resources for all skill levels from beginner to advanced competitive programming",
    },
  ];

  // Helper function to format date
  const formatEventDate = (dateString, timeString) => {
    if (!dateString) return "TBA";

    const date = new Date(dateString);
    const formattedDate = format(date, "MMM d, yyyy");
    return timeString ? `${formattedDate} • ${timeString}` : formattedDate;
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Mid-Day Programming Club
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          A student-led competitive programming club at JKKNIU dedicated to
          fostering programming skills through contests, resources, and
          community.
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
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/events">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {loading.events ? (
            <div className="col-span-2 flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error.events ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-muted-foreground">{error.events}</p>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="col-span-2 text-center py-8">
              <p className="text-muted-foreground">
                No upcoming events scheduled at the moment.
              </p>
            </div>
          ) : (
            upcomingEvents.map((event) => (
              <Card key={event._id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    {formatEventDate(event.date, event.time)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    {event.description.length > 120
                      ? `${event.description.substring(0, 120)}...`
                      : event.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/events/${event._id}`}>
                      {event.registrationOpen ? "Register" : "View Details"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
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
          {loading.resources ? (
            <div className="col-span-3 flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error.resources ? (
            <div className="col-span-3 text-center py-8">
              <p className="text-muted-foreground">{error.resources}</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="col-span-3 text-center py-8">
              <p className="text-muted-foreground">
                No resources available at the moment.
              </p>
            </div>
          ) : (
            resources.map((resource) => (
              <Card key={resource._id}>
                <CardHeader>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>{resource.level} level</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    {resource.content && resource.content.length > 120
                      ? `${resource.content
                          .substring(0, 120)
                          .replace(/<[^>]*>?/gm, "")}...`
                      : resource.content?.replace(/<[^>]*>?/gm, "") ||
                        "No description available."}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/resources/${resource._id}`}>Read More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Join Community Section */}
      <section className="my-16 rounded-xl bg-primary/5 p-10 text-center">
        <h2 className="text-3xl font-bold">Join Our Community</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Connect with fellow programmers, participate in discussions, and get
          help with programming problems.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild>
            <a
              href="https://discord.gg/yourlink"
              target="_blank"
              rel="noopener noreferrer"
            >
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
