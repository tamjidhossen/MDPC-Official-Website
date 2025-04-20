// src/components/Events/EventsPage.jsx
import { useState, useEffect } from "react";
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
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { eventApi } from "@/services/api";
import { format } from "date-fns";

const EventsPage = () => {
  const [filter, setFilter] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventApi.getAll({
          status: filter === "all" ? undefined : filter,
        });
        setEvents(response.data.events || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load events. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filter, toast]);

  const handleRegister = async (eventId) => {
    try {
      await eventApi.register(eventId);
      toast({
        title: "Success",
        description: "You have successfully registered for this event.",
      });

      // Refresh events to update registration status
      const response = await eventApi.getAll({
        status: filter === "all" ? undefined : filter,
      });
      setEvents(response.data.events || []);
    } catch (err) {
      console.error("Error registering for event:", err);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description:
          err.response?.data?.message || "Failed to register for this event.",
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
          Events
        </h1>
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

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">{error}</p>
        </div>
      )}

      {/* Events List */}
      {!loading && !error && (
        <>
          {events.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No events found.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event._id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="capitalize">
                        {event.type}
                      </Badge>
                      {event.status === "upcoming" && (
                        <Badge variant="default">Upcoming</Badge>
                      )}
                    </div>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.venue}</span>
                      </div>
                      {event.maxParticipants && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {event.participants?.length || 0}/
                            {event.maxParticipants} participants
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {event.status === "upcoming" ? (
                      event.registrationOpen ? (
                        <Button
                          className="w-full"
                          onClick={() => handleRegister(event._id)}
                          disabled={
                            event.maxParticipants &&
                            event.participants?.length >= event.maxParticipants
                          }
                        >
                          {event.maxParticipants &&
                          event.participants?.length >= event.maxParticipants
                            ? "Event Full"
                            : "Register Now"}
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Registration Closed
                        </Button>
                      )
                    ) : (
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/events/${event._id}`}>View Details</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Submit Event Proposal Section */}
      <div className="mt-16 rounded-xl bg-primary/5 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Have an Event Idea?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Want to organize a programming workshop, training session, or meetup?
          We welcome event proposals from our community members!
        </p>
        <Button asChild>
          <Link to="/contact">Submit Event Proposal</Link>
        </Button>
      </div>
    </div>
  );
};

export default EventsPage;
