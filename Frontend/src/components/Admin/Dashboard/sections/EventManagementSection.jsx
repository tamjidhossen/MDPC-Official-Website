import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Plus, Edit, Trash, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { eventApi } from "@/services/api";

const EventManagementSection = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date(),
    venue: "",
    time: "",
    type: "",
    registrationOpen: false,
    registrationDeadline: "",
    maxParticipants: 0,
    status: "upcoming",
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventApi.getAll({ status: activeTab });
      setEvents(response.data.events || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load events. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSelectedEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Add all event data to the form
      Object.keys(newEvent).forEach((key) => {
        if (key === "date" && newEvent[key] instanceof Date) {
          formData.append(key, newEvent[key].toISOString().split("T")[0]);
        } else if (
          key === "registrationDeadline" &&
          newEvent[key] instanceof Date
        ) {
          formData.append(key, newEvent[key].toISOString().split("T")[0]);
        } else if (newEvent[key] !== undefined && newEvent[key] !== "") {
          formData.append(key, newEvent[key]);
        }
      });

      await eventApi.create(formData);

      toast({
        title: "Event Created",
        description: `"${newEvent.title}" has been successfully created.`,
      });

      setCreateDialogOpen(false);
      setNewEvent({
        title: "",
        description: "",
        date: new Date(),
        venue: "",
        time: "",
        type: "",
        registrationOpen: false,
        registrationDeadline: "",
        maxParticipants: 0,
        status: "upcoming",
      });

      // Refresh events list
      fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to create event.",
      });
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Add all event data to the form
      Object.keys(selectedEvent).forEach((key) => {
        if (
          key === "_id" ||
          key === "__v" ||
          key === "participants" ||
          key === "createdAt" ||
          key === "updatedAt"
        ) {
          // Skip these fields
          return;
        }

        if (key === "date" && selectedEvent[key] instanceof Date) {
          formData.append(key, selectedEvent[key].toISOString().split("T")[0]);
        } else if (
          key === "registrationDeadline" &&
          selectedEvent[key] instanceof Date
        ) {
          formData.append(key, selectedEvent[key].toISOString().split("T")[0]);
        } else if (selectedEvent[key] !== undefined) {
          formData.append(key, selectedEvent[key]);
        }
      });

      await eventApi.update(selectedEvent._id, formData);

      toast({
        title: "Event Updated",
        description: `"${selectedEvent.title}" has been successfully updated.`,
      });

      setEditDialogOpen(false);

      // Refresh events list
      fetchEvents();
    } catch (err) {
      console.error("Error updating event:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to update event.",
      });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await eventApi.delete(eventId);

      toast({
        title: "Event Deleted",
        description: "The event has been successfully deleted.",
      });

      // Refresh events list
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to delete event.",
      });
    }
  };

  const handleEditEvent = (event) => {
    const eventData = { ...event };

    // Convert string dates to Date objects
    if (event.date) {
      eventData.date = new Date(event.date);
    }

    if (event.registrationDeadline) {
      eventData.registrationDeadline = new Date(event.registrationDeadline);
    }

    setSelectedEvent(eventData);
    setEditDialogOpen(true);
  };

  const handleViewRegistrations = async (event) => {
    try {
      // Fetch event details with participants
      const response = await eventApi.getById(event._id);
      setSelectedEvent(response.data.event);
      setRegistrationDialogOpen(true);
    } catch (err) {
      console.error("Error fetching event registrations:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load event registrations.",
      });
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString || "No date set";
    }
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
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={
                        newEvent.date instanceof Date
                          ? newEvent.date.toISOString().split("T")[0]
                          : newEvent.date
                      }
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setNewEvent((prev) => ({ ...prev, date }));
                      }}
                      className="w-full"
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">Format: DD/MM/YYYY</p>
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
                    placeholder="e.g., 2:00 PM"
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
                    placeholder="e.g., CSE Building, Room 301"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Event Type
                  </Label>
                  <Input
                    id="type"
                    name="type"
                    value={newEvent.type}
                    onChange={handleInputChange}
                    placeholder="e.g., Workshop, Competition, Seminar"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="registrationOpen" className="text-right">
                    Registration
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <input
                      id="registrationOpen"
                      name="registrationOpen"
                      type="checkbox"
                      checked={newEvent.registrationOpen}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor="registrationOpen"
                      className="text-sm font-normal"
                    >
                      Enable registration for this event
                    </Label>
                  </div>
                </div>
                {newEvent.registrationOpen && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="registrationDeadline"
                        className="text-right"
                      >
                        Registration Deadline
                      </Label>
                      <div className="col-span-3">
                        <Input
                          id="registrationDeadline"
                          name="registrationDeadline"
                          type="date"
                          value={
                            newEvent.registrationDeadline instanceof Date
                              ? newEvent.registrationDeadline
                                  .toISOString()
                                  .split("T")[0]
                              : newEvent.registrationDeadline instanceof String
                              ? newEvent.registrationDeadline
                              : ""
                          }
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            setNewEvent((prev) => ({
                              ...prev,
                              registrationDeadline: date,
                            }));
                          }}
                          className="w-full"
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">Format: DD/MM/YYYY</p>
                      </div>
                    </div>
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
                  </>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <select
                    id="status"
                    name="status"
                    value={newEvent.status}
                    onChange={handleInputChange}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
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
          <TabsTrigger value="ongoing">Ongoing Events</TabsTrigger>
          <TabsTrigger value="completed">Completed Events</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled Events</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading && (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-10 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">
                No {activeTab} events found. Create a new event to get started.
              </p>
            </div>
          )}

          {filteredEvents.map((event) => (
            <Card key={event._id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-2 justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription>
                      {formatDate(event.date)} • {event.time} • {event.venue} •
                      <Badge variant="outline" className="ml-2 capitalize">
                        {event.type}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {event.registrationOpen && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewRegistrations(event)}
                      >
                        <Users className="h-4 w-4 mr-2" /> Registrations
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{event.description}</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Registration</p>
                    <p className="text-muted-foreground">
                      {event.registrationOpen ? "Open" : "Closed"}
                      {event.registrationDeadline && (
                        <>
                          {" "}
                          • Deadline: {formatDate(event.registrationDeadline)}
                        </>
                      )}
                    </p>
                  </div>
                  {event.maxParticipants > 0 && (
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-muted-foreground">
                        {event.participants ? event.participants.length : 0} /{" "}
                        {event.maxParticipants}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">Status</p>
                    <p className="capitalize text-muted-foreground">
                      {event.status}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditEvent(event)}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteEvent(event._id)}
                  >
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

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
                      <Input
                        id="edit-date"
                        name="date"
                        type="date"
                        value={
                          selectedEvent.date instanceof Date
                            ? selectedEvent.date.toISOString().split("T")[0]
                            : new Date(selectedEvent.date)
                                .toISOString()
                                .split("T")[0]
                        }
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          setSelectedEvent((prev) => ({ ...prev, date }));
                        }}
                        className="w-full"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">Format: DD/MM/YYYY</p>
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
                    <Input
                      id="edit-type"
                      name="type"
                      value={selectedEvent.type}
                      onChange={handleEditChange}
                      placeholder="e.g., Workshop, Competition, Seminar"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label
                      htmlFor="edit-registrationOpen"
                      className="text-right"
                    >
                      Registration
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <input
                        id="edit-registrationOpen"
                        name="registrationOpen"
                        type="checkbox"
                        checked={selectedEvent.registrationOpen}
                        onChange={handleEditChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label
                        htmlFor="edit-registrationOpen"
                        className="text-sm font-normal"
                      >
                        Enable registration for this event
                      </Label>
                    </div>
                  </div>
                  {selectedEvent.registrationOpen && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="edit-registrationDeadline"
                          className="text-right"
                        >
                          Registration Deadline
                        </Label>
                        <div className="col-span-3">
                          <Input
                            id="edit-registrationDeadline"
                            name="registrationDeadline"
                            type="date"
                            value={
                              selectedEvent.registrationDeadline instanceof Date
                                ? selectedEvent.registrationDeadline
                                    .toISOString()
                                    .split("T")[0]
                                : selectedEvent.registrationDeadline instanceof
                                  String
                                ? selectedEvent.registrationDeadline
                                : ""
                            }
                            onChange={(e) => {
                              const date = new Date(e.target.value);
                              setSelectedEvent((prev) => ({
                                ...prev,
                                registrationDeadline: date,
                              }));
                            }}
                            className="w-full"
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                          <p className="text-xs text-muted-foreground mt-1">Format: DD/MM/YYYY</p>
                        </div>
                      </div>
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
                          min={
                            selectedEvent.participants
                              ? selectedEvent.participants.length
                              : 0
                          }
                          className="col-span-3"
                        />
                      </div>
                    </>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-status" className="text-right">
                      Status
                    </Label>
                    <select
                      id="edit-status"
                      name="status"
                      value={selectedEvent.status}
                      onChange={handleEditChange}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
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
                  {selectedEvent.title} - {formatDate(selectedEvent.date)}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">
                    Registered Participants
                    {selectedEvent.maxParticipants > 0 && (
                      <span className="text-muted-foreground ml-2">
                        (
                        {selectedEvent.participants
                          ? selectedEvent.participants.length
                          : 0}
                        /{selectedEvent.maxParticipants})
                      </span>
                    )}
                  </h3>
                  {selectedEvent.registrationDeadline && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Registration Deadline:{" "}
                      </span>
                      <span>
                        {formatDate(selectedEvent.registrationDeadline)}
                      </span>
                    </div>
                  )}
                </div>

                {selectedEvent.participants &&
                selectedEvent.participants.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-muted">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            User ID
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Registration Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-background divide-y divide-muted">
                        {selectedEvent.participants.map(
                          (participant, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                {participant}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-muted-foreground">
                                {/* Registration date would be included in a more detailed schema */}
                                -
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-6 border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">
                      No registrations yet.
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setRegistrationDialogOpen(false)}
                >
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
