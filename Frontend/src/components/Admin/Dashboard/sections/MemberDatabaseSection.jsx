import React, { useState, useEffect } from "react";
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
import { Search, UserPlus, Edit, Trash, Eye, Loader2 } from "lucide-react";
import { memberApi } from "@/services/api";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const MemberDatabaseSection = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalMembers: 0,
    totalPages: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [sessions, setSessions] = useState(["all"]);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch members data from API
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare query parameters
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: activeTab, // API expects "active" or "pending"
      };

      // Add session filter if not "all"
      if (sessionFilter !== "all") {
        params.session = sessionFilter;
      }

      // Add search term if available
      if (searchTerm.trim()) {
        params.search = searchTerm;
      }

      const response = await memberApi.getAll(params);

      if (response.success) {
        setMembers(response.data.members || []);
        setPagination(
          response.data.pagination || {
            page: 1,
            limit: 10,
            totalMembers: 0,
            totalPages: 0,
          }
        );

        // Extract unique sessions from members for filtering
        if (response.data.members && response.data.members.length > 0) {
          const uniqueSessions = [
            "all",
            ...new Set(response.data.members.map((member) => member.session)),
          ];
          setSessions(uniqueSessions);
        }
      } else {
        setError("Failed to fetch members");
        toast.error("Failed to fetch members");
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to fetch members. Please try again later.");
      toast.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  // Fetch members on component mount and when filter/tab/pagination changes
  useEffect(() => {
    fetchMembers();
  }, [activeTab, sessionFilter, pagination.page, pagination.limit]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMembers();
  };

  // Handle session filter change
  const handleSessionFilterChange = (value) => {
    setSessionFilter(value);
  };

  // View member details
  const handleViewMember = async (memberId) => {
    setLoading(true);
    try {
      const response = await memberApi.getById(memberId);
      if (response.success) {
        setSelectedMember(response.data.member);
        setViewDialogOpen(true);
      } else {
        toast.error("Failed to fetch member details");
      }
    } catch (err) {
      console.error("Error fetching member details:", err);
      toast.error("Failed to fetch member details");
    } finally {
      setLoading(false);
    }
  };

  // Update member status (approve/reject)
  const handleUpdateStatus = async (memberId, status) => {
    setActionLoading(true);
    try {
      const response = await memberApi.updateStatus(memberId, status);
      if (response.success) {
        toast.success(
          `Member ${
            status === "active" ? "approved" : "status updated"
          } successfully`
        );
        setViewDialogOpen(false);
        setEditDialogOpen(false);
        fetchMembers();
      } else {
        toast.error("Failed to update member status");
      }
    } catch (err) {
      console.error("Error updating member status:", err);
      toast.error("Failed to update member status");
    } finally {
      setActionLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  // Delete member
  const handleDeleteMember = async (memberId) => {
    setActionLoading(true);
    try {
      const response = await memberApi.delete(memberId);
      if (response.success) {
        toast.success("Member deleted successfully");
        setDeleteDialogOpen(false);
        fetchMembers();
      } else {
        toast.error("Failed to delete member");
      }
    } catch (err) {
      console.error("Error deleting member:", err);
      toast.error("Failed to delete member");
    } finally {
      setActionLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
        <TabsList>
          <TabsTrigger value="active">Active Members</TabsTrigger>
          <TabsTrigger value="pending">Pending Applications</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-1 items-center space-x-2"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or roll..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-sm"
          />
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>
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
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>{error}</p>
              <Button onClick={fetchMembers} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          ) : members.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Roll</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {member.photo ? (
                              <AvatarImage
                                src={
                                  import.meta.env.VITE_API_URL + member.photo
                                }
                                alt={member.name}
                              />
                            ) : (
                              <AvatarFallback>
                                {getInitials(member.name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.roll}</TableCell>
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
                            onClick={() => handleViewMember(member._id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {member.status === "pending" && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => {
                                setSelectedMember(member);
                                setConfirmDialogOpen(true);
                              }}
                            >
                              Approve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedMember(member);
                              setDeleteDialogOpen(true);
                            }}
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

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next
              </Button>
            </div>
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
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    {selectedMember.photo ? (
                      <AvatarImage
                        src={
                          import.meta.env.VITE_API_URL + selectedMember.photo
                        }
                        alt={selectedMember.name}
                      />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {getInitials(selectedMember.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
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
                    Roll Number:
                  </div>
                  <div className="col-span-3">{selectedMember.roll}</div>
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
                {selectedMember.joinDate && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="text-sm font-medium text-right">
                      Join Date:
                    </div>
                    <div className="col-span-3">
                      {new Date(selectedMember.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
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
                {selectedMember.programmingHandles && (
                  <>
                    {selectedMember.programmingHandles.codeforces && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <div className="text-sm font-medium text-right">
                          Codeforces:
                        </div>
                        <div className="col-span-3">
                          {selectedMember.programmingHandles.codeforces}
                        </div>
                      </div>
                    )}
                    {selectedMember.programmingHandles.vjudge && (
                      <div className="grid grid-cols-4 items-center gap-4">
                        <div className="text-sm font-medium text-right">
                          Vjudge:
                        </div>
                        <div className="col-span-3">
                          {selectedMember.programmingHandles.vjudge}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <DialogFooter>
                {selectedMember.status === "pending" && (
                  <Button
                    onClick={() => {
                      setViewDialogOpen(false);
                      setSelectedMember(selectedMember);
                      setConfirmDialogOpen(true);
                    }}
                  >
                    Approve Member
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => {
                    setViewDialogOpen(false);
                    setSelectedMember(selectedMember);
                    setDeleteDialogOpen(true);
                  }}
                >
                  Delete Member
                </Button>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Member Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this member? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteMember(selectedMember?._id)}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Member"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Member Approval</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this member application?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => handleUpdateStatus(selectedMember?._id, "active")}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                "Approve Member"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberDatabaseSection;
