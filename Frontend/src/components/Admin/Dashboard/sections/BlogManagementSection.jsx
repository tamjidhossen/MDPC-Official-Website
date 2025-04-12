"use client";

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
import { Check, X, Eye, Edit, Trash, FileUp, Search, Plus } from "lucide-react";

const BlogManagementSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newBlogData, setNewBlogData] = useState({
    title: "",
    author: "",
    category: "",
    content: "",
    summary: "",
  });

  // Dummy data for blogs
  const dummyBlogs = {
    pending: [
      {
        id: 1,
        title: "Introduction to Dynamic Programming",
        author: "Sarah Parker",
        date: "2025-04-10",
        category: "Algorithms",
        status: "pending",
        summary:
          "A comprehensive guide to understanding dynamic programming concepts and techniques.",
      },
      {
        id: 2,
        title: "Graph Algorithms for Competitive Programming",
        author: "Alex Johnson",
        date: "2025-04-08",
        category: "Algorithms",
        status: "pending",
        summary:
          "Exploring advanced graph algorithms used in competitive programming contests.",
      },
      {
        id: 3,
        title: "Optimizing Your Code: Performance Tips",
        author: "David Wilson",
        date: "2025-04-05",
        category: "Best Practices",
        status: "pending",
        summary:
          "Learn techniques to optimize your code for better performance in competitions.",
      },
    ],
    approved: [
      {
        id: 4,
        title: "Data Structures You Need to Know",
        author: "Emily Brown",
        date: "2025-04-01",
        category: "Data Structures",
        status: "approved",
        summary:
          "Essential data structures every competitive programmer should master.",
      },
      {
        id: 5,
        title: "Solving Codeforces Problems: A Strategic Approach",
        author: "Michael Smith",
        date: "2025-03-28",
        category: "Strategy",
        status: "approved",
        summary:
          "Strategies for tackling different types of problems on Codeforces.",
      },
    ],
    rejected: [
      {
        id: 6,
        title: "My Journey in Competitive Programming",
        author: "Chris Lee",
        date: "2025-03-25",
        category: "Personal",
        status: "rejected",
        summary:
          "Personal story without technical depth required for the blog.",
      },
    ],
  };

  const filteredBlogs = dummyBlogs[activeTab].filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchTerm("");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setViewDialogOpen(true);
  };

  const handleApprove = (blogId) => {
    // Here would be API call to approve the blog
    console.log(`Approved blog with ID: ${blogId}`);
    // Update UI accordingly
  };

  const handleReject = (blogId) => {
    // Here would be API call to reject the blog
    console.log(`Rejected blog with ID: ${blogId}`);
    // Update UI accordingly
  };

  const handleDelete = (blogId) => {
    // Here would be API call to delete the blog
    console.log(`Deleted blog with ID: ${blogId}`);
    // Update UI accordingly
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    // Here would be API call to upload the blog
    console.log("Blog upload data:", newBlogData);
    setUploadDialogOpen(false);
    setNewBlogData({
      title: "",
      author: "",
      category: "",
      content: "",
      summary: "",
    });
    // Update UI accordingly
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Upload New Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Upload New Blog</DialogTitle>
              <DialogDescription>
                Create a new blog post to be published on the website.
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
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="author" className="text-right">
                    Author
                  </Label>
                  <Input
                    id="author"
                    name="author"
                    value={newBlogData.author}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
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
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="summary" className="text-right">
                    Summary
                  </Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={newBlogData.summary}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={newBlogData.content}
                    onChange={handleInputChange}
                    className="col-span-3 min-h-[200px]"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUploadDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Upload Blog</Button>
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
        />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review{" "}
            <Badge className="ml-2">{dummyBlogs.pending.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved{" "}
            <Badge className="ml-2">{dummyBlogs.approved.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected{" "}
            <Badge className="ml-2">{dummyBlogs.rejected.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <Card key={blog.id}>
                  <CardHeader>
                    <CardTitle>{blog.title}</CardTitle>
                    <CardDescription>
                      By {blog.author} • {blog.date} • {blog.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {blog.summary}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewBlog(blog)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleApprove(blog.id)}>
                        <Check className="mr-2 h-4 w-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(blog.id)}
                      >
                        <X className="mr-2 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No pending blogs match your search criteria.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <div className="space-y-4">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <Card key={blog.id}>
                  <CardHeader>
                    <CardTitle>{blog.title}</CardTitle>
                    <CardDescription>
                      By {blog.author} • {blog.date} • {blog.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {blog.summary}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewBlog(blog)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(blog.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No approved blogs match your search criteria.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <div className="space-y-4">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <Card key={blog.id}>
                  <CardHeader>
                    <CardTitle>{blog.title}</CardTitle>
                    <CardDescription>
                      By {blog.author} • {blog.date} • {blog.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {blog.summary}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewBlog(blog)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleApprove(blog.id)}>
                        <Check className="mr-2 h-4 w-4" /> Reconsider
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(blog.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No rejected blogs match your search criteria.
              </p>
            )}
          </div>
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
                  By {selectedBlog.author} • {selectedBlog.date} •{" "}
                  {selectedBlog.category}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Summary</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedBlog.summary}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium">Content</h3>
                    <div className="prose dark:prose-invert mt-2">
                      <p>
                        This would contain the full blog content. For this
                        example, we're using placeholder text.
                      </p>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Nullam euismod, nisl eget fermentum aliquam, nisl nisl
                        aliquam nisl, eget aliquam nisl nisl eget. Nullam
                        euismod, nisl eget fermentum aliquam, nisl nisl aliquam
                        nisl, eget aliquam nisl nisl eget.
                      </p>
                      <h4>Section 1</h4>
                      <p>
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                      </p>
                      <h4>Section 2</h4>
                      <p>
                        Duis aute irure dolor in reprehenderit in voluptate
                        velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                {selectedBlog.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedBlog.id)}
                    >
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button onClick={() => handleApprove(selectedBlog.id)}>
                      <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                  </>
                )}
                {selectedBlog.status !== "pending" && (
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
