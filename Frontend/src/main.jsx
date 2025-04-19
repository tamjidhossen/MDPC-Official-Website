import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./components/Home/HomePage";
import LeaderboardPage from "./components/Leaderboard/LeaderboardPage";
import ContestsPage from "./components/Contests/ContestsPage";
import ResourcesPage from "./components/Resources/ResourcesPage";
import EventsPage from "./components/Events/EventsPage";
import LoginPage from "./components/User/LoginPage";
import RegisterPage from "./components/User/RegisterPage";
import DashboardPage from "./components/User/Dashboard/DashboardPage";
import DynamicProgrammingResource from "./components/Resources/DynamicProgrammingResource";
import CPRoadmapResource from "./components/Resources/CPRoadmapResource";
import BlogDetailPage from "./components/Blogs/BlogDetailPage";
import ResourceDetailPage from "./components/Resources/ResourceDetailPage";
import JoinPage from "./components/Join/JoinPage";
import ErrorDisplay from "./components/ErrorPages/ErrorDisplay"; // Import the error display component

// Admin imports
import AdminDashboardPage from "./components/Admin/Dashboard/DashboardPage";
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import UserProtectedRoute from "./components/User/UserProtectedRoute";

import Layout from "./Layout";

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/theme-provider";

// Define the app with routes
const AppWithRoutes = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />} errorElement={<ErrorDisplay />}>
          {" "}
          {/* Add errorElement here */}
          <Route path="" element={<HomePage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="contests" element={<ContestsPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route
            path="resources/dynamic-programming"
            element={<DynamicProgrammingResource />}
          />
          <Route path="resources/cp-roadmap" element={<CPRoadmapResource />} />
          <Route path="resources/blog/:id" element={<BlogDetailPage />} />
          <Route path="resources/:id" element={<ResourceDetailPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route
            path="user/dashboard"
            element={
              <UserProtectedRoute>
                <DashboardPage />
              </UserProtectedRoute>
            }
          />
          <Route path="join" element={<JoinPage />} />
        </Route>
        <Route path="/admin" errorElement={<ErrorDisplay />}>
          {" "}
          {/* Add errorElement here */}
          {/* Redirect from admin login to main login */}
          <Route path="login" element={<Navigate to="/login" replace />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

const Root = () => {
  return (
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppWithRoutes />
      </ThemeProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<Root />);
