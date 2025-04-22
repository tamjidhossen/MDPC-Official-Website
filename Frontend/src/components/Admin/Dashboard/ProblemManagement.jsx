import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { PlusCircle, Edit, Trash2, Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { useToast } from "../../../hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import axios from "axios";
import { contestApi } from "@/services/api";

const ProblemManagement = ({ selectedContestId = "" }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [contests, setContests] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    inputFormat: "",
    outputFormat: "",
    difficulty: "Medium",
    contestId: selectedContestId || "",
    timeLimit: 1000,
    memoryLimit: 256,
    points: 100,
    testCases: [{ input: "", output: "", isExample: true }],
  });

  useEffect(() => {
    // Update contestId in the form data when selectedContestId prop changes
    if (selectedContestId && selectedContestId !== formData.contestId) {
      setFormData((prev) => ({ ...prev, contestId: selectedContestId }));
    }
  }, [selectedContestId]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const problemsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/problems`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProblems(problemsResponse.data.data.problems || []);

        // Fetch contests for dropdown
        const contestsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/contests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setContests(contestsResponse.data.data.contests || []);
      } catch (error) {
        console.error("Error fetching problems:", error);
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to load problems",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [toast]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      if (!editingProblem) {
        setFormData({
          name: "",
          description: "",
          inputFormat: "",
          outputFormat: "",
          difficulty: "Medium",
          contestId: "",
          timeLimit: 1000,
          memoryLimit: 256,
          points: 100,
          testCases: [{ input: "", output: "", isExample: true }],
        });
      }
    }
  }, [dialogOpen, editingProblem]);

  // Set form data when editing a problem
  useEffect(() => {
    if (editingProblem) {
      setFormData({
        name: editingProblem.name || "",
        description: editingProblem.description || "",
        inputFormat: editingProblem.inputFormat || "",
        outputFormat: editingProblem.outputFormat || "",
        difficulty: editingProblem.difficulty || "Medium",
        contestId: editingProblem.contestId?._id || "",
        timeLimit: editingProblem.timeLimit || 1000,
        memoryLimit: editingProblem.memoryLimit || 256,
        points: editingProblem.points || 100,
        testCases:
          editingProblem.testCases && editingProblem.testCases.length > 0
            ? editingProblem.testCases
            : [{ input: "", output: "", isExample: true }],
      });
    }
  }, [editingProblem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index][field] = value;
    setFormData((prev) => ({ ...prev, testCases: updatedTestCases }));
  };

  const handleTestCaseCheckboxChange = (index) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index].isExample = !updatedTestCases[index].isExample;
    setFormData((prev) => ({ ...prev, testCases: updatedTestCases }));
  };

  const addTestCase = () => {
    setFormData((prev) => ({
      ...prev,
      testCases: [
        ...prev.testCases,
        { input: "", output: "", isExample: false },
      ],
    }));
  };

  const removeTestCase = (index) => {
    if (formData.testCases.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "At least one test case is required",
        variant: "destructive",
      });
      return;
    }

    const updatedTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, testCases: updatedTestCases }));
  };

  const handleSubmit = async () => {
    try {
      // Validate form data
      if (
        !formData.name ||
        !formData.description ||
        !formData.inputFormat ||
        !formData.outputFormat
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Check if all test cases have input and output
      const invalidTestCase = formData.testCases.find(
        (tc) => !tc.input || !tc.output
      );
      if (invalidTestCase) {
        toast({
          title: "Validation Error",
          description: "All test cases must have input and output",
          variant: "destructive",
        });
        return;
      }

      const token = localStorage.getItem("token");

      if (editingProblem) {
        // Update existing problem
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/problems/${editingProblem._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update problems list
        setProblems((prev) =>
          prev.map((p) =>
            p._id === editingProblem._id ? response.data.data.problem : p
          )
        );

        toast({
          title: "Success",
          description: "Problem updated successfully",
        });
      } else {
        // Create new problem
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/problems`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Add to problems list
        setProblems((prev) => [...prev, response.data.data.problem]);

        toast({
          title: "Success",
          description: "Problem created successfully",
        });
      }

      // Close dialog
      setDialogOpen(false);
      setEditingProblem(null);
    } catch (error) {
      console.error("Error saving problem:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save problem",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (problem) => {
    setEditingProblem(problem);
    setDialogOpen(true);
  };

  const handleDelete = async (problemId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this problem? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/problems/${problemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove from problems list
      setProblems((prev) => prev.filter((p) => p._id !== problemId));

      toast({
        title: "Success",
        description: "Problem deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting problem:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete problem",
        variant: "destructive",
      });
    }
  };

  // Filter problems by search term
  const filteredProblems = problems.filter(
    (problem) =>
      problem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (problem.contestId?.title &&
        problem.contestId.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Problem Management</CardTitle>
              <CardDescription>
                Create and manage programming problems for contests
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search problems..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingProblem(null)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Problem
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProblem ? "Edit Problem" : "Create New Problem"}
                    </DialogTitle>
                  </DialogHeader>

                  <Tabs defaultValue="details">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Problem Details</TabsTrigger>
                      <TabsTrigger value="format">
                        Input/Output Format
                      </TabsTrigger>
                      <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
                    </TabsList>

                    {/* Problem Details */}
                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Problem Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter problem name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="difficulty">Difficulty</Label>
                          <Select
                            value={formData.difficulty}
                            onValueChange={(value) =>
                              handleSelectChange("difficulty", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Easy">Easy</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contestId">Contest</Label>
                          <Select
                            value={formData.contestId}
                            onValueChange={(value) =>
                              handleSelectChange("contestId", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select contest" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">
                                No Contest (Practice)
                              </SelectItem>
                              {contests.map((contest) => (
                                <SelectItem
                                  key={contest._id}
                                  value={contest._id}
                                >
                                  {contest.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="timeLimit">Time Limit (ms)</Label>
                          <Input
                            id="timeLimit"
                            name="timeLimit"
                            type="number"
                            value={formData.timeLimit}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="memoryLimit">Memory Limit (MB)</Label>
                          <Input
                            id="memoryLimit"
                            name="memoryLimit"
                            type="number"
                            value={formData.memoryLimit}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="points">Points</Label>
                          <Input
                            id="points"
                            name="points"
                            type="number"
                            value={formData.points}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">
                          Problem Description *
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Enter problem description"
                          rows={5}
                          required
                        />
                      </div>
                    </TabsContent>

                    {/* Input/Output Format */}
                    <TabsContent value="format" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="inputFormat">Input Format *</Label>
                        <Textarea
                          id="inputFormat"
                          name="inputFormat"
                          value={formData.inputFormat}
                          onChange={handleInputChange}
                          placeholder="Describe the input format"
                          rows={4}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="outputFormat">Output Format *</Label>
                        <Textarea
                          id="outputFormat"
                          name="outputFormat"
                          value={formData.outputFormat}
                          onChange={handleInputChange}
                          placeholder="Describe the output format"
                          rows={4}
                          required
                        />
                      </div>
                    </TabsContent>

                    {/* Test Cases */}
                    <TabsContent value="test-cases" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Test Cases</h3>
                        <Button
                          onClick={addTestCase}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add Test Case
                        </Button>
                      </div>

                      {formData.testCases.map((testCase, index) => (
                        <Card key={index} className="relative">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">
                                Test Case #{index + 1}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`isExample-${index}`}
                                    checked={testCase.isExample}
                                    onChange={() =>
                                      handleTestCaseCheckboxChange(index)
                                    }
                                  />
                                  <Label htmlFor={`isExample-${index}`}>
                                    Example
                                  </Label>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeTestCase(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`input-${index}`}>Input</Label>
                              <Textarea
                                id={`input-${index}`}
                                value={testCase.input}
                                onChange={(e) =>
                                  handleTestCaseChange(
                                    index,
                                    "input",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter test case input"
                                rows={3}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`output-${index}`}>
                                Expected Output
                              </Label>
                              <Textarea
                                id={`output-${index}`}
                                value={testCase.output}
                                onChange={(e) =>
                                  handleTestCaseChange(
                                    index,
                                    "output",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter expected output"
                                rows={3}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                      {editingProblem ? "Update Problem" : "Create Problem"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">No problems found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm
                  ? "Try adjusting your search term."
                  : "Create a new problem to get started."}
              </p>
            </div>
          ) : (
            <Table>
              <TableCaption>List of all programming problems</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Contest</TableHead>
                  <TableHead>Test Cases</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProblems.map((problem) => (
                  <TableRow key={problem._id}>
                    <TableCell className="font-medium">
                      {problem.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          problem.difficulty === "Easy"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : problem.difficulty === "Hard"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }
                      >
                        {problem.difficulty || "Medium"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {problem.contestId?.title || "Practice"}
                    </TableCell>
                    <TableCell>{problem.testCases?.length || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(problem)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(problem._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemManagement;
