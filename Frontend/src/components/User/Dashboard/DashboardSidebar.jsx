import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  User,
  Settings,
  LogOut,
  BarChart2,
  PenTool,
  ChevronRight,
  PanelLeft,
} from "lucide-react";
import { cfUserProfile } from "./utils/ratingUtils";

const DashboardSidebar = ({
  activeSection,
  setActiveSection,
  isSidebarOpen,
  toggleSidebar,
}) => {
  return (
    <div
      className={`border-r bg-card ${
        isSidebarOpen ? "w-64" : "w-16"
      } flex-shrink-0 transition-all duration-300`}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar header with toggle */}
        <div className="p-4 border-b flex items-center justify-between">
          {isSidebarOpen ? (
            <>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span className="font-semibold">{cfUserProfile.handle}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <PanelLeft className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="w-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Sidebar links */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <Button
              variant={activeSection === "overview" ? "secondary" : "ghost"}
              className={`w-full justify-${isSidebarOpen ? "start" : "center"}`}
              onClick={() => setActiveSection("overview")}
            >
              <Home className="h-4 w-4 mr-2" />
              {isSidebarOpen && <span>Overview</span>}
            </Button>
            <Button
              variant={activeSection === "profile" ? "secondary" : "ghost"}
              className={`w-full justify-${isSidebarOpen ? "start" : "center"}`}
              onClick={() => setActiveSection("profile")}
            >
              <User className="h-4 w-4 mr-2" />
              {isSidebarOpen && <span>CF Profile</span>}
            </Button>
            <Button
              variant={activeSection === "analytics" ? "secondary" : "ghost"}
              className={`w-full justify-${isSidebarOpen ? "start" : "center"}`}
              onClick={() => setActiveSection("analytics")}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              {isSidebarOpen && <span>Problem Analytics</span>}
            </Button>
            <Button
              variant={activeSection === "blogs" ? "secondary" : "ghost"}
              className={`w-full justify-${isSidebarOpen ? "start" : "center"}`}
              onClick={() => setActiveSection("blogs")}
            >
              <PenTool className="h-4 w-4 mr-2" />
              {isSidebarOpen && <span>Blog Writing</span>}
            </Button>
            <Button
              variant={activeSection === "settings" ? "secondary" : "ghost"}
              className={`w-full justify-${isSidebarOpen ? "start" : "center"}`}
              onClick={() => setActiveSection("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isSidebarOpen && <span>Settings</span>}
            </Button>
          </div>
        </ScrollArea>

        {/* Logout button */}
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            className={`w-full justify-${
              isSidebarOpen ? "start" : "center"
            } text-red-500 hover:text-red-600 hover:bg-red-50`}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isSidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
