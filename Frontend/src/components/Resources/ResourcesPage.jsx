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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ResourcesPage = () => {
  // State for Resources
  const [resourceSearchQuery, setResourceSearchQuery] = useState("");

  // State for Blogs
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [category, setCategory] = useState("all");

  // Mock data for resources
  const resources = [
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

  // Mock data for blogs
  const blogs = [
    {
      id: 1,
      title: "How I Solved the Knapsack Problem: A Step-by-Step Guide",
      excerpt:
        "A detailed explanation of the Knapsack Problem, its variations, and my approach to solving it efficiently...",
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
      excerpt:
        "Sharing my three-year journey to qualify for the ICPC World Finals, including practice strategies and contest experiences...",
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
      excerpt:
        "An in-depth look at essential graph algorithms, with implementation examples and problem-solving techniques...",
      author: {
        name: "Karim Hassan",
        avatar: "",
        initials: "KH",
      },
      date: "May 5, 2024",
      readTime: "10 min read",
      categories: ["Algorithms", "Graphs"],
      slug: "graph-algorithms",
    },
    {
      id: 4,
      title: "Common Mistakes in Programming Contests and How to Avoid Them",
      excerpt:
        "Learn from the mistakes I've made and observed in various programming contests to improve your performance...",
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

  // Extract unique categories for blogs
  const categories = [
    "all",
    ...new Set(blogs.flatMap((blog) => blog.categories)),
  ];

  // Filter resources based on search query
  const filteredResources = resources.filter(
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

  // Filter blogs based on search query and category
  const filteredBlogs = blogs.filter(
    (blog) =>
      (blog.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(blogSearchQuery.toLowerCase())) &&
      (category === "all" || blog.categories.includes(category))
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
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Blogs Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">
                    <Link
                      to={`/resources/blogs/${blog.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {blog.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {blog.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    {blog.categories.map((cat) => (
                      <Badge key={cat} variant="outline">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="border-t bg-muted/40 px-6 py-4">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={blog.author.avatar}
                          alt={blog.author.name}
                        />
                        <AvatarFallback>{blog.author.initials}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">
                        {blog.author.name}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" /> {blog.date}
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" /> {blog.readTime}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourcesPage;
