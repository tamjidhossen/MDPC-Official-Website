import { useState, useEffect, useCallback } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, X, Eye, Edit, Trash, Search, Loader2 } from "lucide-react";
import api from "@/services/api"; // Assuming api service is set up
import { useToast } from "@/hooks/use-toast"; // Assuming toast hook is set up
import { format } from "date-fns"; // For date formatting

const BlogManagementSection = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [blogs, setBlogs] = useState({
    pending: [],
    approved: [],
    rejected: [],
  });
  const [loading, setLoading] = useState({
    fetching: false,
    action: null, // Store ID of blog being acted upon
  });
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const fetchAllBlogs = useCallback(async () => {
    setLoading((prev) => ({ ...prev, fetching: true }));
    setError(null);
    try {
      const response = await api.get(`/blogs?limit=100`); // Fetch all blogs with a high limit

      // Categorize blogs by status
      const allBlogs = response.data.data.blogs || [];
      const categorizedBlogs = {
        pending: allBlogs.filter((blog) => blog.status === "pending"),
        approved: allBlogs.filter((blog) => blog.status === "approved"),
        rejected: allBlogs.filter((blog) => blog.status === "rejected"),
      };

      setBlogs(categorizedBlogs);
    } catch (err) {
      console.error(`Error fetching blogs:`, err);
      setError(`Failed to fetch blogs. Please try again.`);
      toast({
        title: "Error",
        description: `Failed to fetch blogs.`,
        variant: "destructive",
      });
      setBlogs({ pending: [], approved: [], rejected: [] }); // Clear on error
    } finally {
      setLoading((prev) => ({ ...prev, fetching: false }));
    }
  }, [toast]);

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  const updateStatus = async (blogId, newStatus) => {
    setLoading((prev) => ({ ...prev, action: blogId }));
    try {
      await api.patch(`/blogs/${blogId}/status`, { status: newStatus });
      toast({
        title: "Success",
        description: `Blog ${newStatus} successfully.`,
      });

      // Refetch all blogs data after status update
      fetchAllBlogs();

      if (viewDialogOpen) setViewDialogOpen(false); // Close dialog if open
    } catch (err) {
      console.error(`Error updating blog status to ${newStatus}:`, err);
      toast({
        title: "Error",
        description: `Failed to ${
          newStatus === "approved" ? "approve" : "reject"
        } blog.`,
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, action: null }));
    }
  };

  const deleteBlogHandler = async (blogId) => {
    setLoading((prev) => ({ ...prev, action: blogId }));
    try {
      await api.delete(`/blogs/${blogId}`);
      toast({
        title: "Success",
        description: "Blog deleted successfully.",
      });
      fetchAllBlogs(); // Refetch all blogs data
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast({
        title: "Error",
        description: "Failed to delete blog.",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, action: null }));
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchTerm("");
    setError(null); // Clear error when changing tabs
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setViewDialogOpen(true);
  };

  const filteredBlogs = blogs[activeTab].filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.author?.name &&
        blog.author.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getActionButtons = (blog) => {
    const isActionLoading = loading.action === blog._id;
    switch (blog.status) {
      case "pending":
        return (
          <>
            <Button
              size="sm"
              onClick={() => updateStatus(blog._id, "approved")}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}{" "}
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => updateStatus(blog._id, "rejected")}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}{" "}
              Reject
            </Button>
          </>
        );
      case "approved":
        return (
          <>
            <Button size="sm" variant="outline" disabled>
              {" "}
              {/* Edit functionality not implemented */}
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteBlogHandler(blog._id)}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}{" "}
              Delete
            </Button>
          </>
        );
      case "rejected":
        return (
          <>
            <Button
              size="sm"
              onClick={() => updateStatus(blog._id, "approved")}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}{" "}
              Reconsider
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteBlogHandler(blog._id)}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}{" "}
              Delete
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  const renderBlogCard = (blog) => {
    const isActionLoading = loading.action === blog._id;
    const formattedDate = blog.createdAt
      ? format(new Date(blog.createdAt), "PPP")
      : "N/A";
    const authorName = blog.author?.name || "Unknown Author";

    return (
      <Card key={blog._id}>
        <CardHeader>
          <CardTitle>{blog.title}</CardTitle>
          <CardDescription>
            By {authorName} • {formattedDate} • {blog.category}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {blog.content || "No content preview available"}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewBlog(blog)}
              disabled={isActionLoading}
            >
              <Eye className="mr-2 h-4 w-4" /> View
            </Button>
          </div>
          <div className="flex space-x-2">{getActionButtons(blog)}</div>
        </CardFooter>
      </Card>
    );
  };

  const renderTabContent = (status) => {
    if (loading.fetching && blogs[status].length === 0) {
      return (
        <div className="text-center py-8">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (error && blogs[status].length === 0) {
      return <p className="text-center py-8 text-destructive">{error}</p>;
    }
    if (!loading.fetching && filteredBlogs.length === 0) {
      return (
        <p className="text-center py-8 text-muted-foreground">
          No {status} blogs{" "}
          {searchTerm ? "match your search criteria" : "found"}.
        </p>
      );
    }
    return <div className="space-y-4">{filteredBlogs.map(renderBlogCard)}</div>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Blog Management</h2>
        <p className="text-muted-foreground">
          Manage blog posts and review submissions.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
          disabled={loading.fetching}
        />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="pending" disabled={loading.fetching}>
            Pending Review{" "}
            {!loading.fetching && (
              <Badge className="ml-2">{blogs.pending.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" disabled={loading.fetching}>
            Approved{" "}
            {!loading.fetching && (
              <Badge className="ml-2">{blogs.approved.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" disabled={loading.fetching}>
            Rejected{" "}
            {!loading.fetching && (
              <Badge className="ml-2">{blogs.rejected.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {renderTabContent("pending")}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {renderTabContent("approved")}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {renderTabContent("rejected")}
        </TabsContent>
      </Tabs>

      {/* Blog View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
          {selectedBlog && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedBlog.title}</DialogTitle>
                <DialogDescription>
                  By {selectedBlog.author?.name || "Unknown"} •{" "}
                  {selectedBlog.createdAt
                    ? format(new Date(selectedBlog.createdAt), "PPP")
                    : "N/A"}{" "}
                  • {selectedBlog.category}
                  {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedBlog.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              <Separator className="my-4" />
              <div className="py-4 prose dark:prose-invert max-w-none">
                {/* Render actual content - consider using a Markdown renderer if content is Markdown */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedBlog.content.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
              <Separator className="my-4" />
              <DialogFooter>
                {selectedBlog.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => updateStatus(selectedBlog._id, "rejected")}
                      disabled={loading.action === selectedBlog._id}
                    >
                      {loading.action === selectedBlog._id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <X className="mr-2 h-4 w-4" />
                      )}{" "}
                      Reject
                    </Button>
                    <Button
                      onClick={() => updateStatus(selectedBlog._id, "approved")}
                      disabled={loading.action === selectedBlog._id}
                    >
                      {loading.action === selectedBlog._id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}{" "}
                      Approve
                    </Button>
                  </>
                )}
                {selectedBlog.status === "rejected" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => deleteBlogHandler(selectedBlog._id)}
                      disabled={loading.action === selectedBlog._id}
                    >
                      {loading.action === selectedBlog._id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="mr-2 h-4 w-4" />
                      )}{" "}
                      Delete
                    </Button>
                    <Button
                      onClick={() => updateStatus(selectedBlog._id, "approved")}
                      disabled={loading.action === selectedBlog._id}
                    >
                      {loading.action === selectedBlog._id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 h-4 w-4" />
                      )}{" "}
                      Reconsider
                    </Button>
                  </>
                )}
                {selectedBlog.status === "approved" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => deleteBlogHandler(selectedBlog._id)}
                      disabled={loading.action === selectedBlog._id}
                    >
                      {loading.action === selectedBlog._id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="mr-2 h-4 w-4" />
                      )}{" "}
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setViewDialogOpen(false)}
                    >
                      Close
                    </Button>
                  </>
                )}
                {selectedBlog.status !== "pending" &&
                  selectedBlog.status !== "rejected" &&
                  selectedBlog.status !== "approved" && (
                    <Button
                      variant="outline"
                      onClick={() => setViewDialogOpen(false)}
                    >
                      Close
                    </Button>
                  )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagementSection;
