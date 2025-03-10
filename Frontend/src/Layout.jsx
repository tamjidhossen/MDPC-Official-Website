// To keep the header and footer same for every page.
// Outlet is used to render the child routes.
// Outlet is a placeholder for the child routes to render.

import Footer from "./components/Footer/Footer";
import Navbar from "./components/Header/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from "./components/ScrollToTop";

function Layout() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ScrollToTop />
      {/* Add the light beam and grid effects */}
      <div className="fixed left-0 top-0 -z-10 h-full w-full overflow-hidden">
        {/* Primary gradient blob - top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[-2] h-[400px] w-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.15),rgba(255,255,255,0))] blur-2xl opacity-70 dark:opacity-30" />

        {/* Secondary gradient blob - bottom right */}
        <div className="absolute bottom-[-100px] right-[-100px] z-[-2] h-[500px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(var(--secondary),0.25),rgba(255,255,255,0))] blur-3xl opacity-60 dark:opacity-20" />

        {/* Tertiary gradient blob - left center */}
        <div className="absolute top-1/3 -left-24 z-[-2] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(var(--accent),0.2),rgba(255,255,255,0))] blur-2xl opacity-60 dark:opacity-20" />

        {/* Light leak - diagonal streak */}
        <div className="absolute top-0 right-0 z-[-1] w-[calc(100%+200px)] h-[100px] rotate-[-35deg] translate-x-[-10%] translate-y-[80%] bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-80 dark:opacity-30 blur-xl" />

        {/* Soft ambient glow - smooth transitions */}
        <div className="absolute inset-0 z-[-3] bg-[radial-gradient(ellipse_at_top,rgba(var(--background),1),rgba(var(--background),0.7))]" />

        {/* Enhanced grid pattern - using existing grid but improved */}
        <div
          className="fixed inset-0 z-0 opacity-[0.08] dark:opacity-[0.15]"
          style={{
            backgroundImage: `
        linear-gradient(to right, rgba(var(--primary),0.3) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(var(--primary),0.3) 1px, transparent 1px)
      `,
            backgroundSize: "6rem 6rem",
          }}
        />

        {/* Subtle dot pattern overlay */}
        <div
          className="fixed inset-0 z-0 opacity-[0.04] dark:opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(rgba(var(--primary),0.5) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>
      <div className="flex flex-col min-h-screen">
        {" "}
        {/* Added flex container */}
        <Navbar />
        <main className="flex-grow">
          {" "}
          {/* Added flex-grow to main */}
          <Outlet />
        </main>
        <Toaster />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default Layout;
