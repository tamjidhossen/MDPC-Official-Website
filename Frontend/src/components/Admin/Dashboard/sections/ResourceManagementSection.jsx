import { useState, useEffect, useCallback } from "react";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  X,
  Eye,
  Edit,
  Trash,
  Search,
  Loader2,
  Link,
  Plus,
  FileUp,
  ExternalLink,
} from "lucide-react";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const ResourceManagementSection = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // Changed default tab to "all"
  const [resources, setResources] = useState({
    all: [],
    beginner: [],
    intermediate: [],
    advanced: [],
  });
  const [loading, setLoading] = useState({
    fetching: false,
    action: null,
    creating: false,
  });
  const [error, setError] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Form state for creating/editing resources
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    level: "beginner",
    tags: "",
    content: "",
    externalLinks: [{ title: "", url: "" }],
    file: null,
  });

  const fetchAllResources = useCallback(async () => {
    setLoading((prev) => ({ ...prev, fetching: true }));
    setError(null);
    try {
      const response = await api.get(`/resources?limit=100`);

      // Get all resources
      const allResources = response.data.data.resources || [];

      // Categorize resources by level
      const categorizedResources = {
        all: allResources,
        beginner: allResources.filter(
          (resource) => resource.level === "beginner"
        ),
        intermediate: allResources.filter(
          (resource) => resource.level === "intermediate"
        ),
        advanced: allResources.filter(
          (resource) => resource.level === "advanced"
        ),
      };

      setResources(categorizedResources);
    } catch (err) {
      console.error(`Error fetching resources:`, err);
      setError(`Failed to fetch resources. Please try again.`);
      toast({
        title: "Error",
        description: `Failed to fetch resources.`,
        variant: "destructive",
      });
      setResources({ all: [], beginner: [], intermediate: [], advanced: [] });
    } finally {
      setLoading((prev) => ({ ...prev, fetching: false }));
    }
  }, [toast]);

  useEffect(() => {
    fetchAllResources();
  }, [fetchAllResources]);

  const deleteResourceHandler = async (resourceId) => {
    setLoading((prev) => ({ ...prev, action: resourceId }));
    try {
      await api.delete(`/resources/${resourceId}`);
      toast({
        title: "Success",
        description: "Resource deleted successfully.",
      });
      fetchAllResources(); // Refetch all resources data
      if (viewDialogOpen) setViewDialogOpen(false);
    } catch (err) {
      console.error("Error deleting resource:", err);
      toast({
        title: "Error",
        description: "Failed to delete resource.",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, action: null }));
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchTerm("");
    setError(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewResource = (resource) => {
    setSelectedResource(resource);
    setViewDialogOpen(true);
  };

  const handleEditResource = (resource) => {
    // Pre-fill form with selected resource data
    setFormData({
      title: resource.title,
      category: resource.category,
      level: resource.level,
      tags: resource.tags ? resource.tags.join(", ") : "",
      content: resource.content,
      externalLinks:
        resource.externalLinks && resource.externalLinks.length > 0
          ? resource.externalLinks
          : [{ title: "", url: "" }],
      file: null,
    });
    setSelectedResource(resource); // Set for update operation
    document
      .getElementById("create-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select input changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  // Handle external link changes
  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.externalLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData((prev) => ({ ...prev, externalLinks: updatedLinks }));
  };

  // Add new external link field
  const addLinkField = () => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: [...prev.externalLinks, { title: "", url: "" }],
    }));
  };

  // Remove external link field
  const removeLinkField = (index) => {
    const updatedLinks = [...formData.externalLinks];
    updatedLinks.splice(index, 1);
    setFormData((prev) => ({ ...prev, externalLinks: updatedLinks }));
  };

  // Submit form to create/update resource
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, creating: true }));

    try {
      // Create FormData object for file upload
      const resourceFormData = new FormData();
      resourceFormData.append("title", formData.title);
      resourceFormData.append("category", formData.category);
      resourceFormData.append("level", formData.level);

      // Handle tags (convert comma-separated string to array)
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      // Append tags individually to FormData instead of as a string
      if (tagsArray.length > 0) {
        tagsArray.forEach((tag) => resourceFormData.append("tags[]", tag));
      }

      resourceFormData.append("content", formData.content);

      // Handle external links - filter valid links and append directly
      const validLinks = formData.externalLinks.filter(
        (link) => link.title && link.url
      );
      if (validLinks.length > 0) {
        // Append externalLinks as a properly serialized JSON string, not double serialized
        resourceFormData.append("externalLinks", JSON.stringify(validLinks));
      }

      if (formData.file) {
        resourceFormData.append("file", formData.file);
      }

      let response;
      if (selectedResource) {
        // Update existing resource
        response = await api.put(
          `/resources/${selectedResource._id}`,
          resourceFormData
        );
        toast({
          title: "Success",
          description: "Resource updated successfully.",
        });
      } else {
        // Create new resource
        response = await api.post("/resources", resourceFormData);
        toast({
          title: "Success",
          description: "Resource created successfully.",
        });
      }

      // Reset form after successful submission
      resetForm();
      fetchAllResources(); // Refetch resources to update the list
    } catch (err) {
      console.error("Error saving resource:", err);
      toast({
        title: "Error",
        description: `Failed to ${
          selectedResource ? "update" : "create"
        } resource: ${err.response?.data?.message || err.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, creating: false }));
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      level: "beginner",
      tags: "",
      content: "",
      externalLinks: [{ title: "", url: "" }],
      file: null,
    });
    setSelectedResource(null);
    // Reset file input
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.value = "";
  };

  const filteredResources = resources[activeTab].filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.author?.name &&
        resource.author.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getLevelBadge = (level) => {
    switch (level) {
      case "beginner":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          >
            {level}
          </Badge>
        );
      case "intermediate":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            {level}
          </Badge>
        );
      case "advanced":
        return (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          >
            {level}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  const renderResourceCard = (resource) => {
    const isActionLoading = loading.action === resource._id;
    const formattedDate = resource.createdAt
      ? format(new Date(resource.createdAt), "PPP")
      : "N/A";
    const authorName = resource.author?.name || "Unknown Author";

    return (
      <Card key={resource._id}>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>{resource.title}</CardTitle>
              <CardDescription>
                By {authorName} • {formattedDate} • {resource.category}
              </CardDescription>
            </div>
            {getLevelBadge(resource.level)}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {resource.content || "No content preview available"}
          </p>
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewResource(resource)}
              disabled={isActionLoading}
            >
              <Eye className="mr-2 h-4 w-4" /> View
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEditResource(resource)}
              disabled={isActionLoading}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteResourceHandler(resource._id)}
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}{" "}
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const renderTabContent = (filter) => {
    if (loading.fetching && resources[filter].length === 0) {
      return (
        <div className="text-center py-8">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (error && resources[filter].length === 0) {
      return <p className="text-center py-8 text-destructive">{error}</p>;
    }
    if (!loading.fetching && filteredResources.length === 0) {
      return (
        <p className="text-center py-8 text-muted-foreground">
          No resources {searchTerm ? "match your search criteria" : "found"}.
        </p>
      );
    }
    return (
      <div className="space-y-4">
        {filteredResources.map(renderResourceCard)}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Resource Management
        </h2>
        <p className="text-muted-foreground">
          Create, update, and manage educational resources.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, category, or author..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
          disabled={loading.fetching}
        />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all" disabled={loading.fetching}>
            All Resources{" "}
            {!loading.fetching && (
              <Badge className="ml-2">{resources.all.length}</Badge>
            )}
          </TabsTrigger>
          {/* <TabsTrigger value="beginner" disabled={loading.fetching}>
            Beginner{" "}
            {!loading.fetching && (
              <Badge className="ml-2">{resources.beginner.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="intermediate" disabled={loading.fetching}>
            Intermediate{" "}
            {!loading.fetching && (
              <Badge className="ml-2">{resources.intermediate.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="advanced" disabled={loading.fetching}>
            Advanced{" "}
            {!loading.fetching && (
              <Badge className="ml-2">{resources.advanced.length}</Badge>
            )}
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderTabContent("all")}
        </TabsContent>

        {/* <TabsContent value="beginner" className="mt-6">
          {renderTabContent("beginner")}
        </TabsContent>

        <TabsContent value="intermediate" className="mt-6">
          {renderTabContent("intermediate")}
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          {renderTabContent("advanced")}
        </TabsContent> */}
      </Tabs>

      {/* Create/Edit Resource Section */}
      <div id="create-section" className="mt-12 pt-8 border-t">
        <h3 className="text-2xl font-bold tracking-tight mb-6">
          {selectedResource ? "Edit Resource" : "Create New Resource"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Resource title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                placeholder="e.g. DSA, Web Development, Machine Learning"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleSelectChange("level", value)}
                required
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="e.g. python, algorithms, tutorial"
                value={formData.tags}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="file">Resource File (optional)</Label>
              <Input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Upload PDF, DOCX, or other relevant files for this resource
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your resource content here..."
              value={formData.content}
              onChange={handleInputChange}
              rows={10}
              required
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>External Links</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLinkField}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Link
              </Button>
            </div>

            {formData.externalLinks.map((link, index) => (
              <div key={index} className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`link-title-${index}`} className="text-sm">
                    Title
                  </Label>
                  <Input
                    id={`link-title-${index}`}
                    value={link.title}
                    placeholder="e.g. Official Documentation"
                    onChange={(e) =>
                      handleLinkChange(index, "title", e.target.value)
                    }
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`link-url-${index}`} className="text-sm">
                    URL
                  </Label>
                  <Input
                    id={`link-url-${index}`}
                    value={link.url}
                    placeholder="https://example.com"
                    onChange={(e) =>
                      handleLinkChange(index, "url", e.target.value)
                    }
                  />
                </div>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLinkField(index)}
                    className="h-10 w-10 flex-shrink-0"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              disabled={loading.creating}
              className="flex-1 sm:flex-none"
            >
              {loading.creating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {selectedResource ? "Update Resource" : "Create Resource"}
            </Button>
            {selectedResource && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={loading.creating}
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Resource View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
          {selectedResource && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{selectedResource.title}</DialogTitle>
                  {getLevelBadge(selectedResource.level)}
                </div>
                <DialogDescription>
                  By {selectedResource.author?.name || "Unknown"} •{" "}
                  {selectedResource.createdAt
                    ? format(new Date(selectedResource.createdAt), "PPP")
                    : "N/A"}{" "}
                  • {selectedResource.category}
                  {selectedResource.tags &&
                    selectedResource.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {selectedResource.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                </DialogDescription>
              </DialogHeader>
              <Separator className="my-4" />

              <div className="py-4 prose dark:prose-invert max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedResource.content.replace(/\n/g, "<br />"),
                  }}
                />
              </div>

              {selectedResource.externalLinks &&
                selectedResource.externalLinks.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2" /> External Links
                      </h4>
                      <div className="space-y-1">
                        {selectedResource.externalLinks.map((link, index) => (
                          <div key={index} className="flex items-center">
                            <ExternalLink className="h-3 w-3 mr-2 text-muted-foreground" />
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {link.title || link.url}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

              {selectedResource.file && (
                <>
                  <Separator className="my-4" />
                  <div className="flex items-center">
                    <FileUp className="h-4 w-4 mr-2" />
                    <a
                      href={`/api/resources/download/${selectedResource._id}`} // Assuming this endpoint exists
                      download
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Download Attached File
                    </a>
                  </div>
                </>
              )}

              <Separator className="my-4" />
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleEditResource(selectedResource)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteResourceHandler(selectedResource._id)}
                  disabled={loading.action === selectedResource._id}
                >
                  {loading.action === selectedResource._id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="mr-2 h-4 w-4" />
                  )}{" "}
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setViewDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceManagementSection;
