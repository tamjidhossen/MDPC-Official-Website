// src/components/Blogs/BlogsPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
import { blogApi } from "@/services/api";
import { format } from "date-fns";

const BlogsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["all"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalBlogs: 0,
    totalPages: 0,
  });

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await blogApi.getAll({
          page: pagination.page,
          limit: pagination.limit,
          status: "approved", // Only fetch approved blogs
          search: searchQuery || undefined,
          category: category !== "all" ? category : undefined,
        });

        if (response.data && response.data.blogs) {
          setBlogs(response.data.blogs);

          if (response.data.pagination) {
            setPagination(response.data.pagination);
          }

          // Extract unique categories from blogs
          if (response.data.blogs.length > 0) {
            const blogCategories = new Set(
              response.data.blogs.map((blog) => blog.category)
            );
            setCategories(["all", ...blogCategories]);
          }
        } else {
          setBlogs([]);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [searchQuery, category, pagination.page, pagination.limit]);

  // Filter blogs based on search query and category
  const filteredBlogs = blogs;

  // Calculate estimated read time based on content length (rough estimate)
  const calculateReadTime = (content) => {
    if (!content) return "2 min read";
    // Average reading speed: 200 words per minute
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    return `${readTime} min read`;
  };

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
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return "Recent";
    }
  };

  // Get excerpt from HTML content
  const getExcerpt = (content, length = 150) => {
    if (!content) return "No content available";
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length > length
      ? `${plainText.substring(0, length)}...`
      : plainText;
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Blogs
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Insights, tutorials and experiences from our community of competitive
          programmers
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div className="flex w-full md:w-auto items-center space-x-2">
          <Input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-60"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
            >
              {cat === "all"
                ? "All"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading blogs...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-20 text-destructive">
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setCategory("all");
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredBlogs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">
            No blogs found matching your criteria.
          </p>
          {(searchQuery || category !== "all") && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setCategory("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Blog List */}
      {!isLoading && !error && filteredBlogs.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <Card key={blog._id} className="flex flex-col">
              <CardHeader>
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {blog.category}
                  </Badge>
                  {blog.tags &&
                    blog.tags.length > 0 &&
                    blog.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                </div>
                <CardTitle className="text-xl">{blog.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">
                  {getExcerpt(blog.content)}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDate(blog.publishedDate || blog.createdAt)}
                  </span>
                  <Clock className="h-3 w-3 ml-2" />
                  <span>{calculateReadTime(blog.content)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={blog.author?.avatar || ""}
                      alt={blog.author?.name || "Author"}
                    />
                    <AvatarFallback>
                      {getAuthorInitials(blog.author?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    {blog.author?.name || "Anonymous"}
                  </span>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to={`/blogs/${blog._id}`}>
                    Read more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <div className="flex items-center gap-2">
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
        </div>
      )}

      {/* Write for Us Section */}
      <div className="mt-16 rounded-xl bg-primary/5 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Share Your Knowledge</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Have insights about competitive programming or want to share your
          experiences? We welcome blog contributions from our community members!
        </p>
        <Button asChild>
          <Link to="/user/dashboard?tab=blogs">Write for Us</Link>
        </Button>
      </div>
    </div>
  );
};

export default BlogsPage;
