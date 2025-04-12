import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  problemIndexData,
  problemRatingData,
  contestTypeData,
  timeFilteredData,
} from "../utils/ratingUtils";

const AnalyticsSection = () => {
  const [timeFrame, setTimeFrame] = useState("all-time");
  const [indexFilter, setIndexFilter] = useState("all");
  const [contestTypeFilter, setContestTypeFilter] = useState("all");

  // Get the current data based on selected time frame
  const currentData = timeFilteredData[timeFrame] || problemRatingData;

  const indexWiseSolvedData = [
    { index: "A", solved: 45, attempted: 50, total: 60 },
    { index: "B", solved: 38, attempted: 45, total: 55 },
    { index: "C", solved: 29, attempted: 40, total: 50 },
    { index: "D", solved: 18, attempted: 30, total: 45 },
    { index: "E", solved: 10, attempted: 20, total: 35 },
    { index: "F", solved: 5, attempted: 15, total: 25 },
    { index: "G", solved: 2, attempted: 7, total: 15 },
    { index: "H", solved: 1, attempted: 3, total: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">CF Problem Analytics</h1>
        <div className="flex items-center gap-2">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problems Solved by Index</CardTitle>
          <CardDescription>
            Detailed breakdown of your problem-solving patterns by problem index
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {indexWiseSolvedData.map((item) => (
              <div
                key={item.index}
                className="bg-card border rounded-xl p-4 flex flex-col items-center"
              >
                <div className="rounded-full w-10 h-10 bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-lg font-bold text-primary">
                    {item.index}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(item.solved / item.total) * 100}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">
                    {item.solved}/{item.total}
                  </p>
                  <p className="text-xs text-muted-foreground">solved</p>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {Math.round((item.solved / item.total) * 100)}% completion
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium mb-2">
              Problem-Solving Patterns
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Strong at: A, B problems</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Improving: C, D problems</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Need work: E+ problems</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problem Index Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Problems by Index</CardTitle>
          <CardDescription>
            Distribution of problems solved by index (A, B, C, etc)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={problemIndexData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="solved" name="Solved" fill="#0088FE" />
                <Bar dataKey="attempted" name="Attempted" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Problem Rating Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Problems by Rating</CardTitle>
          <CardDescription>
            Distribution of problems by difficulty rating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={currentData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="solved" name="Solved" fill="#00C49F" />
                <Bar dataKey="count" name="Available" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Contest Type Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Problems by Contest Type</CardTitle>
          <CardDescription>
            Distribution of problems solved by contest division
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contestTypeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar
                  yAxisId="left"
                  dataKey="participated"
                  name="Contests Participated"
                  fill="#8884d8"
                />
                <Bar
                  yAxisId="right"
                  dataKey="solved"
                  name="Problems Solved"
                  fill="#82ca9d"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Advanced filters card */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Analysis</CardTitle>
          <CardDescription>
            Detailed breakdown with customizable filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Contest Type
              </label>
              <Select
                value={contestTypeFilter}
                onValueChange={setContestTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contest type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contests</SelectItem>
                  <SelectItem value="div1">Div. 1</SelectItem>
                  <SelectItem value="div2">Div. 2</SelectItem>
                  <SelectItem value="div3">Div. 3</SelectItem>
                  <SelectItem value="div4">Div. 4</SelectItem>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Problem Index
              </label>
              <Select value={indexFilter} onValueChange={setIndexFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select problem index" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Indices</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                  <SelectItem value="E">E</SelectItem>
                  <SelectItem value="F+">F+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Time Period
              </label>
              <Select value={timeFrame} onValueChange={setTimeFrame}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Problem Solving Rate</h3>
                <Badge>{Math.floor(Math.random() * 8) + 2} problems/week</Badge>
              </div>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Accuracy Rate</h3>
                <Badge variant="outline">
                  {Math.floor(Math.random() * 26) + 75}%
                </Badge>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-medium">Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your performance
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Suggested Problems
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSection;
