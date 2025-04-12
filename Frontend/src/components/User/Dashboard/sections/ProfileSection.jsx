import React from "react";
import { Button } from "@/components/ui/button";
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
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  cfUserProfile,
  cfRatingHistory,
  getRatingColor,
} from "../utils/ratingUtils";

const ProfileSection = ({ setActiveSection }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Codeforces Profile</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveSection("settings")}
        >
          Edit Profile
        </Button>
      </div>

      {/* CF Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar
              className="h-32 w-32 border-4"
              style={{ borderColor: getRatingColor(cfUserProfile.rating) }}
            >
              <AvatarImage
                src={cfUserProfile.avatar}
                alt={cfUserProfile.handle}
              />
              <AvatarFallback>
                {cfUserProfile.handle[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-4 text-center md:text-left">
              <div>
                <h2 className="text-2xl font-bold">{cfUserProfile.handle}</h2>
                <p className="text-muted-foreground">
                  Joined {cfUserProfile.joinDate}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-card border rounded-xl p-4 min-w-[100px] text-center">
                  <div
                    className="text-xl font-bold"
                    style={{ color: getRatingColor(cfUserProfile.rating) }}
                  >
                    {cfUserProfile.rating}
                  </div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>

                <div className="bg-card border rounded-xl p-4 min-w-[100px] text-center">
                  <div
                    className="text-xl font-bold"
                    style={{ color: getRatingColor(cfUserProfile.maxRating) }}
                  >
                    {cfUserProfile.maxRating}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Max Rating
                  </div>
                </div>

                <div className="bg-card border rounded-xl p-4 min-w-[100px] text-center">
                  <div
                    className="text-xl font-bold capitalize"
                    style={{ color: getRatingColor(cfUserProfile.rating) }}
                  >
                    {cfUserProfile.rank}
                  </div>
                  <div className="text-sm text-muted-foreground">Rank</div>
                </div>

                <div className="bg-card border rounded-xl p-4 min-w-[100px] text-center">
                  <div className="text-xl font-bold">
                    {cfUserProfile.contribution}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Contribution
                  </div>
                </div>
              </div>

              <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://codeforces.com/profile/${cfUserProfile.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Codeforces Profile
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://codeforces.com/submissions/${cfUserProfile.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View All Submissions
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CF Rating Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Rating History</CardTitle>
          <CardDescription>Your performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
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
                  formatter={(value, name, props) => [
                    `Rating: ${value}`,
                    props.payload.contest,
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke={getRatingColor(cfUserProfile.rating)}
                  strokeWidth={2}
                  dot={{ r: 5, fill: getRatingColor(cfUserProfile.rating) }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent contests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contests</CardTitle>
          <CardDescription>
            Your performance in the last 5 contests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contest</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Solved</TableHead>
                <TableHead className="text-right">Rating Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cfRatingHistory.slice(0, 5).map((contest, index) => {
                const ratingChange =
                  index > 0
                    ? contest.rating - cfRatingHistory[index - 1].rating
                    : 0;

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {contest.contest}
                    </TableCell>
                    <TableCell>{contest.date}</TableCell>
                    <TableCell>
                      {1000 + Math.floor(Math.random() * 5000)}
                    </TableCell>
                    <TableCell>{Math.floor(Math.random() * 6) + 1}/8</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          ratingChange >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {ratingChange >= 0 ? `+${ratingChange}` : ratingChange}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" asChild className="ml-auto">
            <a
              href={`https://codeforces.com/contests/with/${cfUserProfile.handle}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View All Contests
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileSection;
