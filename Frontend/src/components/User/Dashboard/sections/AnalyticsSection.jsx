import { useState, useEffect, useMemo } from "react";
import useCodeforcesData from "@/hooks/useCodeforcesData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { Loader2, AlertCircle, RefreshCcw, Download, Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label, ratingColorMap }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border rounded-md p-3 shadow-lg">
        <p className="font-medium">
          Problem Rating:{" "}
          <span
            style={{ color: ratingColorMap.get(payload[0].payload.rating) }}
          >
            {payload[0].payload.rating}
          </span>
        </p>
        <p className="text-muted-foreground">Count: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// Color mapping for Codeforces problem ratings
const getRatingColor = (rating) => {
  const ratingNum = parseInt(rating);
  if (ratingNum < 1200) return "#808080"; // Gray
  if (ratingNum < 1400) return "#4CAF50"; // Green
  if (ratingNum < 1600) return "#03A9F4"; // Cyan
  if (ratingNum < 1900) return "#2196F3"; // Blue
  if (ratingNum < 2100) return "#9C27B0"; // Purple
  if (ratingNum < 2400) return "#FF9800"; // Orange
  if (ratingNum < 2600) return "#F44336"; // Red
  return "#E91E63"; // Magenta
};

export default function AnalyticsSection() {
  // Filter states
  const [selectedIndex, setSelectedIndex] = useState("all");
  const [selectedContestType, setSelectedContestType] = useState("all");
  const [selectedTiming, setSelectedTiming] = useState("all");

  // Fetch data using our custom hook
  const { loading, getProblemDistribution, clearCache } = useCodeforcesData();

  const [distributionData, setDistributionData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter options
  const indices = useMemo(
    () => [
      "all",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
    ],
    []
  );

  const contestTypes = useMemo(
    () => [
      { value: "all", label: "All Types" },
      { value: "div1", label: "Div. 1" },
      { value: "div2", label: "Div. 2" },
      { value: "div3", label: "Div. 3" },
      { value: "div4", label: "Div. 4" },
      { value: "div1_div2", label: "Div. 1 + Div. 2" },
      { value: "global", label: "Global Round" },
      { value: "educational", label: "Educational" },
    ],
    []
  );

  const timings = useMemo(
    () => [
      { value: "all", label: "All time" },
      { value: "week", label: "Last Week" },
      { value: "month", label: "Last Month" },
      { value: "3months", label: "Last 3 Months" },
      { value: "6months", label: "Last 6 Months" },
      { value: "year", label: "Last Year" },
      { value: "2years", label: "Last 2 Years" },
      { value: "4years", label: "Last 4 Years" },
    ],
    []
  );

  // Create a Map for rating colors for easy lookup
  const ratingColorMap = useMemo(() => {
    const map = new Map();
    if (distributionData?.ratingDistribution) {
      Object.keys(distributionData.ratingDistribution).forEach((rating) => {
        map.set(rating, getRatingColor(rating));
      });
    }
    return map;
  }, [distributionData]);

  // Generate a cache key based on the current filters
  const cacheKey = useMemo(() => {
    return `problemDistribution_${selectedIndex}_${selectedContestType}_${selectedTiming}`;
  }, [selectedIndex, selectedContestType, selectedTiming]);

  // Fetch problem distribution data
  const fetchProblemDistribution = async (force = false) => {
    setIsLoading(true);
    setFetchError(null);

    try {
      // Force refresh data if requested
      if (force) {
        clearCache("problemDistribution");
      }

      // Prepare params based on selected filters
      const params = {};
      if (selectedIndex !== "all") params.index = selectedIndex;

      if (selectedContestType !== "all") {
        params.contestType =
          contestTypes.find((ct) => ct.value === selectedContestType)?.label ||
          "All Types";
      }

      if (selectedTiming !== "all") {
        params.timing =
          timings.find((t) => t.value === selectedTiming)?.label || "All time";
      }

      // Add force refresh parameter if needed
      if (force) {
        params.forceRefresh = true;
      }

      // Fetch data with our custom hook
      const result = await getProblemDistribution(params);

      if (result.error) {
        setFetchError(result.error);
        setDistributionData(null);
      } else {
        setDistributionData(result.data);
      }
    } catch (error) {
      console.error("Error fetching problem distribution data:", error);
      setFetchError(
        error.message || "Failed to load problem distribution data"
      );
      setDistributionData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Transform rating distribution data for charts
  const chartData = useMemo(() => {
    if (!distributionData?.ratingDistribution) return [];

    return Object.entries(distributionData.ratingDistribution)
      .map(([rating, count]) => ({
        rating,
        count,
      }))
      .sort((a, b) => parseInt(a.rating) - parseInt(b.rating));
  }, [distributionData]);

  // Calculate statistics from the data
  const stats = useMemo(() => {
    if (!chartData.length)
      return {
        totalProblems: 0,
        mostCommonRating: "-",
        avgRating: 0,
        medianRating: "-",
      };

    // Total problems count
    const totalProblems = chartData.reduce((sum, item) => sum + item.count, 0);

    // Most common rating
    const mostCommon = chartData.reduce(
      (max, item) => (item.count > max.count ? item : max),
      { count: 0 }
    );

    // Calculate weighted average rating
    const avgRating = chartData.length
      ? (
          chartData.reduce(
            (sum, item) => sum + parseInt(item.rating) * item.count,
            0
          ) / totalProblems
        ).toFixed(0)
      : 0;

    // Calculate median rating
    let cumulativeCount = 0;
    const medianPoint = totalProblems / 2;
    let medianRating = "-";

    for (const item of chartData) {
      cumulativeCount += item.count;
      if (cumulativeCount >= medianPoint) {
        medianRating = item.rating;
        break;
      }
    }

    return {
      totalProblems,
      mostCommonRating: mostCommon.rating || "-",
      avgRating,
      medianRating,
    };
  }, [chartData]);

  // Effect to fetch data when filters change
  useEffect(() => {
    fetchProblemDistribution();
  }, [selectedIndex, selectedContestType, selectedTiming]);

  // Function to download chart data as CSV
  const downloadCSV = () => {
    if (!chartData.length) return;

    const headers = ["Rating", "Count"];
    const csvContent = [
      headers.join(","),
      ...chartData.map((row) => [row.rating, row.count].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `problem_distribution_${selectedIndex}_${selectedTiming}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Problem Analytics
          </h2>
          <p className="text-muted-foreground mt-1">
            Visualize and analyze Codeforces problem distribution by rating and
            other parameters
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchProblemDistribution(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-1" />
            )}
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={downloadCSV}
            disabled={isLoading || !chartData.length}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {fetchError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {fetchError}. Please try refreshing the data.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filters Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <div className="flex items-center justify-between w-full">
                Filter Parameters
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Info className="h-4 w-4" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">About Problem Filters</h4>
                      <p className="text-sm text-muted-foreground">
                        These filters allow you to analyze problems by index
                        (difficulty within a contest), contest type, and time
                        period. Changes are applied automatically.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Index Filter (as Tabs) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Problem Index</label>
              <Tabs
                defaultValue={selectedIndex}
                onValueChange={setSelectedIndex}
                className="w-full"
              >
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="A">A</TabsTrigger>
                  <TabsTrigger value="B">B</TabsTrigger>
                  <TabsTrigger value="C">C</TabsTrigger>
                  <TabsTrigger value="D">D</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-5 mt-2">
                  <TabsTrigger value="E">E</TabsTrigger>
                  <TabsTrigger value="F">F</TabsTrigger>
                  <TabsTrigger value="G">G</TabsTrigger>
                  <TabsTrigger value="H">H</TabsTrigger>
                  <TabsTrigger value="I+">I+</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Contest Type Filter (as Select) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Contest Type</label>
              <Select
                value={selectedContestType}
                onValueChange={setSelectedContestType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contest type" />
                </SelectTrigger>
                <SelectContent>
                  {contestTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Period Filter (as Select) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select value={selectedTiming} onValueChange={setSelectedTiming}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  {timings.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            <div className="pt-4 space-y-2">
              <h4 className="text-sm font-medium">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  Index: {selectedIndex === "all" ? "All" : selectedIndex}
                </Badge>
                <Badge variant="secondary">
                  Contest:{" "}
                  {contestTypes.find((ct) => ct.value === selectedContestType)
                    ?.label || "All Types"}
                </Badge>
                <Badge variant="secondary">
                  Time:{" "}
                  {timings.find((t) => t.value === selectedTiming)?.label ||
                    "All time"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Problem Rating Distribution
                {selectedIndex !== "all" && ` - Index ${selectedIndex}`}
              </span>
            </CardTitle>
            <CardDescription>
              Distribution of problems by difficulty rating
              {selectedContestType !== "all" &&
                ` in ${
                  contestTypes.find((ct) => ct.value === selectedContestType)
                    ?.label
                }`}
              {selectedTiming !== "all" &&
                ` (${timings.find((t) => t.value === selectedTiming)?.label})`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Chart Area */}
            <div className="h-[450px] w-full relative">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary mb-4 animate-spin" />
                  <p className="text-muted-foreground">
                    Loading problem data...
                  </p>
                </div>
              ) : chartData.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-center">
                    No data available for the selected filters.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setSelectedIndex("all");
                      setSelectedContestType("all");
                      setSelectedTiming("all");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="rating"
                      label={{
                        value: "Problem Rating",
                        position: "insideBottom",
                        offset: -10,
                        fill: "var(--muted-foreground)",
                      }}
                    />
                    <YAxis
                      label={{
                        value: "Number of Problems",
                        angle: -90,
                        position: "insideLeft",
                        fill: "var(--muted-foreground)",
                      }}
                    />
                    <Tooltip
                      content={
                        <CustomTooltip ratingColorMap={ratingColorMap} />
                      }
                    />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Problem Count"
                      radius={[4, 4, 0, 0]}
                      barSize={18}
                    >
                      {chartData.map((entry) => (
                        <Cell
                          key={`cell-${entry.rating}`}
                          fill={getRatingColor(entry.rating)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Problems
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {stats.totalProblems.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Common Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <div
                className="text-2xl font-bold"
                style={{ color: getRatingColor(stats.mostCommonRating) }}
              >
                {stats.mostCommonRating}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <div
                className="text-2xl font-bold"
                style={{ color: getRatingColor(stats.avgRating) }}
              >
                {stats.avgRating}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Median Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <div
                className="text-2xl font-bold"
                style={{ color: getRatingColor(stats.medianRating) }}
              >
                {stats.medianRating}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
