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
  const [newAdminEmail, setNewAdminEmail] = useState("");

  // State for API data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [permissionLevel, setPermissionLevel] = useState("admin");

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
        search: searchTerm,
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

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to first page when searching
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter users by role
  const adminUsers = users.filter((user) => user.role === "admin");
  const regularUsers = users.filter(
    (user) => user.role === "user" && user.isMember
  );

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
    } finally {
      setAddAdminDialogOpen(false);
      setSelectedUser(null);
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

  const openAddAdminDialog = (user) => {
    setSelectedUser(user);
    setAddAdminDialogOpen(true);
  };

  const openRemoveAdminDialog = (admin) => {
    setSelectedUser(admin);
    setRemoveAdminDialogOpen(true);
  };

  const addUserByEmail = async (e) => {
    e.preventDefault();
    if (!newAdminEmail) return;

    try {
      // First, search for the user by email
      const response = await userApi.getAllUsers({
        search: newAdminEmail,
        limit: 1,
      });

      if (response.success && response.data.users.length > 0) {
        const user = response.data.users[0];

        // If user is already an admin, show notification
        if (user.role === "admin") {
          toast({
            title: "Notice",
            description: `${user.name} is already an administrator.`,
          });
          setNewAdminEmail("");
          return;
        }

        // Otherwise, promote the user to admin
        const promoteResponse = await userApi.promoteToAdmin(user._id);
        if (promoteResponse.success) {
          toast({
            title: "Admin Added",
            description: `${user.name} (${user.email}) has been promoted to admin successfully.`,
          });
          // Refresh the user list
          fetchUsers();
        }
      } else {
        toast({
          title: "User Not Found",
          description: `No user found with email ${newAdminEmail}`,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to add admin by email",
        variant: "destructive",
      });
    } finally {
      setNewAdminEmail("");
    }
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
        <Button onClick={() => setAddAdminDialogOpen(true)}>
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
                <Button
                  variant="ghost"
                  onClick={() => setAddAdminDialogOpen(false)}
                >
                  Cancel
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
                  Select a member to grant admin privileges.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="Search for user..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="mb-4"
                />
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {loading ? (
                    <div className="py-4 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : regularUsers.length > 0 ? (
                    regularUsers.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-3 rounded-md border hover:bg-muted cursor-pointer"
                        onClick={() => openAddAdminDialog(user)}
                      >
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <Button size="sm">Select</Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No users match your search.
                    </p>
                  )}
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
