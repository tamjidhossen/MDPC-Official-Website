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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { blogApi, resourceApi } from "@/services/api";
import { format } from "date-fns";

const ResourcesPage = () => {
  // State for Resources
  const [resourceSearchQuery, setResourceSearchQuery] = useState("");
  const [resources, setResources] = useState([]);

  // State for Blogs
  const [blogs, setBlogs] = useState([]);
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState(["all"]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
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
          search: blogSearchQuery || undefined,
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
  }, [blogSearchQuery, category, pagination.page, pagination.limit]);

  // Calculate estimated read time based on content length
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

  // Mock data for resources
  const mockResources = [
    {
      id: 1,
      title: "Getting Started with CP",
      description:
        "A comprehensive guide for beginners in competitive programming",
      level: "Beginner",
      tags: ["Guide", "Introduction"],
      link: "/resources/getting-started",
    },
    {
      id: 2,
      title: "Data Structures Fundamentals",
      description:
        "Essential data structures every competitive programmer should know",
      level: "Beginner",
      tags: ["Data Structures", "Fundamentals"],
      link: "/resources/data-structures",
    },
    {
      id: 3,
      title: "Algorithm Analysis",
      description:
        "Learn how to analyze time and space complexity of algorithms",
      level: "Beginner",
      tags: ["Algorithms", "Analysis"],
      link: "/resources/algorithm-analysis",
    },
    {
      id: 4,
      title: "Dynamic Programming",
      description:
        "Master the art of solving problems using dynamic programming",
      level: "Intermediate",
      tags: ["Algorithms", "DP"],
      link: "/resources/dynamic-programming",
    },
    {
      id: 5,
      title: "Competitive Programming Roadmap",
      description:
        "A structured roadmap for your CP journey from beginner to expert",
      level: "All Levels",
      tags: ["Guide", "Roadmap"],
      link: "/resources/cp-roadmap",
    },
    {
      id: 6,
      title: "String Algorithms",
      description: "Comprehensive guide on string algorithms and techniques",
      level: "Intermediate",
      tags: ["Algorithms", "Strings"],
      link: "/resources/string-algorithms",
    },
  ];

  // Filter resources based on search query
  const filteredResources = mockResources.filter(
    (resource) =>
      resource.title
        .toLowerCase()
        .includes(resourceSearchQuery.toLowerCase()) ||
      resource.description
        .toLowerCase()
        .includes(resourceSearchQuery.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(resourceSearchQuery.toLowerCase())
      )
  );

  // FAQs about resources
  const faqs = [
    {
      question: "How do I get started with competitive programming?",
      answer:
        "We recommend starting with our 'Getting Started with CP' guide which covers all the basics and provides a structured learning path for beginners.",
    },
    {
      question:
        "Which programming language is best for competitive programming?",
      answer:
        "C++, Java, and Python are the most commonly used languages. C++ is often preferred due to its speed and extensive STL library. However, use the language you're most comfortable with when starting out.",
    },
    {
      question: "How often are resources updated?",
      answer:
        "We update our resources regularly to keep up with the latest techniques and problem-solving approaches. Each resource page shows its last updated date.",
    },
    {
      question: "Can I contribute to the resources?",
      answer:
        "Yes! We welcome contributions from the community. If you have valuable insights or material to share, please contact us through the 'Contact' page.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Resources & Blogs
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Curated learning materials and insights from our community to help you
          enhance your competitive programming skills
        </p>
      </div>

      <Tabs defaultValue="resources" className="mb-10">
        <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
          <TabsTrigger value="resources">Learning Resources</TabsTrigger>
          <TabsTrigger value="blogs">Community Blogs</TabsTrigger>
        </TabsList>

        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-6">
          {/* Search Bar for Resources */}
          <div className="flex w-full max-w-sm items-center space-x-2 mb-10 mx-auto">
            <Input
              type="text"
              placeholder="Search resources..."
              value={resourceSearchQuery}
              onChange={(e) => setResourceSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Resources Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{resource.level}</Badge>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {resource.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto pt-4">
                  <Link to={resource.link} className="w-full">
                    <Button className="w-full">
                      <span>View Resource</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Blogs Tab */}
        <TabsContent value="blogs" className="mt-6">
          {/* Search and Filter for Blogs */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
            <div className="flex w-full md:w-auto items-center space-x-2">
              <Input
                type="text"
                placeholder="Search blogs..."
                value={blogSearchQuery}
                onChange={(e) => setBlogSearchQuery(e.target.value)}
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
                  className="capitalize"
                >
                  {cat === "all" ? "All" : cat}
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
            <div className="text-center py-20">
              <p className="text-destructive">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setBlogSearchQuery("");
                  setCategory("all");
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && blogs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                No blogs found matching your criteria.
              </p>
              {(blogSearchQuery || category !== "all") && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setBlogSearchQuery("");
                    setCategory("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Blogs Grid */}
          {!isLoading && !error && blogs.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2">
              {blogs.map((blog) => (
                <Card key={blog._id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xl mb-2">
                      <Link
                        to={`/resources/blog/${blog._id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {blog.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {getExcerpt(blog.content)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary">{blog.category}</Badge>
                      {blog.tags &&
                        blog.tags.length > 0 &&
                        blog.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </CardContent>

                  <CardFooter className="border-t bg-muted/40 px-6 py-4">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={blog.author?.avatar || ""}
                            alt={blog.author?.name || "Author"}
                          />
                          <AvatarFallback>
                            {getAuthorInitials(blog.author?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-medium">
                          {blog.author?.name || "Anonymous"}
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(blog.publishedDate || blog.createdAt)}
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        {calculateReadTime(blog.content)}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <div className="join">
                <Button
                  variant="outline"
                  size="sm"
                  className="join-item"
                  disabled={pagination.page === 1}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                >
                  Previous
                </Button>
                <span className="join-item px-4 flex items-center bg-muted">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="join-item"
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourcesPage;
