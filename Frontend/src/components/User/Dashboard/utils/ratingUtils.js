// Get rating color based on Codeforces rating
export const getRatingColor = (rating) => {
  if (rating < 1200) return "#808080"; // Gray for Newbie
  if (rating < 1400) return "#008000"; // Green for Pupil
  if (rating < 1600) return "#03a89e"; // Cyan for Specialist
  if (rating < 1900) return "#0000ff"; // Blue for Expert
  if (rating < 2100) return "#aa00aa"; // Purple for Candidate Master
  if (rating < 2400) return "#ff8c00"; // Orange for Master
  return "#ff0000"; // Red for higher ranks
};

// Mock CF user data - This would be fetched from an API in a real app
export const cfUserProfile = {
  handle: "ahmed_coder",
  rating: 1842,
  maxRating: 1950,
  rank: "expert",
  avatar: "/avatar-placeholder.jpg",
  joinDate: "January 2022",
  lastOnline: "2 hours ago",
  contribution: 15,
  friendsCount: 23,
};

// Codeforces rating graph data
export const cfRatingHistory = [
  { contest: "Educational Round 152", date: "Jan 05", rating: 1720 },
  { contest: "Div2 Round 835", date: "Jan 21", rating: 1756 },
  { contest: "Div2 Round 837", date: "Feb 12", rating: 1789 },
  { contest: "Educational Round 154", date: "Mar 05", rating: 1842 },
  { contest: "Div2 Round 841", date: "Mar 25", rating: 1820 },
  { contest: "Div2 Round 845", date: "Apr 10", rating: 1795 },
  { contest: "Educational Round 156", date: "Apr 30", rating: 1842 },
  { contest: "Div2 Round 850", date: "May 15", rating: 1842 },
];

// CF problem analytics data
export const problemIndexData = [
  { index: "A", solved: 45, attempted: 50 },
  { index: "B", solved: 38, attempted: 45 },
  { index: "C", solved: 29, attempted: 40 },
  { index: "D", solved: 18, attempted: 30 },
  { index: "E", solved: 10, attempted: 20 },
  { index: "F", solved: 5, attempted: 15 },
];

export const problemRatingData = [
  { rating: "800-999", solved: 40, count: 45 },
  { rating: "1000-1199", solved: 32, count: 40 },
  { rating: "1200-1399", solved: 25, count: 32 },
  { rating: "1400-1599", solved: 18, count: 25 },
  { rating: "1600-1799", solved: 12, count: 18 },
  { rating: "1800-1999", solved: 8, count: 15 },
  { rating: "2000-2199", solved: 5, count: 10 },
  { rating: "2200+", solved: 2, count: 8 },
];

export const contestTypeData = [
  { type: "Div. 1", participated: 2, solved: 5 },
  { type: "Div. 2", participated: 15, solved: 42 },
  { type: "Div. 3", participated: 18, solved: 65 },
  { type: "Div. 4", participated: 10, solved: 48 },
  { type: "Educational", participated: 12, solved: 38 },
  { type: "Global", participated: 4, solved: 12 },
];

// Time-filtered problem data
export const timeFilteredData = {
  "last-week": [
    { rating: "800-999", solved: 3, count: 4 },
    { rating: "1000-1199", solved: 2, count: 3 },
    { rating: "1200-1399", solved: 1, count: 2 },
  ],
  "last-month": [
    { rating: "800-999", solved: 8, count: 10 },
    { rating: "1000-1199", solved: 7, count: 9 },
    { rating: "1200-1399", solved: 5, count: 7 },
    { rating: "1400-1599", solved: 3, count: 5 },
  ],
  "last-3-months": [
    { rating: "800-999", solved: 15, count: 18 },
    { rating: "1000-1199", solved: 12, count: 15 },
    { rating: "1200-1399", solved: 10, count: 13 },
    { rating: "1400-1599", solved: 7, count: 10 },
    { rating: "1600-1799", solved: 5, count: 8 },
  ],
  "last-year": [
    { rating: "800-999", solved: 30, count: 35 },
    { rating: "1000-1199", solved: 25, count: 30 },
    { rating: "1200-1399", solved: 20, count: 25 },
    { rating: "1400-1599", solved: 15, count: 20 },
    { rating: "1600-1799", solved: 10, count: 15 },
    { rating: "1800-1999", solved: 7, count: 12 },
  ],
};

// Draft blogs
export const draftBlogs = [
  {
    id: 1,
    title: "My approach to Dynamic Programming",
    lastEdited: "May 22, 2024",
    status: "draft",
    excerpt: "In this blog, I explain my approach to tackling DP problems...",
  },
  {
    id: 2,
    title: "Graph Theory Made Simple",
    lastEdited: "May 15, 2024",
    status: "draft",
    excerpt: "Understanding graph algorithms and their applications...",
  },
];

// Published blogs
export const publishedBlogs = [
  {
    id: 3,
    title: "How I improved my Codeforces rating",
    publishDate: "April 30, 2024",
    views: 256,
    likes: 45,
    comments: 12,
  },
  {
    id: 4,
    title: "Tips for solving combinatorial problems",
    publishDate: "March 15, 2024",
    views: 432,
    likes: 78,
    comments: 23,
  },
];

// Colors for charts
export const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
