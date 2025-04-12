"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Users,
  Calendar,
  FileText,
  Trophy,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  Star,
} from "lucide-react";

const OverviewSection = () => {
  // Mock data for statistics
  const stats = {
    totalMembers: 125,
    activeMembers: 105,
    pendingApplications: 7,
    events: {
      upcoming: 3,
      past: 12,
      total: 15,
    },
    contests: {
      upcoming: 2,
      past: 8,
      total: 10,
    },
    blogs: {
      published: 24,
      draft: 5,
      pending: 3,
      total: 32,
    },
    memberGrowth: {
      percentage: 18,
      isPositive: true,
    },
    activityGrowth: {
      percentage: 12,
      isPositive: true,
    },
  };

  // Recent activity data
  const recentActivities = [
    {
      id: 1,
      title: "New membership application",
      description: "Priya Sharma applied to join MDPC",
      time: "Just now",
      type: "member",
    },
    {
      id: 2,
      title: "Blog post published",
      description: "Understanding Dynamic Programming Paradigms",
      time: "2 hours ago",
      type: "blog",
    },
    {
      id: 3,
      title: "Event created",
      description: "MDPC Spring Contest 2025",
      time: "1 day ago",
      type: "event",
    },
    {
      id: 4,
      title: "Contest results updated",
      description: "Weekly Practice Contest #12 results",
      time: "2 days ago",
      type: "contest",
    },
  ];

  // Top performers data
  const topPerformers = [
    {
      id: 1,
      name: "Ahmed Khan",
      studentId: "2021331067",
      rating: 1842,
      contests: 24,
      rank: 1,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      studentId: "2020331042",
      rating: 1795,
      contests: 32,
      rank: 2,
    },
    {
      id: 3,
      name: "David Lee",
      studentId: "2022331012",
      rating: 1750,
      contests: 18,
      rank: 3,
    },
    {
      id: 4,
      name: "Mina Patel",
      studentId: "2019331089",
      rating: 1708,
      contests: 30,
      rank: 4,
    },
    {
      id: 5,
      name: "John Smith",
      studentId: "2019331001",
      rating: 1680,
      contests: 28,
      rank: 5,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          Welcome to the MDPC admin dashboard. Here's an overview of your club's
          performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeMembers} active, {stats.pendingApplications} pending
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.memberGrowth.isPositive ? (
                <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3 text-rose-500" />
              )}
              <span
                className={
                  stats.memberGrowth.isPositive
                    ? "text-emerald-500"
                    : "text-rose-500"
                }
              >
                {stats.memberGrowth.percentage}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.events.upcoming}</div>
            <p className="text-xs text-muted-foreground">
              {stats.events.total} total events
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="h-8 w-full justify-between p-0 text-xs"
              asChild
            >
              <div>
                <span>View all events</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blogs.published}</div>
            <p className="text-xs text-muted-foreground">
              {stats.blogs.draft} drafts, {stats.blogs.pending} pending
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="h-8 w-full justify-between p-0 text-xs"
              asChild
            >
              <div>
                <span>Manage blog posts</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Contests
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contests.upcoming}</div>
            <p className="text-xs text-muted-foreground">
              {stats.contests.total} total contests
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="h-8 w-full justify-between p-0 text-xs"
              asChild
            >
              <div>
                <span>View all contests</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and updates across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-lg border p-3"
                >
                  <div
                    className={`rounded-full p-2 ${
                      activity.type === "member"
                        ? "bg-blue-100 text-blue-700"
                        : activity.type === "blog"
                        ? "bg-purple-100 text-purple-700"
                        : activity.type === "event"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {activity.type === "member" && (
                      <UserPlus className="h-4 w-4" />
                    )}
                    {activity.type === "blog" && (
                      <FileText className="h-4 w-4" />
                    )}
                    {activity.type === "event" && (
                      <Calendar className="h-4 w-4" />
                    )}
                    {activity.type === "contest" && (
                      <Trophy className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Activity
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>
              Members with the highest contest ratings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((performer) => (
                <div
                  key={performer.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary h-8 w-8 flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {performer.rank}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{performer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {performer.studentId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3.5 w-3.5 text-amber-500 mr-1" />
                    <span className="font-medium">{performer.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Leaderboard
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks you might want to perform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-auto flex-col py-4 px-2 space-y-2">
              <UserPlus className="h-5 w-5" />
              <span>Add Member</span>
            </Button>
            <Button
              className="h-auto flex-col py-4 px-2 space-y-2"
              variant="outline"
            >
              <Calendar className="h-5 w-5" />
              <span>Create Event</span>
            </Button>
            <Button
              className="h-auto flex-col py-4 px-2 space-y-2"
              variant="outline"
            >
              <FileText className="h-5 w-5" />
              <span>New Blog Post</span>
            </Button>
            <Button
              className="h-auto flex-col py-4 px-2 space-y-2"
              variant="outline"
            >
              <Trophy className="h-5 w-5" />
              <span>Add Contest</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewSection;
