import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import "quill/dist/quill.snow.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Plus,
  Edit,
  Trash,
  Eye,
  Upload,
  Link as LinkIcon,
  X,
} from "lucide-react";
import { resourceApi } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Quill toolbar options
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }, { header: 3 }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  ["link", "image"],
  ["clean"],
];

// Custom CSS for Quill editor
const quillStyles = {
  editor: {
    minHeight: "350px", // Increased height
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "0.375rem",
    marginBottom: "1rem",
  },
  container: {
    height: "100%",
  },
};

const RESOURCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const RESOURCE_CATEGORIES = ["Category1", "Category2", "Category3"]; // Define your categories here

const ResourceManagementSection = () => {
  const { toast } = useToast();

  // Quill editor refs
  const quillEditorRef = useRef(null);
  const quillInstance = useRef(null);
  const [quillLoaded, setQuillLoaded] = useState(false);

  // Resource state
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [newResourceData, setNewResourceData] = useState({
    title: "",
    category: "",
    level: "",
    tags: "",
    content: "",
    externalLinks: [{ title: "", url: "" }],
    file: null,
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");

  // Fetch resources
  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await resourceApi.getAll({
        page,
        limit: 10,
        search: searchTerm,
      });
      // Check response.data.success instead of response.success
      if (response.data.success) {
        // Access data nested within response.data.data
        setResources(response.data.data.resources);
        setTotalPages(response.data.data.pagination.totalPages);
      } else {
        toast({
          title: "Error",
          // Use message from the API response if available
          description: response.data.message || "Failed to fetch resources.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch resources. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, toast]);

  // Initialize Quill editor
  useEffect(() => {
    if (
      quillEditorRef.current &&
      !quillInstance.current &&
      (activeTab === "create" || activeTab === "edit")
    ) {
      // Dynamically import Quill
      import("quill")
        .then((Quill) => {
          if (!quillInstance.current && quillEditorRef.current) {
            quillInstance.current = new Quill.default(quillEditorRef.current, {
              modules: {
                toolbar: toolbarOptions,
              },
              theme: "snow",
            });

            // Set initial content if available
            const content =
              activeTab === "edit" && selectedResource
                ? selectedResource.content
                : newResourceData.content;

            if (content) {
              quillInstance.current.root.innerHTML = content;
            }

            // Handle content changes
            quillInstance.current.on("text-change", () => {
              const htmlContent = quillInstance.current.root.innerHTML;

              if (activeTab === "edit" && selectedResource) {
                setSelectedResource((prev) => ({
                  ...prev,
                  content: htmlContent,
                }));
              } else {
                setNewResourceData((prev) => ({
                  ...prev,
                  content: htmlContent,
                }));
              }
            });

            setQuillLoaded(true);
          }
        })
        .catch((err) => {
          console.error("Error loading Quill:", err);
          toast({
            title: "Editor Error",
            description:
              "Failed to load the rich text editor. Please refresh the page.",
            variant: "destructive",
          });
        });
    }

    return () => {
      // Clean up quill instance when component unmounts or tab changes
      if (quillInstance.current) {
        const htmlContent = quillInstance.current.root.innerHTML;

        if (activeTab === "edit" && selectedResource) {
          setSelectedResource((prev) => ({
            ...prev,
            content: htmlContent,
          }));
        } else {
          setNewResourceData((prev) => ({
            ...prev,
            content: htmlContent,
          }));
        }

        // Destroy the instance
        quillInstance.current = null;
        setQuillLoaded(false);
      }
    };
  }, [activeTab, selectedResource]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // --- Handlers for Form Inputs ---
  const handleInputChange = (e, index, fieldType) => {
    const { name, value, files } = e.target;
    const targetState =
      activeTab === "edit" ? selectedResource : newResourceData;
    const targetSetter =
      activeTab === "edit" ? setSelectedResource : setNewResourceData;

    if (fieldType === "externalLinks") {
      const updatedLinks = [...targetState.externalLinks];
      updatedLinks[index][name] = value;
      targetSetter({ ...targetState, externalLinks: updatedLinks });
    } else if (name === "file") {
      targetSetter({ ...targetState, file: files[0] });
    } else {
      targetSetter({ ...targetState, [name]: value });
    }
  };

  const addExternalLink = () => {
    const targetState =
      activeTab === "edit" ? selectedResource : newResourceData;
    const targetSetter =
      activeTab === "edit" ? setSelectedResource : setNewResourceData;
    targetSetter({
      ...targetState,
      externalLinks: [...targetState.externalLinks, { title: "", url: "" }],
    });
  };

  const removeExternalLink = (index) => {
    const targetState =
      activeTab === "edit" ? selectedResource : newResourceData;
    const targetSetter =
      activeTab === "edit" ? setSelectedResource : setNewResourceData;
    const updatedLinks = targetState.externalLinks.filter(
      (_, i) => i !== index
    );
    // Ensure at least one link input remains if it's the last one
    if (updatedLinks.length === 0) {
      targetSetter({ ...targetState, externalLinks: [{ title: "", url: "" }] });
    } else {
      targetSetter({ ...targetState, externalLinks: updatedLinks });
    }
  };

  // --- Handlers for API Actions ---
  const handleCreateResource = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", newResourceData.title);
    formData.append("category", newResourceData.category);
    formData.append("level", newResourceData.level.toLowerCase()); // Send lowercase
    formData.append("content", newResourceData.content);

    // Handle tags - split string into array
    if (newResourceData.tags) {
      const tagsArray = newResourceData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      formData.append("tags", JSON.stringify(tagsArray)); // Send as JSON string
    }

    // Handle external links - filter empty and stringify
    const validLinks = newResourceData.externalLinks.filter(
      (link) => link.title && link.url
    );
    if (validLinks.length > 0) {
      formData.append("externalLinks", JSON.stringify(validLinks)); // Send as JSON string
    }

    if (newResourceData.file) {
      formData.append("file", newResourceData.file);
    }

    try {
      // Correct the function call from createResource to create
      const response = await resourceApi.create(formData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Resource created successfully.",
        });
        setActiveTab("list");
        fetchResources(); // Refresh list
      } else {
        throw new Error(response.message || "Failed to create resource.");
      }
    } catch (error) {
      console.error("Error creating resource:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create resource. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateResource = async (e) => {
    e.preventDefault();
    if (!selectedResource) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", selectedResource.title);
    formData.append("category", selectedResource.category);
    formData.append("level", selectedResource.level.toLowerCase()); // Send lowercase
    formData.append("content", selectedResource.content);

    // Handle tags
    if (selectedResource.tags) {
      const tagsArray = selectedResource.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      formData.append("tags", JSON.stringify(tagsArray));
    }

    // Handle external links
    const validLinks = selectedResource.externalLinks.filter(
      (link) => link.title && link.url
    );
    if (validLinks.length > 0) {
      formData.append("externalLinks", JSON.stringify(validLinks));
    }

    if (selectedResource.file) {
      formData.append("file", selectedResource.file);
    }

    try {
      // Correct the function call from updateResource to update
      const response = await resourceApi.update(selectedResource._id, formData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Resource updated successfully.",
        });
        setActiveTab("list");
        fetchResources(); // Refresh list
      } else {
        throw new Error(response.message || "Failed to update resource.");
      }
    } catch (error) {
      console.error("Error updating resource:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update resource. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResource = async () => {
    if (!selectedResource) return;
    setIsSubmitting(true);
    try {
      // Correct the function call from deleteResource to delete
      const response = await resourceApi.delete(selectedResource._id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Resource deleted successfully.",
        });
        setActiveTab("list");
        fetchResources(); // Refresh list
      } else {
        throw new Error(response.message || "Failed to delete resource.");
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete resource. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Functions ---
  const renderExternalLinksInputs = (data, setter) => {
    return data.externalLinks.map((link, index) => (
      <div key={index} className="flex items-center gap-2 mb-2">
        <Input
          name="title"
          placeholder="Link Title"
          value={link.title}
          onChange={(e) => handleInputChange(e, index, "externalLinks")}
          className="flex-1"
        />
        <Input
          name="url"
          type="url"
          placeholder="Link URL (https://...)"
          value={link.url}
          onChange={(e) => handleInputChange(e, index, "externalLinks")}
          className="flex-1"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => removeExternalLink(index)}
          disabled={data.externalLinks.length <= 1 && !link.title && !link.url} // Disable remove if it's the only empty link
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    ));
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Resource Management
          </h2>
          <p className="text-muted-foreground">
            Manage learning resources for club members.
          </p>
        </div>
        <Button onClick={() => setActiveTab("create")}>
          <Plus className="mr-2 h-4 w-4" /> Add Resource
        </Button>
      </div>

      {/* Search Input */}
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search resources by title, content, or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="list" className="flex-1">
            Resource List
          </TabsTrigger>
          <TabsTrigger value="create" className="flex-1">
            Create Resource
          </TabsTrigger>
          {selectedResource && (
            <TabsTrigger value="edit" className="flex-1">
              Edit Resource
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list" className="mt-6">
          {/* Resources Table */}
          <Card className="border-0 shadow-none">
            <CardHeader>
              <CardTitle>All Resources</CardTitle>
              <CardDescription>
                View, edit, or delete existing resources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : resources.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No resources found {searchTerm ? "matching your search" : ""}.
                </p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resources.map((resource) => (
                        <TableRow key={resource._id}>
                          <TableCell className="font-medium">
                            {resource.title}
                          </TableCell>
                          <TableCell>{resource.category}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{resource.level}</Badge>
                          </TableCell>
                          <TableCell>
                            {resource.author?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            {new Date(resource.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedResource(resource);
                                setActiveTab("edit");
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setSelectedResource(resource);
                                handleDeleteResource();
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            {/* Pagination Controls (Optional) */}
            {totalPages > 1 && (
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="create">
          {/* Create Resource Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Resource</CardTitle>
              <CardDescription>
                Share valuable learning material with MDPC members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-title">Resource Title</Label>
                <Input
                  id="create-title"
                  name="title"
                  placeholder="Enter a descriptive title"
                  value={newResourceData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-category">Category</Label>
                  <select
                    id="create-category"
                    name="category"
                    value={newResourceData.category}
                    onChange={handleInputChange}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {RESOURCE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-level">Difficulty Level</Label>
                  <select
                    id="create-level"
                    name="level"
                    value={newResourceData.level}
                    onChange={handleInputChange}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="" disabled>Select a level</option>
                    {RESOURCE_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <div className="min-h-[350px]">
                  {/* Quill editor container */}
                  <div ref={quillEditorRef} className="h-[350px]" />
                  {!quillLoaded && activeTab === "create" && (
                    <div className="flex justify-center items-center h-[350px] border rounded-md bg-muted/20">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-tags">Tags</Label>
                <Input
                  id="create-tags"
                  name="tags"
                  placeholder="e.g., algorithms, graph-theory, dynamic-programming"
                  value={newResourceData.tags}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="mb-1 block">External Links</Label>
                <div className="space-y-2 mb-2">
                  {renderExternalLinksInputs(newResourceData, setNewResourceData)}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExternalLink}
                  >
                    Add Link
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="create-file">File Attachment (Optional)</Label>
                <Input
                  id="create-file"
                  name="file"
                  type="file"
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="ghost"
                onClick={() => setActiveTab("list")}
              >
                Cancel
              </Button>
              <Button
                disabled={isSubmitting || !newResourceData.title || !newResourceData.content || !newResourceData.category || !newResourceData.level || !quillLoaded}
                onClick={handleCreateResource}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Create Resource
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          {/* Edit Resource Form */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Resource</CardTitle>
              <CardDescription>
                Update the details for "{selectedResource?.title}".
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedResource && (
                <form onSubmit={handleUpdateResource}>
                  <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    {/* Title */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-title" className="text-right">
                        Title
                      </Label>
                      <Input
                        id="edit-title"
                        name="title"
                        value={selectedResource.title}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    {/* Category */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-category" className="text-right">
                        Category
                      </Label>
                      <select
                        id="edit-category"
                        name="category"
                        value={selectedResource.category}
                        onChange={handleInputChange}
                        className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        {RESOURCE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Level */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-level" className="text-right">
                        Level
                      </Label>
                      <select
                        id="edit-level"
                        name="level"
                        value={selectedResource.level}
                        onChange={handleInputChange}
                        className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="" disabled>
                          Select a level
                        </option>
                        {RESOURCE_LEVELS.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Tags */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-tags" className="text-right">
                        Tags
                      </Label>
                      <Input
                        id="edit-tags"
                        name="tags"
                        placeholder="Comma-separated tags"
                        value={selectedResource.tags}
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                    </div>
                    {/* Content */}
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="edit-content" className="text-right pt-2">
                        Content
                      </Label>
                      <div
                        id="edit-content"
                        ref={quillEditorRef}
                        className="col-span-3 min-h-[150px] bg-white"
                        style={quillStyles.editor}
                      />
                    </div>
                    {/* External Links */}
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">External Links</Label>
                      <div className="col-span-3 space-y-2">
                        {renderExternalLinksInputs(
                          selectedResource,
                          setSelectedResource
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addExternalLink}
                        >
                          Add Link
                        </Button>
                      </div>
                    </div>
                    {/* File Upload */}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-file" className="text-right">
                        New File (Optional)
                      </Label>
                      <Input
                        id="edit-file"
                        name="file"
                        type="file"
                        onChange={handleInputChange}
                        className="col-span-3"
                      />
                      {selectedResource?.file && (
                        <p className="col-span-3 col-start-2 text-xs text-muted-foreground">
                          Current file: {selectedResource.file.split("/").pop()}{" "}
                          (Uploading a new file will replace it)
                        </p>
                      )}
                    </div>
                  </div>
                  <CardFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("list")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}{" "}
                      Update Resource
                    </Button>
                  </CardFooter>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceManagementSection;
