// src/components/Events/EventsPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, ExternalLink } from "lucide-react";

const EventsPage = () => {
  const [filter, setFilter] = useState("upcoming");

  // Mock data for events
  const events = [
    {
      id: 1,
      title: "ICPC Training Workshop",
      description: "Intensive training session for students preparing for ICPC regional contests.",
      date: "June 15, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Computer Science Building, Room 301",
      attendees: 35,
      eventType: "workshop",
      isUpcoming: true,
      registrationLink: "#register",
    },
    {
      id: 2,
      title: "Competitive Programming Meet & Greet",
      description: "Networking event for competitive programmers to connect and share experiences.",
      date: "June 25, 2024",
      time: "5:00 PM - 7:00 PM",
      location: "Student Center, Main Hall",
      attendees: 50,
      eventType: "social",
      isUpcoming: true,
      registrationLink: "#register",
    },
    {
      id: 3,
      title: "Algorithm Deep Dive Series: Dynamic Programming",
      description: "In-depth exploration of dynamic programming techniques with practice problems.",
      date: "July 5, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Online (Zoom)",
      attendees: 65,
      eventType: "workshop",
      isUpcoming: true,
      registrationLink: "#register",
    },
    {
      id: 4,
      title: "Spring Programming Contest Preparation",
      description: "Last event focused on preparing teams for the upcoming regional contest.",
      date: "April 10, 2024",
      time: "1:00 PM - 6:00 PM",
      location: "Computer Science Building, Lab 2",
      attendees: 42,
      eventType: "workshop",
      isUpcoming: false,
    },
    {
      id: 5,
      title: "Introduction to Competitive Programming",
      description: "Beginner-friendly session introducing the world of competitive programming.",
      date: "March 20, 2024",
      time: "3:00 PM - 5:00 PM",
      location: "Library, Conference Room B",
      attendees: 28,
      eventType: "workshop",
      isUpcoming: false,
    },
  ];

  const filteredEvents = events.filter(
    (event) => (filter === "upcoming" && event.isUpcoming) || 
               (filter === "past" && !event.isUpcoming) ||
               filter === "all"
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Events</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join our workshops, meetups, and competitive programming events
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        <Button 
          variant={filter === "upcoming" ? "default" : "outline"}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming Events
        </Button>
        <Button 
          variant={filter === "past" ? "default" : "outline"}
          onClick={() => setFilter("past")}
        >
          Past Events
        </Button>
        <Button 
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All Events
        </Button>
      </div>

      {/* Events List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="capitalize">
                  {event.eventType}
                </Badge>
                {event.isUpcoming && (
                  <Badge variant="default">
                    Upcoming
                  </Badge>
                )}
              </div>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{event.attendees} attendees</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {event.isUpcoming ? (
                <Button asChild className="w-full">
                  <Link to={event.registrationLink}>
                    Register Now
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/events/${event.id}`}>
                    View Details 
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Submit Event Proposal Section */}
      <div className="mt-16 rounded-xl bg-primary/5 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Have an Event Idea?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Want to organize a programming workshop, training session, or meetup?
          We welcome event proposals from our community members!
        </p>
        <Button asChild>
          <Link to="/contact">
            Submit Event Proposal
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EventsPage;