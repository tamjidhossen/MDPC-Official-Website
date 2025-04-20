import React, { useState } from "react";
import { cn } from "@/lib/utils";
import DashboardSidebar from "./DashboardSidebar";
import OverviewSection from "./sections/OverviewSection";
import BlogManagementSection from "./sections/BlogManagementSection";
import MemberDatabaseSection from "./sections/MemberDatabaseSection";
import EventManagementSection from "./sections/EventManagementSection";
import ContestManagementSection from "./sections/ContestManagementSection";
import RegistrationSettingsSection from "./sections/RegistrationSettingsSection";
import AdminManagementSection from "./sections/AdminManagementSection";
import ResourceManagementSection from "./sections/ResourceManagementSection";
import { Toaster } from "@/components/ui/toaster";

const DashboardPage = () => {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Render the appropriate section based on activePage state
  const renderSection = () => {
    switch (activePage) {
      case "overview":
        return <OverviewSection setActivePage={setActivePage} />;
      case "blogs":
        return <BlogManagementSection />;
      case "resources":
        return <ResourceManagementSection />;
      case "members":
        return <MemberDatabaseSection />;
      case "events":
        return <EventManagementSection />;
      case "contests":
        return <ContestManagementSection />;
      case "registration":
        return <RegistrationSettingsSection />;
      case "admins":
        return <AdminManagementSection />;
      default:
        return <OverviewSection setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <DashboardSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        userName="Administrator"
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      {/* Main content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 overflow-auto",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {renderSection()}
        </div>
      </main>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default DashboardPage;
