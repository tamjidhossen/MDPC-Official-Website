"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, Plus, Edit, Trash, Users, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EventManagementSection = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "MDPC Weekly Contest",
      description:
        "A weekly programming contest to enhance problem-solving skills.",
      date: new Date(2025, 3, 15), // April 15, 2025
      venue: "CSE Building, Room 301",
      time: "2:00 PM - 5:00 PM",
      type: "contest",
      registration: true,
      maxParticipants: 50,
      currentParticipants: 32,
      status: "upcoming",
    },
    {
      id: 2,
      title: "Algorithm Workshop",
      description:
        "Learn advanced algorithmic techniques for competitive programming.",
      date: new Date(2025, 3, 20), // April 20, 2025
      venue: "CSE Building, Room 201",
      time: "3:30 PM - 6:00 PM",
      type: "workshop",
      registration: true,
      maxParticipants: 30,
      currentParticipants: 18,
      status: "upcoming",
    },
    {
      id: 3,
      title: "MDPC Spring Contest 2025",
      description:
        "A major contest event with challenging problems and exciting prizes.",
      date: new Date(2025, 4, 5), // May 5, 2025
      venue: "University Auditorium",
      time: "10:00 AM - 3:00 PM",
      type: "contest",
      registration: true,
      maxParticipants: 100,
      currentParticipants: 75,
      status: "upcoming",
    },
    {
      id: 4,
      title: "Data Structures Bootcamp",
      description:
        "Intensive training on data structures for competitive programming.",
      date: new Date(2025, 2, 25), // March 25, 2025 (past)
      venue: "Online (Zoom)",
      time: "4:00 PM - 7:00 PM",
      type: "workshop",
      registration: true,
      maxParticipants: 60,
      currentParticipants: 54,
      status: "past",
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date(),
    venue: "",
    time: "",
    type: "event",
    registration: false,
    maxParticipants: 0,
    currentParticipants: 0,
    status: "upcoming",
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);

  // Dummy data for event participants
  const dummyParticipants = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      registrationDate: "2025-04-10",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      registrationDate: "2025-04-11",
    },
    {
      id: 3,
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      registrationDate: "2025-04-11",
    },
    {
      id: 4,
      name: "Mina Patel",
      email: "mina@example.com",
      registrationDate: "2025-04-12",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    // Here would be API call to create the event
    const eventToAdd = {
      ...newEvent,
      id: events.length + 1,
      currentParticipants: 0,
    };

    setEvents((prev) => [...prev, eventToAdd]);
    setCreateDialogOpen(false);
    setNewEvent({
      title: "",
      description: "",
      date: new Date(),
      venue: "",
      time: "",
      type: "event",
      registration: false,
      maxParticipants: 0,
      currentParticipants: 0,
      status: "upcoming",
    });

    toast({
      title: "Event Created",
      description: `"${eventToAdd.title}" has been successfully created.`,
    });
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();
    // Here would be API call to update the event
    setEvents((prev) =>
      prev.map((event) =>
        event.id === selectedEvent.id ? selectedEvent : event
      )
    );

    setEditDialogOpen(false);

    toast({
      title: "Event Updated",
      description: `"${selectedEvent.title}" has been successfully updated.`,
    });
  };

  const handleDeleteEvent = (eventId) => {
    // Here would be API call to delete the event
    setEvents((prev) => prev.filter((event) => event.id !== eventId));

    toast({
      title: "Event Deleted",
      description: "The event has been successfully deleted.",
    });
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setViewDialogOpen(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent({ ...event });
    setEditDialogOpen(true);
  };

  const handleViewRegistrations = (event) => {
    setSelectedEvent(event);
    setRegistrationDialogOpen(true);
  };

  const filteredEvents = events.filter((event) => event.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Event Management
          </h2>
          <p className="text-muted-foreground">
            Create and manage events, workshops, and contests for club members.
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Add a new event, workshop, or contest for the club.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEvent}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newEvent.date
                            ? format(newEvent.date, "PPP")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newEvent.date}
                          onSelect={(date) =>
                            setNewEvent({ ...newEvent, date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    value={newEvent.time}
                    onChange={handleInputChange}
                    placeholder="e.g., 2:00 PM - 5:00 PM"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="venue" className="text-right">
                    Venue
                  </Label>
                  <Input
                    id="venue"
                    name="venue"
                    value={newEvent.venue}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Event Type
                  </Label>
                  <select
                    id="type"
                    name="type"
                    value={newEvent.type}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="event">General Event</option>
                    <option value="workshop">Workshop</option>
                    <option value="contest">Contest</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="registration" className="text-right">
                    Registration
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <input
                      id="registration"
                      name="registration"
                      type="checkbox"
                      checked={newEvent.registration}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          registration: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor="registration"
                      className="text-sm font-normal"
                    >
                      Enable registration for this event
                    </Label>
                  </div>
                </div>
                {newEvent.registration && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maxParticipants" className="text-right">
                      Max Participants
                    </Label>
                    <Input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      value={newEvent.maxParticipants}
                      onChange={handleInputChange}
                      min="0"
                      className="col-span-3"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Event</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Card key={event.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>
                          {format(new Date(event.date), "PP")} • {event.time}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          event.type === "contest"
                            ? "destructive"
                            : event.type === "workshop"
                            ? "outline"
                            : "default"
                        }
                      >
                        {event.type.charAt(0).toUpperCase() +
                          event.type.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {event.description}
                    </p>
                    <div className="mt-4 text-sm">
                      <p>
                        <strong>Venue:</strong> {event.venue}
                      </p>
                      {event.registration && (
                        <p className="mt-1">
                          <strong>Registration:</strong>{" "}
                          {event.currentParticipants}/{event.maxParticipants}{" "}
                          participants
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewEvent(event)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      {event.registration && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewRegistrations(event)}
                        >
                          <Users className="h-4 w-4 mr-1" /> Registrations
                        </Button>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditEvent(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">
                  No upcoming events found. Create a new event to get started.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Card key={event.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>
                          {format(new Date(event.date), "PP")} • {event.time}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          event.type === "contest"
                            ? "destructive"
                            : event.type === "workshop"
                            ? "outline"
                            : "default"
                        }
                      >
                        {event.type.charAt(0).toUpperCase() +
                          event.type.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {event.description}
                    </p>
                    <div className="mt-4 text-sm">
                      <p>
                        <strong>Venue:</strong> {event.venue}
                      </p>
                      {event.registration && (
                        <p className="mt-1">
                          <strong>Attendance:</strong>{" "}
                          {event.currentParticipants} participants
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewEvent(event)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No past events found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Event Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle>{selectedEvent.title}</DialogTitle>
                  <Badge
                    variant={
                      selectedEvent.type === "contest"
                        ? "destructive"
                        : selectedEvent.type === "workshop"
                        ? "outline"
                        : "default"
                    }
                  >
                    {selectedEvent.type.charAt(0).toUpperCase() +
                      selectedEvent.type.slice(1)}
                  </Badge>
                </div>
                <DialogDescription>
                  {format(new Date(selectedEvent.date), "PP")} •{" "}
                  {selectedEvent.time}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedEvent.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Venue</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedEvent.venue}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Time</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedEvent.time}
                      </p>
                    </div>
                  </div>
                  {selectedEvent.registration && (
                    <div>
                      <h3 className="text-sm font-medium">Registration</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                          {selectedEvent.currentParticipants}/
                          {selectedEvent.maxParticipants} participants
                        </div>
                        {selectedEvent.currentParticipants >=
                          selectedEvent.maxParticipants && (
                          <div className="bg-amber-500/10 text-amber-500 rounded-full px-2 py-0.5 text-xs">
                            Full
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                {selectedEvent.status === "upcoming" && (
                  <Button
                    variant="outline"
                    onClick={() => handleEditEvent(selectedEvent)}
                  >
                    Edit Event
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setViewDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Event</DialogTitle>
                <DialogDescription>
                  Update the details for this event.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateEvent}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="edit-title"
                      name="title"
                      value={selectedEvent.title}
                      onChange={handleEditChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="edit-description"
                      name="description"
                      value={selectedEvent.description}
                      onChange={handleEditChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-date" className="text-right">
                      Date
                    </Label>
                    <div className="col-span-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(new Date(selectedEvent.date), "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(selectedEvent.date)}
                            onSelect={(date) =>
                              setSelectedEvent({ ...selectedEvent, date })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-time" className="text-right">
                      Time
                    </Label>
                    <Input
                      id="edit-time"
                      name="time"
                      value={selectedEvent.time}
                      onChange={handleEditChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-venue" className="text-right">
                      Venue
                    </Label>
                    <Input
                      id="edit-venue"
                      name="venue"
                      value={selectedEvent.venue}
                      onChange={handleEditChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-type" className="text-right">
                      Event Type
                    </Label>
                    <select
                      id="edit-type"
                      name="type"
                      value={selectedEvent.type}
                      onChange={handleEditChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="event">General Event</option>
                      <option value="workshop">Workshop</option>
                      <option value="contest">Contest</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-registration" className="text-right">
                      Registration
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <input
                        id="edit-registration"
                        name="registration"
                        type="checkbox"
                        checked={selectedEvent.registration}
                        onChange={(e) =>
                          setSelectedEvent({
                            ...selectedEvent,
                            registration: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label
                        htmlFor="edit-registration"
                        className="text-sm font-normal"
                      >
                        Enable registration for this event
                      </Label>
                    </div>
                  </div>
                  {selectedEvent.registration && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="edit-maxParticipants"
                        className="text-right"
                      >
                        Max Participants
                      </Label>
                      <Input
                        id="edit-maxParticipants"
                        name="maxParticipants"
                        type="number"
                        value={selectedEvent.maxParticipants}
                        onChange={handleEditChange}
                        min={selectedEvent.currentParticipants}
                        className="col-span-3"
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Event</Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Registrations Dialog */}
      <Dialog
        open={registrationDialogOpen}
        onOpenChange={setRegistrationDialogOpen}
      >
        <DialogContent className="sm:max-w-[700px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>Event Registrations</DialogTitle>
                <DialogDescription>
                  Participants registered for {selectedEvent.title}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Registration Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dummyParticipants.map((participant) => (
                        <TableRow key={participant.id}>
                          <TableCell>{participant.name}</TableCell>
                          <TableCell>{participant.email}</TableCell>
                          <TableCell>{participant.registrationDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {dummyParticipants.length} of{" "}
                    {selectedEvent.currentParticipants} participants
                  </p>
                  <Button variant="outline" size="sm">
                    Export List
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setRegistrationDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventManagementSection;
