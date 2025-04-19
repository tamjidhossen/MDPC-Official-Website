import React, { useState, useEffect, useCallback } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  X,
  Eye,
  Edit,
  Trash,
  FileUp,
  Search,
  Plus,
  Loader2,
} from "lucide-react";
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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newBlogData, setNewBlogData] = useState({
    title: "",
    category: "",
    content: "",
    tags: "", // Keep tags as a comma-separated string for input
  });

  const fetchBlogs = useCallback(
    async (status) => {
      setLoading((prev) => ({ ...prev, fetching: true }));
      setError(null);
      try {
        const response = await api.get(`/blogs?status=${status}&limit=100`); // Fetch more blogs, consider pagination later
        setBlogs((prev) => ({
          ...prev,
          [status]: response.data.data.blogs || [],
        }));
      } catch (err) {
        console.error(`Error fetching ${status} blogs:`, err);
        setError(`Failed to fetch ${status} blogs. Please try again.`);
        toast({
          title: "Error",
          description: `Failed to fetch ${status} blogs.`,
          variant: "destructive",
        });
        setBlogs((prev) => ({ ...prev, [status]: [] })); // Clear on error
      } finally {
        setLoading((prev) => ({ ...prev, fetching: false }));
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchBlogs(activeTab);
  }, [activeTab, fetchBlogs]);

  const updateStatus = async (blogId, newStatus) => {
    setLoading((prev) => ({ ...prev, action: blogId }));
    try {
      await api.patch(`/blogs/${blogId}/status`, { status: newStatus });
      toast({
        title: "Success",
        description: `Blog ${newStatus} successfully.`,
      });
      // Refetch relevant tabs
      fetchBlogs(activeTab); // Refetch current tab
      if (activeTab !== newStatus) {
        fetchBlogs(newStatus); // Refetch target tab if different
      }
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
      fetchBlogs(activeTab); // Refetch current tab
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

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, action: "uploading" })); // Indicate upload action
    try {
      // Parse tags string into an array, filtering out empty strings
      const tagsArray = newBlogData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const payload = {
        title: newBlogData.title,
        content: newBlogData.content,
        category: newBlogData.category,
        tags: tagsArray, // Send as array
      };

      await api.post("/blogs", payload);
      toast({
        title: "Success",
        description: "Blog uploaded successfully and is pending review.",
      });
      setUploadDialogOpen(false);
      setNewBlogData({ title: "", category: "", content: "", tags: "" });
      fetchBlogs("pending"); // Refresh pending blogs list
    } catch (err) {
      console.error("Error uploading blog:", err);
      let errorMsg = "Failed to upload blog."; // Default message

      // Check for structured validation errors
      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors) &&
        err.response.data.errors.length > 0
      ) {
        const firstError = err.response.data.errors[0];
        errorMsg = `${firstError.field}: ${firstError.message}`;
      } else if (err.response?.data?.message) {
        // Use the general message if no structured errors
        errorMsg = err.response.data.message;
      }

      toast({
        title: "Upload Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, action: null }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Blog Management</h2>
          <p className="text-muted-foreground">
            Manage blog posts, review submissions, and upload new content.
          </p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={loading.action === "uploading"}>
              {loading.action === "uploading" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}{" "}
              Upload New Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Upload New Blog</DialogTitle>
              <DialogDescription>
                Create a new blog post. It will be submitted for review.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={newBlogData.title}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                    disabled={loading.action === "uploading"}
                  />
                </div>
                {/* Author is determined by backend based on JWT */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    name="category"
                    value={newBlogData.category}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                    disabled={loading.action === "uploading"}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={newBlogData.tags}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Comma-separated, e.g., algorithms, dp, graphs"
                    disabled={loading.action === "uploading"}
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="content" className="text-right pt-2">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={newBlogData.content}
                    onChange={handleInputChange}
                    className="col-span-3 min-h-[200px]"
                    required
                    disabled={loading.action === "uploading"}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                  disabled={loading.action === "uploading"}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading.action === "uploading"}>
                  {loading.action === "uploading" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  Upload Blog
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
