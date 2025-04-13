"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import DashboardSidebar from "./DashboardSidebar";
import OverviewSection from "./sections/OverviewSection";
import BlogManagementSection from "./sections/BlogManagementSection";
import MemberDatabaseSection from "./sections/MemberDatabaseSection";
import EventManagementSection from "./sections/EventManagementSection";
import ContestManagementSection from "./sections/ContestManagementSection";
import RegistrationSettingsSection from "./sections/RegistrationSettingsSection";
import { Toaster } from "@/components/ui/sonner";

const DashboardPage = () => {
  const [activePage, setActivePage] = useState("overview");

  // Render the appropriate section based on activePage state
  const renderSection = () => {
    switch (activePage) {
      case "overview":
        return <OverviewSection />;
      case "blogs":
        return <BlogManagementSection />;
      case "members":
        return <MemberDatabaseSection />;
      case "events":
        return <EventManagementSection />;
      case "contests":
        return <ContestManagementSection />;
      case "registration":
        return <RegistrationSettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="h-screen bg-background flex">
      <DashboardSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        userName="Administrator"
      />

      {/* Main content */}
      <main className="flex-1 transition-all duration-300">
        <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
          {renderSection()}
        </div>
      </main>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default DashboardPage;
