import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme-provider";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Theme toggle component
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

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Leaderboard", path: "/leaderboard" },
    { title: "Contests", path: "/contests" },
    { title: "Events", path: "/events" },
    { title: "Resources", path: "/resources" },
    { title: "Join", path: "/join" },
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
              <span className="hidden font-semibold lg:inline-block">
              MDPC
              </span>
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
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link to="/login">Login</Link>
            </Button>

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
                    <Button asChild className="mt-4">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
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
