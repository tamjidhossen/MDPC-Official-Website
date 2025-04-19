import React from "react";
import { useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";

function ErrorDisplay() {
  const error = useRouteError();
  console.error("Routing Error:", error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <h1 className="text-4xl font-bold text-destructive mb-4">
        Oops! Something went wrong.
      </h1>
      <p className="text-lg text-muted-foreground mb-2">
        We encountered an unexpected error. Please try refreshing the page.
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        <i>{error.statusText || error.message || "Unknown error"}</i>
      </p>
      <Button onClick={() => window.location.reload()}>Refresh Page</Button>
      {/* Optionally, add a link to go back home */}
      {/* <Button variant="link" onClick={() => window.location.href = '/'}>Go Home</Button> */}
    </div>
  );
}

export default ErrorDisplay;
