// src/components/Resources/ResourcesPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Code, FileText, Tag } from "lucide-react";

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for resources
  const resources = [
    {
      id: 1,
      title: "Complete CP Roadmap",
      description: "A comprehensive roadmap for competitive programming from beginner to advanced",
      level: "All Levels",
      tags: ["Roadmap", "Guide"],
      link: "/resources/cp-roadmap",
    },
    {
      id: 2,
      title: "Graph Algorithms",
      description: "Learn about traversals, shortest paths, minimum spanning trees and network flows",
      level: "Intermediate",
      tags: ["Algorithms", "Graphs"],
      link: "/resources/graph-algorithms",
    },
    {
      id: 3,
      title: "Dynamic Programming",
      description: "Master DP with step-by-step explanations and practice problems from various online judges",
      level: "Intermediate",
      tags: ["Algorithms", "DP"],
      link: "/resources/dynamic-programming",
    },
    {
      id: 4,
      title: "Getting Started with CP",
      description: "Introduction to competitive programming for absolute beginners",
      level: "Beginner",
      tags: ["Getting Started", "Basics"],
      link: "/resources/getting-started",
    },
    {
      id: 5,
      title: "Data Structures Masterclass",
      description: "Deep dive into advanced data structures used in competitive programming",
      level: "Advanced",
      tags: ["Data Structures"],
      link: "/resources/data-structures",
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
  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // FAQs about resources
  const faqs = [
    {
      question: "How do I get started with competitive programming?",
      answer: "We recommend starting with our 'Getting Started with CP' guide which covers all the basics and provides a structured learning path for beginners."
    },
    {
      question: "Which programming language is best for competitive programming?",
      answer: "C++, Java, and Python are the most commonly used languages. C++ is often preferred due to its speed and extensive STL library. However, use the language you're most comfortable with when starting out."
    },
    {
      question: "How often are resources updated?",
      answer: "We update our resources regularly to keep up with the latest techniques and problem-solving approaches. Each resource page shows its last updated date."
    },
    {
      question: "Can I contribute to the resources?",
      answer: "Yes! We welcome contributions from the community. If you have valuable insights or material to share, please contact us through the 'Contact' page."
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Resources</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Curated learning materials to help you enhance your competitive programming skills
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex w-full max-w-sm items-center space-x-2 mb-10 mx-auto">
        <Input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardTitle>{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-4">
              <Button asChild variant="outline" className="w-full">
                <Link to={resource.link}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Resource
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Topics */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Topics</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline">
            <Tag className="mr-2 h-4 w-4" />
            Dynamic Programming
          </Button>
          <Button variant="outline">
            <Tag className="mr-2 h-4 w-4" />
            Graph Algorithms
          </Button>
          <Button variant="outline">
            <Tag className="mr-2 h-4 w-4" />
            Data Structures
          </Button>
          <Button variant="outline">
            <Tag className="mr-2 h-4 w-4" />
            Math & Number Theory
          </Button>
          <Button variant="outline">
            <Tag className="mr-2 h-4 w-4" />
            String Algorithms
          </Button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contributing Section */}
      <div className="mt-16 rounded-xl bg-primary/5 p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Contribute to Resources</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Have valuable insights or tutorials to share with the competitive programming community? 
          We welcome contributions to our resource library!
        </p>
        <Button asChild>
          <Link to="/contact">
            <FileText className="mr-2 h-4 w-4" />
            Submit a Resource
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ResourcesPage;