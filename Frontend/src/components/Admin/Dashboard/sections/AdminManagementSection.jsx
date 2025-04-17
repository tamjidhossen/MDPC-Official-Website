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
import { Separator } from "@/components/ui/separator";
import {
  Search,
  UserCog,
  UserPlus,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/services/api.js";

const AdminManagementSection = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [addAdminDialogOpen, setAddAdminDialogOpen] = useState(false);
  const [removeAdminDialogOpen, setRemoveAdminDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  // State for API data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [permissionLevel, setPermissionLevel] = useState("admin");
  const [searching, setSearching] = useState(false);

  // Fetch users on component mount and when page changes
  useEffect(() => {
    fetchUsers();
  }, [page]);

  // Function to fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getAllUsers({
        page,
        limit: 10,
      });

      if (response.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError("Failed to fetch users");
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      toast({
        title: "Error",
        description: err.message || "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to search users
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Debounced search effect for finding potential admins
  useEffect(() => {
    if (!addAdminDialogOpen || !searchTerm) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await userApi.getAllUsers({
          search: searchTerm,
          limit: 5,
        });

        if (response.success) {
          // Filter out users who are already admins
          const regularUsers = response.data.users.filter(
            (user) => user.role !== "admin"
          );
          setSearchResults(regularUsers);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, addAdminDialogOpen]);

  // Filter users by role
  const adminUsers = users.filter((user) => user.role === "admin");

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await userApi.promoteToAdmin(selectedUser._id);
      if (response.success) {
        toast({
          title: "Admin Added",
          description: `${selectedUser.name} has been promoted to admin successfully.`,
        });
        // Refresh the user list
        fetchUsers();
        // Close dialog and reset
        setAddAdminDialogOpen(false);
        setSelectedUser(null);
      } else {
        toast({
          title: "Error",
          description: "Failed to promote user to admin",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to promote user to admin",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAdmin = async () => {
    if (!selectedUser) return;

    try {
      const response = await userApi.removeAdmin(selectedUser._id);
      if (response.success) {
        toast({
          title: "Admin Rights Removed",
          description: `${selectedUser.name} is no longer an administrator.`,
        });
        // Refresh the user list
        fetchUsers();
      } else {
        toast({
          title: "Error",
          description: "Failed to remove admin rights",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to remove admin rights",
        variant: "destructive",
      });
    } finally {
      setRemoveAdminDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const openAddAdminDialog = () => {
    setSelectedUser(null);
    setSearchTerm("");
    setSearchResults([]);
    setAddAdminDialogOpen(true);
  };

  const selectUserForPromotion = (user) => {
    setSelectedUser(user);
  };

  const openRemoveAdminDialog = (admin) => {
    setSelectedUser(admin);
    setRemoveAdminDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Management</h2>
        <p className="text-muted-foreground">
          Manage administrator accounts and permissions for the MDPC website.
        </p>
      </div>

      {/* Search and actions row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Button onClick={openAddAdminDialog}>
          <UserPlus className="mr-2 h-4 w-4" /> Add New Admin
        </Button>
      </div>

      {/* Current admins section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCog className="mr-2 h-5 w-5" /> Current Administrators
          </CardTitle>
          <CardDescription>
            Users with administrative access to the MDPC website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              <p>Error: {error}</p>
              <Button variant="outline" onClick={fetchUsers} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : adminUsers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell className="font-medium">
                        {admin.name}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Badge>Admin</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openRemoveAdminDialog(admin)}
                        >
                          <ShieldX className="mr-2 h-4 w-4" />
                          Remove Admin
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No administrators found.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Add Admin Dialog */}
      <Dialog open={addAdminDialogOpen} onOpenChange={setAddAdminDialogOpen}>
        <DialogContent>
          {selectedUser ? (
            <>
              <DialogHeader>
                <DialogTitle>Promote User to Admin</DialogTitle>
                <DialogDescription>
                  This will give {selectedUser.name} administrative access to
                  the MDPC website.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Name</Label>
                    <div className="col-span-3 font-medium">
                      {selectedUser.name}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Email</Label>
                    <div className="col-span-3">{selectedUser.email}</div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="permission-level">Permission Level</Label>
                    <select
                      id="permission-level"
                      value={permissionLevel}
                      onChange={(e) => setPermissionLevel(e.target.value)}
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="admin">Standard Administrator</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Administrators have full access to the dashboard including
                      managing users, content, events, and contests.
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => setSelectedUser(null)}>
                  Back
                </Button>
                <Button onClick={handleAddAdmin} disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="mr-2 h-4 w-4" />
                  )}
                  Promote to Admin
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Add New Administrator</DialogTitle>
                <DialogDescription>
                  Search for an existing user to promote to administrator.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div className="flex space-x-2 items-center">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="flex-1"
                    />
                  </div>

                  <div className="mt-4">
                    {searching ? (
                      <div className="py-4 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground mb-2">
                          {searchResults.length} user
                          {searchResults.length !== 1 ? "s" : ""} found
                        </p>
                        {searchResults.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center justify-between p-3 rounded-md border hover:bg-muted cursor-pointer"
                            onClick={() => selectUserForPromotion(user)}
                          >
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                            <Button size="sm">Select</Button>
                          </div>
                        ))}
                      </div>
                    ) : searchTerm ? (
                      <p className="text-center py-4 text-muted-foreground">
                        No users match your search.
                      </p>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">
                        Enter a name or email to search for users.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setAddAdminDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Remove Admin Dialog */}
      <Dialog
        open={removeAdminDialogOpen}
        onOpenChange={setRemoveAdminDialogOpen}
      >
        <DialogContent>
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Remove Admin Rights</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove administrator rights from{" "}
                  {selectedUser.name}?
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-md border p-4 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-10 w-10 text-amber-500" />
                    <div>
                      <p className="font-medium">
                        This action cannot be undone
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedUser.name} will no longer have access to the
                        admin dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setRemoveAdminDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRemoveAdmin}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldX className="mr-2 h-4 w-4" />
                  )}
                  Remove Admin Rights
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagementSection;
