import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  FileText,
  Users,
  Calendar,
  Trophy,
  Settings,
  Menu,
  ChevronLeft,
  ShieldCheck,
  ArrowLeft,
  BookOpen, // Added icon
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DashboardSidebar = ({
  activePage,
  setActivePage,
  userName = "Admin",
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Display actual user name if available
  const displayName = user?.name || userName;

  // Handle return to user dashboard
  const handleReturnToUserDashboard = () => {
    navigate("/user/dashboard");
  };

  const menuItems = [
    {
      id: "overview",
      name: "Overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      id: "blogs",
      name: "Blog Management",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "members",
      name: "Member Database",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "events",
      name: "Event Management",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      id: "contests",
      name: "Contest Management",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      // Added Resource Management
      id: "resources",
      name: "Resource Management",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: "registration",
      name: "Registration Settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      id: "admins",
      name: "Admin Management",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
  ];

  const handleMenuItemClick = (pageId) => {
    setActivePage(pageId);
    setIsMobileOpen(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Mobile sidebar
  const MobileNav = () => (
    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="px-2 py-6">
          <Link to="/admin" className="flex items-center mb-6">
            <img src="/midday.png" alt="MDPC Logo" className="h-8 w-8 mr-2" />
            <h2 className="text-lg font-bold">MDPC Admin</h2>
          </Link>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activePage === item.id ? "default" : "ghost"}
                className="justify-start"
                onClick={() => handleMenuItemClick(item.id)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {displayName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{displayName}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleReturnToUserDashboard}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Return to User Dashboard
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop sidebar
  const DesktopNav = () => (
    <aside
      className={cn(
        "fixed hidden md:flex flex-col h-screen border-r border-border bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center h-14 px-4 border-b">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="/midday.png" alt="MDPC Logo" className="h-7 w-7" />
          {!isCollapsed && <h2 className="font-bold text-lg">MDPC Admin</h2>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", isCollapsed && "rotate-180")}
          onClick={toggleCollapse}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 overflow-auto py-3 px-2">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activePage === item.id ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                isCollapsed && "justify-center px-2"
              )}
              onClick={() => handleMenuItemClick(item.id)}
            >
              {item.icon}
              {!isCollapsed && <span className="ml-2">{item.name}</span>}
            </Button>
          ))}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "justify-between gap-2"
          )}
        >
          <div
            className={cn("flex items-center gap-2", isCollapsed && "flex-col")}
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {displayName.charAt(0)}
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReturnToUserDashboard}
              className="ml-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Return to User Dashboard</span>
            </Button>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <MobileNav />
      <DesktopNav />
    </>
  );
};

export default DashboardSidebar;
