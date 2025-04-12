import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import {
  Bold,
  Italic,
  Code,
  Link2,
  PenTool,
  ThumbsUp,
  MessageSquare,
  Eye,
} from "lucide-react";
import { draftBlogs, publishedBlogs } from "../utils/ratingUtils";

const BlogsSection = () => {
  // Move all state to the top level of the component
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [activeBlogTab, setActiveBlogTab] = useState("write");

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
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="pt-2">
        {/* Write blog tab */}
        {activeBlogTab === "write" && (
          <Card>
            <CardHeader>
              <CardTitle>Write New Blog</CardTitle>
              <CardDescription>
                Share your competitive programming insights and experiences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Blog Title</label>
                <Input
                  placeholder="Enter a descriptive title"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Content</label>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  placeholder="Write your blog content here..."
                  className="min-h-[300px]"
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Input placeholder="e.g., dynamic-programming, graphs, algorithms" />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Save as Draft</Button>
              <Button disabled={!blogTitle || !blogContent}>
                Publish Blog
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Drafts tab */}
        {activeBlogTab === "drafts" && (
          <Card>
            <CardHeader>
              <CardTitle>Draft Blogs</CardTitle>
              <CardDescription>
                Continue working on your unfinished blogs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {draftBlogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You don't have any draft blogs yet. Start writing!
                </div>
              ) : (
                <div className="space-y-4">
                  {draftBlogs.map((blog) => (
                    <Card key={blog.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{blog.title}</CardTitle>
                        <CardDescription>
                          Last edited: {blog.lastEdited}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {blog.excerpt}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button size="sm">Publish</Button>
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
              {publishedBlogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You haven't published any blogs yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {publishedBlogs.map((blog) => (
                    <Card key={blog.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{blog.title}</CardTitle>
                        <CardDescription>
                          Published: {blog.publishDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" /> {blog.views} views
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" /> {blog.likes}{" "}
                            likes
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />{" "}
                            {blog.comments} comments
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/blogs/${blog.id}`}>View</Link>
                        </Button>
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
