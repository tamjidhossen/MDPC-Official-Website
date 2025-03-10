// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./components/Home/HomePage";
import LeaderboardPage from "./components/Leaderboard/LeaderboardPage";
import ContestsPage from "./components/Contests/ContestsPage";
import ResourcesPage from "./components/Resources/ResourcesPage";
import BlogsPage from "./components/Blogs/BlogsPage";
import EventsPage from "./components/Events/EventsPage";
import LoginPage from "./components/User/LoginPage";
import RegisterPage from "./components/User/RegisterPage";
import DashboardPage from "./components/User/Dashboard/DashboardPage";
import DynamicProgrammingResource from "./components/Resources/DynamicProgrammingResource";
import CPRoadmapResource from "./components/Resources/CPRoadmapResource";


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
        <Route path="resources/dynamic-programming" element={<DynamicProgrammingResource />} />
        <Route path="resources/cp-roadmap" element={<CPRoadmapResource />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="user/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="/admin">
        {/* <Route path="register" element={<AdminRegister />} />
        <Route path="login" element={<AdminLogin />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);