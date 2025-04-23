import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/utils";

// User Avatar and Dropdown - moved outside of the Navbar component
const UserMenuDropdown = ({ authUser, handleLogout, navigate }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src={getImageUrl(authUser?.avatar)} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {authUser?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{authUser?.name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {authUser?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/user/dashboard")}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-500 focus:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Theme toggle component - moved outside of Navbar component
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-md border border-input bg-background p-0 shadow-sm transition-colors hover:bg-accent"
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <div className="flex h-full w-full items-center justify-center">
        {/* Sun icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 transition-all ${
            isDark
              ? "scale-0 opacity-0"
              : "scale-100 opacity-100 text-amber-500"
          }`}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>

        {/* Moon icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute h-4 w-4 transition-all ${
            isDark
              ? "scale-100 opacity-100 text-indigo-300"
              : "scale-0 opacity-0"
          }`}
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>
    </button>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout, isAuthenticated } = useAuth();

  // Call isAuthenticated as a function to get the actual boolean value
  const userIsAuthenticated = isAuthenticated();

  const handleLogout = () => {
    logout(navigate);
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Leaderboard", path: "/leaderboard" },
    { title: "Contests", path: "/contests" },
    { title: "Events", path: "/events" },
    { title: "Resources", path: "/resources" },
    { title: "Join", path: "/join" },
    // { title: "Contact", path: "/contact" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return path !== "/" && location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo section - left side */}
          <div className="flex-shrink-0 pl-1">
            <Link to="/" className="flex items-center gap-2">
              <img src="/midday.png" alt="MDPC Logo" className="h-8 w-8" />
              <span className="hidden font-semibold lg:inline-block">MDPC</span>
              <span className="font-semibold lg:hidden">MDPC</span>
            </Link>
          </div>

          {/* Navigation links - center */}
          <div className="hidden md:flex md:items-center md:justify-center md:flex-1 mx-4">
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                    isActive(link.path)
                      ? "bg-accent text-foreground font-semibold"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions - right side */}
          <div className="flex items-center space-x-3 pr-1">
            <ThemeToggle />

            {/* Show avatar dropdown if authenticated, otherwise show login button */}
            {userIsAuthenticated ? (
              <UserMenuDropdown
                authUser={authUser}
                handleLogout={handleLogout}
                navigate={navigate}
              />
            ) : (
              <Button asChild size="sm" className="hidden md:inline-flex">
                <Link to="/login">Login</Link>
              </Button>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="mt-6 flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`text-base font-medium transition-colors py-2 ${
                          isActive(link.path)
                            ? "text-primary font-semibold"
                            : "text-foreground/70 hover:text-foreground"
                        }`}
                      >
                        {link.title}
                      </Link>
                    ))}

                    {/* Show dashboard and logout links in mobile menu if authenticated */}
                    {userIsAuthenticated ? (
                      <>
                        <div className="border-t pt-4 mt-2">
                          <Link
                            to="/user/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 text-base font-medium py-2"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                          <Button
                            variant="ghost"
                            className="w-full justify-start mt-2 text-red-500 hover:text-red-600 hover:bg-red-50 p-0"
                            onClick={() => {
                              setIsMenuOpen(false);
                              handleLogout();
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button asChild className="mt-4">
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                          Login
                        </Link>
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
