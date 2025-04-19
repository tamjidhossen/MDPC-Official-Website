// src/components/Blogs/BlogDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { blogApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, ArrowLeft, Loader2, Share2 } from "lucide-react";
import { format } from "date-fns";

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await blogApi.getById(id);
        if (response.data && response.data.blog) {
          setBlog(response.data.blog);
        } else {
          setError("Blog not found");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(
          err.response?.status === 404
            ? "Blog not found"
            : "Failed to load blog. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Generate author initials from name
  const getAuthorInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return "Recent";
    }
  };

  // Calculate estimated read time based on content length
  const calculateReadTime = (content) => {
    if (!content) return "2 min read";
    // Average reading speed: 200 words per minute
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    return `${readTime} min read`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">{error}</h2>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for might have been removed or is
            temporarily unavailable.
          </p>
          <Button onClick={() => navigate("/resources")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resources
          </Button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            navigate("/resources", { state: { activeTab: "blogs" } })
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resources
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-none">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{blog.category}</Badge>
              {blog.tags &&
                blog.tags.length > 0 &&
                blog.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold">
              {blog.title}
            </CardTitle>
            <CardDescription className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(blog.publishedDate || blog.createdAt)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {calculateReadTime(blog.content)}
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-8 py-4 border-y">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={blog.author?.avatar || ""}
                  alt={blog.author?.name}
                />
                <AvatarFallback>
                  {getAuthorInitials(blog.author?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {blog.author?.name || "Anonymous"}
                </p>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>
            </div>

            {/* Blog image if available */}
            {blog.image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_API_URL}${blog.image}`}
                  alt={blog.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Blog content */}
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </CardContent>

          <CardFooter className="flex justify-between items-center border-t mt-8 pt-6">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate("/resources", { state: { activeTab: "blogs" } })
                }
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resources
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
            >
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetailPage;
