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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContestManagementSection = () => {
  const { toast } = useToast();
  const [contests, setContests] = useState([
    {
      id: 1,
      title: "MDPC Spring Contest 2025",
      description:
        "A challenging contest with problems ranging from implementation to advanced algorithms.",
      platform: "Codeforces",
      link: "https://codeforces.com/contests",
      date: new Date(2025, 3, 25), // April 25, 2025
      time: "2:00 PM - 5:00 PM",
      difficulty: "Medium-Hard",
      prizes: "Certificates and swag for top performers",
    },
    {
      id: 2,
      title: "Weekly Practice Contest #12",
      description:
        "Regular weekly contest to strengthen your problem-solving skills.",
      platform: "Vjudge",
      link: "https://vjudge.net/contest",
      date: new Date(2025, 3, 18), // April 18, 2025
      time: "7:00 PM - 10:00 PM",
      difficulty: "Easy-Medium",
      prizes: "None",
    },
    {
      id: 3,
      title: "ACM ICPC Practice Session",
      description:
        "Practice session with previous ACM ICPC regional contest problems.",
      platform: "Vjudge",
      link: "https://vjudge.net/contest",
      date: new Date(2025, 4, 5), // May 5, 2025
      time: "2:30 PM - 7:30 PM",
      difficulty: "Hard",
      prizes: "Recognition for top 3 teams",
    },
  ]);

  const [newContest, setNewContest] = useState({
    title: "",
    description: "",
    platform: "",
    link: "",
    date: new Date(),
    time: "",
    difficulty: "",
    prizes: "",
  });

  const [selectedContest, setSelectedContest] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedContest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateContest = (e) => {
    e.preventDefault();
    // Here would be API call to create the contest
    const contestToAdd = {
      ...newContest,
      id: contests.length + 1,
    };

    setContests((prev) => [...prev, contestToAdd]);
    setCreateDialogOpen(false);
    setNewContest({
      title: "",
      description: "",
      platform: "",
      link: "",
      date: new Date(),
      time: "",
      difficulty: "",
      prizes: "",
    });

    toast({
      title: "Contest Created",
      description: `"${contestToAdd.title}" has been successfully created.`,
    });
  };

  const handleUpdateContest = (e) => {
    e.preventDefault();
    // Here would be API call to update the contest
    setContests((prev) =>
      prev.map((contest) =>
        contest.id === selectedContest.id ? selectedContest : contest
      )
    );

    setEditDialogOpen(false);

    toast({
      title: "Contest Updated",
      description: `"${selectedContest.title}" has been successfully updated.`,
    });
  };

  const handleDeleteContest = (contestId) => {
    // Here would be API call to delete the contest
    setContests((prev) => prev.filter((contest) => contest.id !== contestId));

    toast({
      title: "Contest Deleted",
      description: "The contest has been successfully removed.",
    });
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
    setSelectedContest({ ...contest });
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Contest</DialogTitle>
              <DialogDescription>
                Add a new programming contest announcement.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateContest}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={newContest.title}
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
                    value={newContest.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platform" className="text-right">
                    Platform
                  </Label>
                  <Input
                    id="platform"
                    name="platform"
                    value={newContest.platform}
                    onChange={handleInputChange}
                    placeholder="e.g., Codeforces, Vjudge, AtCoder"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="link" className="text-right">
                    Contest Link
                  </Label>
                  <Input
                    id="link"
                    name="link"
                    value={newContest.link}
                    onChange={handleInputChange}
                    placeholder="https://"
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
                          {newContest.date
                            ? format(newContest.date, "PPP")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newContest.date}
                          onSelect={(date) =>
                            setNewContest({ ...newContest, date })
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
                    value={newContest.time}
                    onChange={handleInputChange}
                    placeholder="e.g., 2:00 PM - 5:00 PM"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="difficulty" className="text-right">
                    Difficulty
                  </Label>
                  <Input
                    id="difficulty"
                    name="difficulty"
                    value={newContest.difficulty}
                    onChange={handleInputChange}
                    placeholder="e.g., Easy, Medium, Hard"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prizes" className="text-right">
                    Prizes
                  </Label>
                  <Input
                    id="prizes"
                    name="prizes"
                    value={newContest.prizes}
                    onChange={handleInputChange}
                    placeholder="e.g., Certificates, Swag, etc."
                    className="col-span-3"
                  />
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
                <Button type="submit">Create Contest</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {contests.length > 0 ? (
          contests.map((contest) => (
            <Card key={contest.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-2 justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{contest.title}</CardTitle>
                    <CardDescription>
                      {format(new Date(contest.date), "PP")} • {contest.time} •
                      <Badge variant="outline" className="ml-2">
                        {contest.platform}
                      </Badge>
                      {contest.difficulty && (
                        <Badge variant="secondary" className="ml-2">
                          {contest.difficulty}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShareContest(contest)}
                    >
                      <Share2 className="h-4 w-4 mr-2" /> Share
                    </Button>
                    <Button size="sm" variant="default" asChild>
                      <a
                        href={contest.link}
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
                {contest.prizes && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Prizes:</p>
                    <p className="text-sm text-muted-foreground">
                      {contest.prizes}
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditContest(contest)}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteContest(contest.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
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
        <DialogContent className="sm:max-w-[550px]">
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="edit-title"
                      name="title"
                      value={selectedContest.title}
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
                      value={selectedContest.description}
                      onChange={handleEditChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-platform" className="text-right">
                      Platform
                    </Label>
                    <Input
                      id="edit-platform"
                      name="platform"
                      value={selectedContest.platform}
                      onChange={handleEditChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-link" className="text-right">
                      Contest Link
                    </Label>
                    <Input
                      id="edit-link"
                      name="link"
                      value={selectedContest.link}
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
                            {format(new Date(selectedContest.date), "PPP")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(selectedContest.date)}
                            onSelect={(date) =>
                              setSelectedContest({ ...selectedContest, date })
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
                      value={selectedContest.time}
                      onChange={handleEditChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-difficulty" className="text-right">
                      Difficulty
                    </Label>
                    <Input
                      id="edit-difficulty"
                      name="difficulty"
                      value={selectedContest.difficulty}
                      onChange={handleEditChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-prizes" className="text-right">
                      Prizes
                    </Label>
                    <Input
                      id="edit-prizes"
                      name="prizes"
                      value={selectedContest.prizes}
                      onChange={handleEditChange}
                      className="col-span-3"
                    />
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
                  <Button type="submit">Update Contest</Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* View Contest Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          {selectedContest && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedContest.title}</DialogTitle>
                <DialogDescription>
                  {format(new Date(selectedContest.date), "PP")} •{" "}
                  {selectedContest.time}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Platform</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedContest.platform}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Difficulty</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedContest.difficulty || "Not specified"}
                      </p>
                    </div>
                  </div>
                  {selectedContest.prizes && (
                    <div>
                      <h3 className="text-sm font-medium">Prizes</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedContest.prizes}
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium">Contest Link</h3>
                    <a
                      href={selectedContest.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-1 flex items-center"
                    >
                      {selectedContest.link}{" "}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
              <DialogFooter>
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
    </div>
  );
};

export default ContestManagementSection;
