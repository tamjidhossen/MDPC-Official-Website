// src/components/Blogs/BlogsPage.jsx
import { useState } from "react";
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
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";

const BlogsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  // Mock data for blogs
  const blogs = [
    {
      id: 1,
      title: "How I Solved the Knapsack Problem: A Step-by-Step Guide",
      excerpt: "A detailed explanation of the Knapsack Problem, its variations, and my approach to solving it efficiently...",
      author: {
        name: "Tamim Ahmed",
        avatar: "https://github.com/shadcn.png",
        initials: "TA",
      },
      date: "May 15, 2024",
      readTime: "8 min read",
      categories: ["Algorithms", "Dynamic Programming"],
      slug: "knapsack-problem-guide",
    },
    {
      id: 2,
      title: "My Journey to ICPC World Finals: Tips and Insights",
      excerpt: "Sharing my three-year journey to qualify for the ICPC World Finals, including practice strategies and contest experiences...",
      author: {
        name: "Sarah Rahman",
        avatar: "",
        initials: "SR",
      },
      date: "May 10, 2024",
      readTime: "12 min read",
      categories: ["Experience", "Competitive Programming"],
      slug: "journey-to-icpc",
    },
    {
      id: 3,
      title: "Understanding Graph Algorithms in Competitive Programming",
      excerpt: "A comprehensive guide to essential graph algorithms used in competitive programming, with problem examples...",
      author: {
        name: "Karim Hassan",
        avatar: "",
        initials: "KH",
      },
      date: "May 5, 2024",
      readTime: "10 min read",
      categories: ["Algorithms", "Graphs"],
      slug: "graph-algorithms-guide",
    },
    {
      id: 4,
      title: "Optimizing Your Competitive Programming Workflow",
      excerpt: "Tips and tricks for setting up your development environment and improving your workflow during contests...",
      author: {
        name: "Nafisa Khan",
        avatar: "",
        initials: "NK",
      },
      date: "April 28, 2024",
      readTime: "6 min read",
      categories: ["Tips", "Productivity"],
      slug: "optimizing-workflow",
    },
    {
      id: 5,
      title: "Common Mistakes to Avoid in Programming Contests",
      excerpt: "Learn from the mistakes I've made and observed in various programming contests to improve your performance...",
      author: {
        name: "Rahim Uddin",
        avatar: "",
        initials: "RU",
      },
      date: "April 22, 2024",
      readTime: "7 min read",
      categories: ["Tips", "Contest Strategy"],
      slug: "common-mistakes",
    },
  ];

  // Extract unique categories
  const categories = ["all", ...new Set(blogs.flatMap(blog => blog.categories))];

  // Filter blogs based on search query and category
  const filteredBlogs = blogs.filter(
    (blog) =>
      (blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (category === "all" || blog.categories.includes(category))
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Blogs</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Insights, tutorials and experiences from our community of competitive programmers
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
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="flex flex-col">
            <CardHeader>
              <div className="flex flex-wrap gap-1 mb-2">
                {blog.categories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-xs">
                    {cat}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-xl">{blog.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground mb-4">
                {blog.excerpt}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{blog.date}</span>
                <Clock className="h-3 w-3 ml-2" />
                <span>{blog.readTime}</span>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                  <AvatarFallback>{blog.author.initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{blog.author.name}</span>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to={`/blogs/${blog.slug}`}>
                  Read more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Write for Us Section */}
      <div className="mt-16 rounded-xl bg-primary/5 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Share Your Knowledge</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Have insights about competitive programming or want to share your experiences?
          We welcome blog contributions from our community members!
        </p>
        <Button asChild>
          <Link to="/blogs/write">
            Write for Us
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BlogsPage;