import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
// Import Quill as a dynamic import to prevent Vite optimization issues
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  PenTool,
  ThumbsUp,
  MessageSquare,
  Eye,
  Trash,
  X,
} from "lucide-react";
import { blogApi } from "@/services/api";

// Quill toolbar options
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }, { header: 3 }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  ["link", "image"],
  ["clean"],
];

const BlogsSection = () => {
  const { toast } = useToast();
  const quillEditorRef = useRef(null);
  const quillInstance = useRef(null);
  const [quillLoaded, setQuillLoaded] = useState(false);

  // Blog form state
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogTags, setBlogTags] = useState("");
  const [blogCategory, setBlogCategory] = useState("");

  // Blog data state
  const [draftBlogs, setDraftBlogs] = useState([]);
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [activeBlogTab, setActiveBlogTab] = useState("write");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Quill editor with dynamic import to prevent Vite optimization issues
  useEffect(() => {
    if (
      quillEditorRef.current &&
      !quillInstance.current &&
      activeBlogTab === "write"
    ) {
      // Dynamically import Quill to avoid Vite optimization issues
      import("quill")
        .then((Quill) => {
          if (!quillInstance.current && quillEditorRef.current) {
            quillInstance.current = new Quill.default(quillEditorRef.current, {
              modules: {
                toolbar: toolbarOptions,
              },
              theme: "snow",
            });

            // Set initial content if available
            if (blogContent) {
              quillInstance.current.root.innerHTML = blogContent;
            }

            // Handle content changes
            quillInstance.current.on("text-change", () => {
              setBlogContent(quillInstance.current.root.innerHTML);
            });

            setQuillLoaded(true);
          }
        })
        .catch((err) => {
          console.error("Error loading Quill:", err);
          toast({
            title: "Editor Error",
            description:
              "Failed to load the rich text editor. Please refresh the page.",
            variant: "destructive",
          });
        });
    }

    return () => {
      // Clean up quill instance when component unmounts or tab changes
      if (quillInstance.current) {
        // Store content before destroying instance
        const content = quillInstance.current.root.innerHTML;
        setBlogContent(content);

        // Destroy the instance
        quillInstance.current = null;
        setQuillLoaded(false);
      }
    };
  }, [activeBlogTab]);

  // Set content when editing an existing blog
  useEffect(() => {
    if (quillInstance.current && currentBlog) {
      quillInstance.current.root.innerHTML = currentBlog.content || "";
      setBlogContent(currentBlog.content || "");
    }
  }, [currentBlog, quillLoaded]);

  // Fetch user's blogs
  const fetchUserBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch pending blogs (drafts)
      const pendingResponse = await blogApi.getUserBlogs({ status: "pending" });
      console.log("Pending blogs response:", pendingResponse);

      // Ensure we're handling the response data correctly, depending on API structure
      let pendingBlogs = [];
      if (pendingResponse && pendingResponse.data) {
        pendingBlogs =
          pendingResponse.data.blogs ||
          (Array.isArray(pendingResponse.data) ? pendingResponse.data : []);
      }
      setDraftBlogs(pendingBlogs);

      // Fetch approved blogs (published)
      const approvedResponse = await blogApi.getUserBlogs({
        status: "approved",
      });

      // Ensure we're handling the response data correctly
      let approvedBlogs = [];
      if (approvedResponse && approvedResponse.data) {
        approvedBlogs =
          approvedResponse.data.blogs ||
          (Array.isArray(approvedResponse.data) ? approvedResponse.data : []);
      }
      setPublishedBlogs(approvedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Error",
        description: "Failed to load your blogs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUserBlogs();
  }, [fetchUserBlogs]);

  // Reset form state
  const resetForm = () => {
    setBlogTitle("");
    setBlogContent("");
    if (quillInstance.current) {
      quillInstance.current.root.innerHTML = "";
    }
    setBlogTags("");
    setBlogCategory("");
    setCurrentBlog(null);
  };

  // Handle edit blog
  const handleEditBlog = (blog) => {
    setBlogTitle(blog.title || "");
    setBlogTags((blog.tags || []).join(", "));
    setBlogCategory(blog.category || "");
    setCurrentBlog(blog);
    setActiveBlogTab("write");

    // The content will be set via useEffect when currentBlog changes
  };

  // Handle publish blog
  const handlePublishBlog = async () => {
    // Validate form
    if (!blogTitle.trim()) {
      toast({
        title: "Missing field",
        description: "Please enter a blog title.",
        variant: "destructive",
      });
      return;
    }

    if (!blogContent.trim()) {
      toast({
        title: "Missing field",
        description: "Please enter blog content.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", blogTitle);
      formData.append("content", blogContent);
      formData.append("category", blogCategory || "Uncategorized");

      // Split tags by comma and trim whitespace
      if (blogTags) {
        const tagsArray = blogTags.split(",").map((tag) => tag.trim());
        // Add each tag individually to the formData
        tagsArray.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }

      let response;

      if (currentBlog) {
        // Update existing blog
        response = await blogApi.update(currentBlog._id, formData);
      } else {
        // Create new blog
        response = await blogApi.create(formData);
      }

      toast({
        title: "Success!",
        description: "Blog submitted for approval.",
      });

      resetForm();
      fetchUserBlogs();
    } catch (error) {
      console.error("Error publishing blog:", error);
      let errorMsg = "Failed to submit blog. Please try again."; // Default message

      // Check for structured validation errors
      if (
        error.response?.data?.errors &&
        Array.isArray(error.response.data.errors) &&
        error.response.data.errors.length > 0
      ) {
        const firstError = error.response.data.errors[0];
        errorMsg = `${firstError.field}: ${firstError.message}`;
      } else if (error.response?.data?.message) {
        // Use the general message if no structured errors
        errorMsg = error.response.data.message;
      }

      toast({
        title: "Submission Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle publish directly from pending tab
  const handlePublishFromPending = (blog) => {
    // Skip the form validation since we're using data directly from the database
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", blog.title);
    formData.append("content", blog.content);
    formData.append("category", blog.category || "Uncategorized");

    // Add tags if they exist
    if (blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0) {
      blog.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
    }

    // Update the blog
    blogApi
      .update(blog._id, formData)
      .then((response) => {
        toast({
          title: "Success!",
          description: "Blog submitted for approval.",
        });
        fetchUserBlogs();
      })
      .catch((error) => {
        console.error("Error publishing blog:", error);
        toast({
          title: "Error",
          description: "Failed to submit blog. Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Handle delete blog
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      await blogApi.delete(blogId);
      toast({
        title: "Success",
        description: "Blog deleted successfully.",
      });
      fetchUserBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <Tabs
          value={activeBlogTab}
          onValueChange={setActiveBlogTab}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="drafts">Pending</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="pt-2">
        {/* Write blog tab */}
        {activeBlogTab === "write" && (
          <Card>
            <CardHeader>
              <CardTitle>
                {currentBlog ? "Edit Blog" : "Write New Blog"}
              </CardTitle>
              <CardDescription>
                Share your competitive programming insights and experiences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="blog-title">Blog Title</Label>
                <Input
                  id="blog-title"
                  placeholder="Enter a descriptive title"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blog-category">Category</Label>
                <Input
                  id="blog-category"
                  placeholder="e.g., Algorithms, Data Structures, CP Tips"
                  value={blogCategory}
                  onChange={(e) => setBlogCategory(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <div className="min-h-[300px]">
                  {/* Quill editor container */}
                  <div ref={quillEditorRef} style={{ height: "300px" }} />
                  {!quillLoaded && activeBlogTab === "write" && (
                    <div className="flex justify-center items-center h-[300px] border rounded-md bg-muted/20">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blog-tags">Tags</Label>
                <Input
                  id="blog-tags"
                  placeholder="e.g., dynamic-programming, graphs, algorithms"
                  value={blogTags}
                  onChange={(e) => setBlogTags(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="space-x-2">
                {currentBlog && (
                  <Button variant="ghost" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
                <Button
                  disabled={
                    isSubmitting || !blogTitle || !blogContent || !quillLoaded
                  }
                  onClick={handlePublishBlog}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  {currentBlog ? "Update" : "Publish"} Blog
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {/* Drafts tab */}
        {activeBlogTab === "drafts" && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Blogs</CardTitle>
              <CardDescription>
                Continue working on your blogs awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : draftBlogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You don't have any draft blogs yet. Start writing!
                </div>
              ) : (
                <div className="space-y-4">
                  {draftBlogs.map((blog) => (
                    <Card key={blog._id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{blog.title}</CardTitle>
                        <CardDescription>
                          Last edited:{" "}
                          {new Date(blog.updatedAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {blog.content
                            ?.replace(/<[^>]*>?/gm, "")
                            .substring(0, 150)}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBlog(blog)}
                        >
                          Edit
                        </Button>
                        <div className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handlePublishFromPending(blog)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : null}
                            Publish
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Published tab */}
        {activeBlogTab === "published" && (
          <Card>
            <CardHeader>
              <CardTitle>Published Blogs</CardTitle>
              <CardDescription>Manage your published content</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : publishedBlogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You haven't published any blogs yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {publishedBlogs.map((blog) => (
                    <Card key={blog._id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{blog.title}</CardTitle>
                        <CardDescription>
                          Published:{" "}
                          {new Date(
                            blog.publishedDate || blog.updatedAt
                          ).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex gap-4 text-sm">
                          {/* These are placeholder metrics - backend doesn't currently track these */}
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" /> {blog.views || 0}{" "}
                            views
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />{" "}
                            {blog.likes || 0} likes
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />{" "}
                            {blog.comments || 0} comments
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBlog(blog)}
                        >
                          Edit
                        </Button>
                        <div className="space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/blogs/${blog._id}`}>View</Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlogsSection;
