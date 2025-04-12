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
import JoinPage from "./components/Join/JoinPage";

// Admin imports
import AdminLoginPage from "./components/Admin/LoginPage";
import AdminDashboardPage from "./components/Admin/Dashboard/DashboardPage";
import ProtectedRoute from "./components/Admin/ProtectedRoute";

import Layout from "./Layout";

import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<HomePage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="contests" element={<ContestsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route
          path="resources/dynamic-programming"
          element={<DynamicProgrammingResource />}
        />
        <Route path="resources/cp-roadmap" element={<CPRoadmapResource />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="user/dashboard" element={<DashboardPage />} />
        <Route path="join" element={<JoinPage />} />
      </Route>
      <Route path="/admin">
        <Route path="login" element={<AdminLoginPage />} />
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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
