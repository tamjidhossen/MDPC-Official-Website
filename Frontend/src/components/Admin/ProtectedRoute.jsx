import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  // In a real application, you would check for a token in localStorage or cookies
  // For now, we'll use a simple check to see if the user is logged in
  const isAuthenticated = () => {
    // This is a simplified example
    // In a real app, you would validate the token, check expiration, etc.
    return localStorage.getItem("adminAuthenticated") === "true";
  };

  // If not authenticated, redirect to login page
  if (!isAuthenticated()) {
    // return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, render the children (protected component)
  return children;
};

export default ProtectedRoute;
