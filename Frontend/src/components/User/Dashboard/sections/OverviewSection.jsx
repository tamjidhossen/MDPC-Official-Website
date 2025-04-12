import React from "react";
import { Link } from "react-router-dom";
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Trophy,
  BookOpen,
  CheckCircle,
  PenTool,
  BarChart2,
} from "lucide-react";
import {
  cfUserProfile,
  cfRatingHistory,
  getRatingColor,
} from "../utils/ratingUtils";

const OverviewSection = ({ setActiveSection }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveSection("profile")}
        >
          View Profile
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">CF Rating</CardTitle>
            <CardDescription>Current performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div
                className="text-3xl font-bold"
                style={{ color: getRatingColor(cfUserProfile.rating) }}
              >
                {cfUserProfile.rating}
              </div>
              <Badge
                style={{
                  backgroundColor: getRatingColor(cfUserProfile.rating),
                  color: "white",
                }}
              >
                {cfUserProfile.rank}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Max:{" "}
              <span className="font-medium">{cfUserProfile.maxRating}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Problems Solved</CardTitle>
            <CardDescription>All time statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">142</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">Last week: </span>
              <Badge variant="outline">+8</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contests Participated</CardTitle>
            <CardDescription>Your activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">27</div>
            <p className="text-sm text-muted-foreground mt-2">
              Next contest: <span className="font-medium">2 days</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rating graph */}
      <Card>
        <CardHeader>
          <CardTitle>Rating History</CardTitle>
          <CardDescription>Your performance in recent contests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={cfRatingHistory}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis domain={["dataMin - 100", "dataMax + 100"]} />
                <Tooltip
                  formatter={(value) => [`Rating: ${value}`, "Rating"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke={getRatingColor(cfUserProfile.rating)}
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent activity & Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Participated in Div2 Round 850
                    </p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <Badge>+22 rating</Badge>
              </li>
              <li className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Solved "Minimum Path Sum"</p>
                    <p className="text-sm text-muted-foreground">3 days ago</p>
                  </div>
                </div>
                <Badge variant="outline">1600</Badge>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <PenTool className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Published new blog post</p>
                    <p className="text-sm text-muted-foreground">1 week ago</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/blogs/3">View</Link>
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              onClick={() => setActiveSection("blogs")}
              className="justify-start"
            >
              <PenTool className="mr-2 h-4 w-4" />
              Write New Blog
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveSection("analytics")}
              className="justify-start"
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              View Problem Analytics
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link to="/contests">
                <Trophy className="mr-2 h-4 w-4" />
                Upcoming Contests
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link to="/resources">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Learning Resources
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewSection;
