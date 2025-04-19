// src/components/Resources/ResourceDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resourceApi } from "@/services/api";
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
import {
  ArrowLeft,
  Loader2,
  FileDown,
  ExternalLink,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await resourceApi.getById(id);
        if (response.data && response.data.resource) {
          setResource(response.data.resource);
        } else {
          setError("Resource not found");
        }
      } catch (err) {
        console.error("Error fetching resource:", err);
        setError(
          err.response?.status === 404
            ? "Resource not found"
            : "Failed to load resource. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchResource();
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading resource...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">{error}</h2>
          <p className="text-muted-foreground mb-8">
            The resource you're looking for might have been removed or is
            temporarily unavailable.
          </p>
          <Button onClick={() => navigate("/resources")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resources
          </Button>
        </div>
      </div>
    );
  }

  if (!resource) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb navigation */}
      <div className="text-sm breadcrumbs mb-6">
        <ul className="flex flex-wrap items-center space-x-2">
          <li>
            <Link
              to="/resources"
              className="text-muted-foreground hover:text-foreground"
            >
              Resources
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <span className="truncate max-w-[200px] sm:max-w-xs">
              {resource.title}
            </span>
          </li>
        </ul>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-none">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline">{resource.level}</Badge>
              <Badge variant="secondary">{resource.category}</Badge>
              {resource.tags &&
                resource.tags.length > 0 &&
                resource.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold">
              {resource.title}
            </CardTitle>
            <CardDescription className="text-sm mt-4 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(resource.updatedAt || resource.createdAt)}
              {resource.updatedAt !== resource.createdAt && (
                <span className="ml-2 text-xs">(Updated)</span>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Author info */}
            <div className="flex items-center gap-3 mb-8 py-4 border-y">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={resource.author?.avatar || ""}
                  alt={resource.author?.name || "Author"}
                />
                <AvatarFallback>
                  {getAuthorInitials(resource.author?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {resource.author?.name || "MDPC Team"}
                </p>
                <p className="text-sm text-muted-foreground">Contributor</p>
              </div>
            </div>

            {/* Resource content */}
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: resource.content }}
            />

            {/* External resources section */}
            {resource.externalLinks && resource.externalLinks.length > 0 && (
              <div className="mt-10 p-6 bg-muted/50 rounded-lg">
                <h3 className="text-xl font-bold mb-4">External Resources</h3>
                <ul className="space-y-3">
                  {resource.externalLinks.map((link, idx) => (
                    <li key={idx} className="flex items-start">
                      <ExternalLink className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-primary" />
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        {link.title}{" "}
                        <span className="text-muted-foreground text-sm">
                          {link.url}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-t mt-8 pt-6">
            <Button variant="outline" onClick={() => navigate("/resources")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resources
            </Button>

            {/* Download file button if available */}
            {resource.file && (
              <a
                href={`${import.meta.env.VITE_API_URL}${resource.file}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="default" className="w-full">
                  <FileDown className="h-4 w-4 mr-2" />
                  Download Material
                </Button>
              </a>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
