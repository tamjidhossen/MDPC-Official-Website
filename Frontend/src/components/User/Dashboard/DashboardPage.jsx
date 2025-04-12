// src/components/User/Dashboard/DashboardPage.jsx
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import all the separate components
import DashboardSidebar from "./DashboardSidebar";
import OverviewSection from "./sections/OverviewSection";
import ProfileSection from "./sections/ProfileSection";
import AnalyticsSection from "./sections/AnalyticsSection";
import BlogsSection from "./sections/BlogsSection";
import SettingsSection from "./sections/SettingsSection";

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  // Hide footer in dashboard
  useEffect(() => {
    // Hide footer when component mounts
    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.display = "none";
    }

    // Show footer when component unmounts
    return () => {
      if (footer) {
        footer.style.display = "";
      }
    };
  }, []);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Render the current section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection setActiveSection={setActiveSection} />;
      case "profile":
        return <ProfileSection setActiveSection={setActiveSection} />;
      case "analytics":
        return <AnalyticsSection />;
      case "blogs":
        return <BlogsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <OverviewSection setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content */}
      <ScrollArea className="flex-1 flex justify-center">
        <div className="container py-6 px-4 md:px-6 max-w-7xl mx-auto">
          {renderSectionContent()}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DashboardPage;
