import React, { useState, useEffect } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  ExternalLink,
  Edit,
  Trash,
  Share2,
  Users,
  Trophy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contestApi } from "@/services/api";

const ContestManagementSection = () => {
  const { toast } = useToast();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newContest, setNewContest] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "",
    duration: "",
    platform: "",
    difficultyLevel: "",
    registrationStatus: true,
    registrationDeadline: "",
    contestLink: "",
    contestType: "individual",
    status: "upcoming",
  });

  const [selectedContest, setSelectedContest] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await contestApi.getAll();
      setContests(response.data.contests || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching contests:", err);
      setError("Failed to load contests.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load contests. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewContest((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedContest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedContest((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleCreateContest = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Add all contest data to the form
      Object.keys(newContest).forEach((key) => {
        if (key === "date" && newContest[key] instanceof Date) {
          formData.append(key, newContest[key].toISOString().split("T")[0]);
        } else if (
          key === "registrationDeadline" &&
          newContest[key] instanceof Date
        ) {
          formData.append(key, newContest[key].toISOString().split("T")[0]);
        } else if (newContest[key] !== undefined && newContest[key] !== "") {
          formData.append(key, newContest[key]);
        }
      });

      await contestApi.create(formData);

      toast({
        title: "Contest Created",
        description: `"${newContest.title}" has been successfully created.`,
      });

      setCreateDialogOpen(false);
      setNewContest({
        title: "",
        description: "",
        date: new Date(),
        time: "",
        duration: "",
        platform: "",
        difficultyLevel: "",
        registrationStatus: true,
        registrationDeadline: "",
        contestLink: "",
        contestType: "individual",
        status: "upcoming",
      });

      // Refresh contests list
      fetchContests();
    } catch (err) {
      console.error("Error creating contest:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to create contest.",
      });
    }
  };

  const handleUpdateContest = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Add all contest data to the form
      Object.keys(selectedContest).forEach((key) => {
        if (
          key === "_id" ||
          key === "__v" ||
          key === "participants" ||
          key === "createdAt" ||
          key === "updatedAt" ||
          key === "resultsData"
        ) {
          // Skip these fields
          return;
        }

        if (key === "date" && selectedContest[key] instanceof Date) {
          formData.append(
            key,
            selectedContest[key].toISOString().split("T")[0]
          );
        } else if (
          key === "registrationDeadline" &&
          selectedContest[key] instanceof Date
        ) {
          formData.append(
            key,
            selectedContest[key].toISOString().split("T")[0]
          );
        } else if (
          selectedContest[key] !== undefined &&
          selectedContest[key] !== ""
        ) {
          formData.append(key, selectedContest[key]);
        }
      });

      await contestApi.update(selectedContest._id, formData);

      toast({
        title: "Contest Updated",
        description: `"${selectedContest.title}" has been successfully updated.`,
      });

      setEditDialogOpen(false);

      // Refresh contests list
      fetchContests();
    } catch (err) {
      console.error("Error updating contest:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to update contest.",
      });
    }
  };

  const handleDeleteContest = async (contestId) => {
    if (
      !confirm(
        "Are you sure you want to delete this contest? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await contestApi.delete(contestId);

      toast({
        title: "Contest Deleted",
        description: "The contest has been successfully deleted.",
      });

      // Refresh contests list
      fetchContests();
    } catch (err) {
      console.error("Error deleting contest:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to delete contest.",
      });
    }
  };

  const handleShareContest = (contest) => {
    // Here would be logic to share the contest, perhaps copy a link to clipboard
    navigator.clipboard.writeText(
      `Join the ${contest.title} on ${format(
        new Date(contest.date),
        "PP"
      )} at ${contest.time}! Platform: ${contest.platform} - ${
        contest.description
      }`
    );

    toast({
      title: "Contest Shared",
      description: "Contest details copied to clipboard for sharing.",
    });
  };

  const handleViewContest = (contest) => {
    setSelectedContest(contest);
    setViewDialogOpen(true);
  };

  const handleEditContest = (contest) => {
    const contestData = { ...contest };

    // Convert string dates to Date objects
    if (contest.date) {
      contestData.date = new Date(contest.date);
    }

    if (contest.registrationDeadline) {
      contestData.registrationDeadline = new Date(contest.registrationDeadline);
    }

    setSelectedContest(contestData);
    setEditDialogOpen(true);
  };

  const handleViewResults = async (contest) => {
    try {
      // Fetch contest details with results
      const response = await contestApi.getById(contest._id);
      setSelectedContest(response.data.contest);
      setResultsDialogOpen(true);
    } catch (err) {
      console.error("Error fetching contest results:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load contest results.",
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Contest Management
          </h2>
          <p className="text-muted-foreground">
            Create and manage programming contest announcements.
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Contest
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Contest</DialogTitle>
              <DialogDescription>
                Add a new programming contest announcement.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateContest}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-4">
                  <Label htmlFor="title" className="sm:text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={newContest.title}
                    onChange={handleInputChange}
                    className="sm:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-4">
                  <Label htmlFor="description" className="sm:text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newContest.description}
                    onChange={handleInputChange}
                    className="sm:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-4">
                  <Label htmlFor="platform" className="sm:text-right">
                    Platform
                  </Label>
                  <Input
                    id="platform"
                    name="platform"
                    value={newContest.platform}
                    onChange={handleInputChange}
                    placeholder="e.g., Codeforces, Vjudge, AtCoder"
                    className="sm:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-4">
                  <Label htmlFor="contestLink" className="sm:text-right">
                    Contest Link
                  </Label>
                  <Input
                    id="contestLink"
                    name="contestLink"
                    value={newContest.contestLink}
                    onChange={handleInputChange}
                    placeholder="https://"
                    className="sm:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-4">
                  <Label htmlFor="date" className="sm:text-right">
                    Date
                  </Label>
                  <div className="sm:col-span-3">
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={
                        newContest.date instanceof Date
                          ? newContest.date.toISOString().split("T")[0]
                          : newContest.date
                      }
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setNewContest({ ...newContest, date });
                      }}
                      className="w-full"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: YYYY-MM-DD
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-4">
                  <Label htmlFor="time" className="sm:text-right">
                    Time
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    value={newContest.time}
                    onChange={handleInputChange}
                    placeholder="e.g., 2:00 PM"
                    className="sm:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-4">
                  <Label htmlFor="duration" className="sm:text-right">
                    Duration (min)
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={newContest.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 180"
                    className="sm:col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-4">
                  <Label htmlFor="difficultyLevel" className="sm:text-right">
                    Difficulty
                  </Label>
                  <Input
                    id="difficultyLevel"
                    name="difficultyLevel"
                    value={newContest.difficultyLevel}
                    onChange={handleInputChange}
                    placeholder="e.g., Easy, Medium, Hard"
                    className="sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-4">
                  <Label htmlFor="contestType" className="sm:text-right">
                    Contest Type
                  </Label>
                  <select
                    id="contestType"
                    name="contestType"
                    value={newContest.contestType}
                    onChange={handleInputChange}
                    className="sm:col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="individual">Individual</option>
                    <option value="team">Team</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-4">
                  <Label htmlFor="registrationStatus" className="sm:text-right">
                    Registration
                  </Label>
                  <div className="sm:col-span-3 flex items-center space-x-2">
                    <input
                      id="registrationStatus"
                      name="registrationStatus"
                      type="checkbox"
                      checked={newContest.registrationStatus}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor="registrationStatus"
                      className="text-sm font-normal"
                    >
                      Enable registration for this contest
                    </Label>
                  </div>
                </div>
                {newContest.registrationStatus && (
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-4">
                    <Label
                      htmlFor="registrationDeadline"
                      className="sm:text-right"
                    >
                      Registration Deadline
                    </Label>
                    <div className="sm:col-span-3">
                      <Input
                        id="registrationDeadline"
                        name="registrationDeadline"
                        type="date"
                        value={
                          newContest.registrationDeadline instanceof Date
                            ? newContest.registrationDeadline
                                .toISOString()
                                .split("T")[0]
                            : newContest.registrationDeadline
                        }
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          setNewContest({
                            ...newContest,
                            registrationDeadline: date,
                          });
                        }}
                        className="w-full"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Format: YYYY-MM-DD
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  Create Contest
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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

      <div className="grid grid-cols-1 gap-6">
        {!loading && contests.length > 0
          ? contests.map((contest) => (
              <Card key={contest._id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row gap-2 justify-between items-start">
                    <div>
                      <CardTitle className="text-xl break-words">
                        {contest.title}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap gap-1 items-center">
                        {formatDate(contest.date)} • {contest.time} •
                        <Badge variant="outline" className="ml-1">
                          {contest.platform}
                        </Badge>
                        {contest.difficultyLevel && (
                          <Badge variant="secondary" className="ml-1">
                            {contest.difficultyLevel}
                          </Badge>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShareContest(contest)}
                        className="w-full sm:w-auto"
                      >
                        <Share2 className="h-4 w-4 mr-2" /> Share
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        asChild
                        className="w-full sm:w-auto"
                      >
                        <a
                          href={contest.contestLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" /> Visit
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{contest.description}</p>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-muted-foreground">
                        {contest.duration} minutes
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="capitalize text-muted-foreground">
                        {contest.status}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Registrations</p>
                      <p className="text-muted-foreground">
                        {contest.registrationStatus ? "Open" : "Closed"} •
                        {contest.participants
                          ? ` ${contest.participants.length} registered`
                          : ""}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap justify-end border-t pt-4 gap-2">
                  {contest.status === "completed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewResults(contest)}
                      className="w-full sm:w-auto"
                    >
                      <Trophy className="h-4 w-4 mr-2" /> Results
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewContest(contest)}
                    className="w-full sm:w-auto"
                  >
                    <Users className="h-4 w-4 mr-2" /> Participants
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditContest(contest)}
                    className="w-full sm:w-auto"
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteContest(contest._id)}
                    className="w-full sm:w-auto"
                  >
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          : !loading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No contests have been created yet. Add a new contest to get
                  started.
                </p>
              </div>
            )}
      </div>

      {/* Edit Contest Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
          {selectedContest && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Contest</DialogTitle>
                <DialogDescription>
                  Update the details for this contest.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateContest}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-4">
                    <Label htmlFor="edit-title" className="sm:text-right">
                      Title
                    </Label>
                    <Input
                      id="edit-title"
                      name="title"
                      value={selectedContest.title}
                      onChange={handleEditChange}
                      className="sm:col-span-3"
                      required
                    />
                  </div>

                  {/* ... repeat the pattern for other fields ... */}
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Update Contest
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View Contest Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
          {selectedContest && (
            <>
              <DialogHeader>
                <DialogTitle className="break-words">
                  {selectedContest.title}
                </DialogTitle>
                <DialogDescription>
                  {formatDate(selectedContest.date)} • {selectedContest.time}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedContest.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Platform</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedContest.platform}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Difficulty</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedContest.difficultyLevel || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Duration</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedContest.duration} minutes
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Type</h3>
                      <p className="text-sm capitalize text-muted-foreground mt-1">
                        {selectedContest.contestType || "Individual"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Contest Link</h3>
                    <a
                      href={selectedContest.contestLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-1 flex items-center break-all"
                    >
                      {selectedContest.contestLink}{" "}
                      <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                    </a>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium">Participants</h3>
                    {selectedContest.participants &&
                    selectedContest.participants.length > 0 ? (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          {selectedContest.participants.length} participants
                          registered
                        </p>
                        <div className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
                          <ul className="text-sm space-y-1">
                            {selectedContest.participants.map(
                              (participant, index) => (
                                <li
                                  key={index}
                                  className="text-muted-foreground"
                                >
                                  User ID: {participant.user || participant}
                                  {participant.teamName && (
                                    <span className="ml-2 text-primary">
                                      Team: {participant.teamName}
                                    </span>
                                  )}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        No participants registered yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setViewDialogOpen(false)}
                  className="w-full sm:w-auto"
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

export default ContestManagementSection;
