import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  User,
  Settings,
  LogOut,
  BarChart2,
  PenTool,
  ChevronRight,
  PanelLeft,
  ShieldCheck,
} from "lucide-react";
import { cfUserProfile } from "./utils/ratingUtils";
import { useAuth } from "@/context/AuthContext";

const DashboardSidebar = ({
  activeSection,
  setActiveSection,
  isSidebarOpen,
  toggleSidebar,
}) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  const handleAdminDashboard = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div
      className={`border-r bg-card ${
        isSidebarOpen ? "w-64" : "w-16"
      } flex-shrink-0 transition-all duration-300 flex flex-col h-full`}
    >
      {/* Sidebar header with toggle */}
      <div className="p-4 border-b flex items-center justify-between">
        {isSidebarOpen ? (
          <>
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span className="font-semibold">{user?.name || "User"}</span>
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

      {/* Sidebar links - directly in a flex column, no ScrollArea */}
      <div className="flex-1 p-2 space-y-1 flex flex-col">
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

        {/* Admin Dashboard button - only visible if user is admin */}
        {isAdmin && isAdmin() && (
          <Button
            variant="default"
            className={`w-full justify-${
              isSidebarOpen ? "start" : "center"
            } mt-4`}
            onClick={handleAdminDashboard}
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            {isSidebarOpen && <span>Admin Dashboard</span>}
          </Button>
        )}

        {/* Push the logout button to the bottom with flex-grow */}
        <div className="flex-grow"></div>
      </div>

      {/* Logout button */}
      <div className="p-2 border-t mt-auto">
        <Button
          variant="ghost"
          className={`w-full justify-${
            isSidebarOpen ? "start" : "center"
          } text-red-500 hover:text-red-600 hover:bg-red-50`}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isSidebarOpen && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
