"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserPlus, Edit, Trash, Eye } from "lucide-react";

const MemberDatabaseSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    email: "",
    studentId: "",
    department: "",
    session: "",
    phone: "",
    joinDate: new Date().toISOString().split("T")[0],
    status: "pending",
  });

  // Dummy data for members
  const dummyMembers = {
    active: [
      {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        studentId: "2019331001",
        department: "Computer Science",
        session: "2019-2020",
        phone: "+880 1712-345678",
        joinDate: "2022-02-15",
        status: "active",
        role: "Member",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        studentId: "2020331042",
        department: "Computer Science",
        session: "2020-2021",
        phone: "+880 1745-678901",
        joinDate: "2022-03-10",
        status: "active",
        role: "Executive",
      },
      {
        id: 3,
        name: "Ahmed Khan",
        email: "ahmed.khan@example.com",
        studentId: "2021331067",
        department: "Electrical Engineering",
        session: "2021-2022",
        phone: "+880 1856-234567",
        joinDate: "2022-08-22",
        status: "active",
        role: "Member",
      },
      {
        id: 4,
        name: "Mina Patel",
        email: "mina.patel@example.com",
        studentId: "2019331089",
        department: "Computer Science",
        session: "2019-2020",
        phone: "+880 1632-123456",
        joinDate: "2023-01-05",
        status: "active",
        role: "Member",
      },
      {
        id: 5,
        name: "David Lee",
        email: "david.lee@example.com",
        studentId: "2022331012",
        department: "Physics",
        session: "2022-2023",
        phone: "+880 1789-876543",
        joinDate: "2023-03-20",
        status: "active",
        role: "Member",
      },
    ],
    pending: [
      {
        id: 6,
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        studentId: "2023331054",
        department: "Computer Science",
        session: "2023-2024",
        phone: "+880 1701-456789",
        joinDate: "2025-04-08",
        status: "pending",
        role: "Applicant",
      },
      {
        id: 7,
        name: "Michael Wong",
        email: "michael.wong@example.com",
        studentId: "2023331077",
        department: "Mathematics",
        session: "2023-2024",
        phone: "+880 1956-765432",
        joinDate: "2025-04-09",
        status: "pending",
        role: "Applicant",
      },
    ],
  };

  // Available sessions for filtering
  const sessions = [
    "all",
    "2019-2020",
    "2020-2021",
    "2021-2022",
    "2022-2023",
    "2023-2024",
  ];

  // Filter members based on search term and session
  const filteredMembers = dummyMembers[activeTab].filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSession =
      sessionFilter === "all" || member.session === sessionFilter;

    return matchesSearch && matchesSession;
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSessionFilterChange = (value) => {
    setSessionFilter(value);
  };

  const handleCreateMember = (e) => {
    e.preventDefault();
    // Here would be API call to create the member
    console.log("Creating new member:", newMemberData);
    setCreateDialogOpen(false);
    setNewMemberData({
      name: "",
      email: "",
      studentId: "",
      department: "",
      session: "",
      phone: "",
      joinDate: new Date().toISOString().split("T")[0],
      status: "pending",
    });
    // Update UI accordingly
  };

  const handleUpdateMember = (e) => {
    e.preventDefault();
    // Here would be API call to update the member
    console.log("Updating member:", selectedMember);
    setEditDialogOpen(false);
    // Update UI accordingly
  };

  const handleDeleteMember = (memberId) => {
    // Here would be API call to delete the member
    console.log(`Deleting member with ID: ${memberId}`);
    // Update UI accordingly
  };

  const handleApproveMember = (memberId) => {
    // Here would be API call to approve the member
    console.log(`Approving member with ID: ${memberId}`);
    // Update UI accordingly
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setViewDialogOpen(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember({ ...member });
    setEditDialogOpen(true);
  };

  const handleMemberInputChange = (e) => {
    const { name, value } = e.target;
    setNewMemberData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectedMemberChange = (e) => {
    const { name, value } = e.target;
    setSelectedMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectedMemberStatusChange = (status) => {
    setSelectedMember((prev) => ({
      ...prev,
      status,
    }));
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchTerm("");
    setSessionFilter("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Member Database</h2>
          <p className="text-muted-foreground">
            Manage club members, approve new applications, and view member
            details.
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <DialogDescription>
                Create a new member account or application.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateMember}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newMemberData.name}
                    onChange={handleMemberInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newMemberData.email}
                    onChange={handleMemberInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="studentId" className="text-right">
                    Student ID
                  </Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    value={newMemberData.studentId}
                    onChange={handleMemberInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department
                  </Label>
                  <Input
                    id="department"
                    name="department"
                    value={newMemberData.department}
                    onChange={handleMemberInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="session" className="text-right">
                    Session
                  </Label>
                  <Select
                    name="session"
                    value={newMemberData.session}
                    onValueChange={(value) =>
                      setNewMemberData({ ...newMemberData, session: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions
                        .filter((s) => s !== "all")
                        .map((session) => (
                          <SelectItem key={session} value={session}>
                            {session}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newMemberData.phone}
                    onChange={handleMemberInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    name="status"
                    value={newMemberData.status}
                    onValueChange={(value) =>
                      setNewMemberData({ ...newMemberData, status: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Button type="submit">Create Member</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
        <TabsList>
          <TabsTrigger value="active">
            Active Members{" "}
            <Badge className="ml-2">{dummyMembers.active.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Applications{" "}
            <Badge className="ml-2">{dummyMembers.pending.length}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or ID..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="session-filter">Session Filter:</Label>
          <Select
            id="session-filter"
            value={sessionFilter}
            onValueChange={handleSessionFilterChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by session" />
            </SelectTrigger>
            <SelectContent>
              {sessions.map((session) => (
                <SelectItem key={session} value={session}>
                  {session === "all" ? "All Sessions" : session}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "active" ? "Active Members" : "Pending Applications"}
            {sessionFilter !== "all" && ` - ${sessionFilter} Session`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMembers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell>{member.studentId}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>{member.session}</TableCell>
                      <TableCell>
                        {member.status === "active" ? (
                          <Badge>Active</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewMember(member)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {member.status === "pending" ? (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApproveMember(member.id)}
                            >
                              Approve
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditMember(member)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center py-6 text-muted-foreground">
              No members found matching your search criteria.
            </p>
          )}
        </CardContent>
      </Card>

      {/* View Member Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle>Member Details</DialogTitle>
                <DialogDescription>
                  Complete information about the member.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-sm font-medium text-right">Name:</div>
                  <div className="col-span-3">{selectedMember.name}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-sm font-medium text-right">Email:</div>
                  <div className="col-span-3">{selectedMember.email}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-sm font-medium text-right">
                    Student ID:
                  </div>
                  <div className="col-span-3">{selectedMember.studentId}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-sm font-medium text-right">
                    Department:
                  </div>
                  <div className="col-span-3">{selectedMember.department}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-sm font-medium text-right">Session:</div>
                  <div className="col-span-3">{selectedMember.session}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-sm font-medium text-right">Phone:</div>
                  <div className="col-span-3">{selectedMember.phone}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-sm font-medium text-right">
                    Join Date:
                  </div>
                  <div className="col-span-3">{selectedMember.joinDate}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-sm font-medium text-right">Status:</div>
                  <div className="col-span-3">
                    {selectedMember.status === "active" ? (
                      <Badge>Active</Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-sm font-medium text-right">Role:</div>
                  <div className="col-span-3">{selectedMember.role}</div>
                </div>
              </div>
              <DialogFooter>
                {selectedMember.status === "pending" && (
                  <Button
                    onClick={() => handleApproveMember(selectedMember.id)}
                  >
                    Approve Member
                  </Button>
                )}
                {selectedMember.status === "active" && (
                  <Button onClick={() => handleEditMember(selectedMember)}>
                    Edit Member
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

      {/* Edit Member Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedMember && (
            <>
              <DialogHeader>
                <DialogTitle>Edit Member</DialogTitle>
                <DialogDescription>
                  Update member account information.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateMember}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={selectedMember.name}
                      onChange={handleSelectedMemberChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={selectedMember.email}
                      onChange={handleSelectedMemberChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-department" className="text-right">
                      Department
                    </Label>
                    <Input
                      id="edit-department"
                      name="department"
                      value={selectedMember.department}
                      onChange={handleSelectedMemberChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="edit-phone"
                      name="phone"
                      value={selectedMember.phone}
                      onChange={handleSelectedMemberChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-status" className="text-right">
                      Status
                    </Label>
                    <Select
                      name="status"
                      value={selectedMember.status}
                      onValueChange={handleSelectedMemberStatusChange}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberDatabaseSection;
