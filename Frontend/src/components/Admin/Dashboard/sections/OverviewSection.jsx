import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  FileText,
  Trophy,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { memberApi, eventApi, contestApi } from "@/services/api";

const OverviewSection = ({ setActivePage }) => {
  const [stats, setStats] = useState({
    members: {
      total: 0,
      active: 0,
      pending: 0,
    },
    events: {
      upcoming: 0,
      total: 0,
    },
    contests: {
      upcoming: 0,
      total: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch active members
        const activeMembers = await memberApi.getAll({
          status: "active",
          limit: 1,
        });

        // Fetch pending members
        const pendingMembers = await memberApi.getAll({
          status: "pending",
          limit: 1,
        });

        // Fetch upcoming events
        const upcomingEvents = await eventApi.getAll({
          status: "upcoming",
          limit: 1,
        });

        // Fetch upcoming contests
        const upcomingContests = await contestApi.getAll({
          status: "upcoming",
          limit: 1,
        });

        setStats({
          members: {
            total:
              (activeMembers.data.pagination?.totalMembers || 0) +
              (pendingMembers.data.pagination?.totalMembers || 0),
            active: activeMembers.data.pagination?.totalMembers || 0,
            pending: pendingMembers.data.pagination?.totalMembers || 0,
          },
          events: {
            upcoming: upcomingEvents.data.pagination?.totalEvents || 0,
            total: upcomingEvents.data.pagination?.totalEvents || 0,
          },
          contests: {
            upcoming: upcomingContests.data.pagination?.totalContests || 0,
            total: upcomingContests.data.pagination?.totalContests || 0,
          },
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching overview data:", err);
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePageChange = (page) => {
    if (setActivePage) {
      setActivePage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center border rounded-lg bg-muted/20">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

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

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.members.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.members.active} active, {stats.members.pending} pending
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="h-8 w-full justify-between p-0 text-xs"
              onClick={() => handlePageChange("members")}
            >
              <span>Manage members</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
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
              onClick={() => handlePageChange("events")}
            >
              <span>Manage events</span>
              <ArrowRight className="h-3 w-3" />
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
              onClick={() => handlePageChange("contests")}
            >
              <span>Manage contests</span>
              <ArrowRight className="h-3 w-3" />
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
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <Button
              className="h-auto flex-col py-4 px-2 space-y-2 w-full"
              onClick={() => handlePageChange("members")}
            >
              <Users className="h-5 w-5" />
              <span>Manage Members</span>
            </Button>
            <Button
              className="h-auto flex-col py-4 px-2 space-y-2 w-full"
              variant="outline"
              onClick={() => handlePageChange("events")}
            >
              <Calendar className="h-5 w-5" />
              <span>Manage Events</span>
            </Button>
            <Button
              className="h-auto flex-col py-4 px-2 space-y-2 w-full"
              variant="outline"
              onClick={() => handlePageChange("contests")}
            >
              <Trophy className="h-5 w-5" />
              <span>Manage Contests</span>
            </Button>
            <Button
              className="h-auto flex-col py-4 px-2 space-y-2 w-full"
              variant="outline"
              onClick={() => handlePageChange("registration")}
            >
              <FileText className="h-5 w-5" />
              <span>Registration Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewSection;
