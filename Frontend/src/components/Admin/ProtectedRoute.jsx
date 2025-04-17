import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  // Show loading state if auth state is still being determined
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    // Redirect to the user login page (not admin login) if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  if (!isAdmin()) {
    // Redirect to user dashboard if authenticated but not admin
    return <Navigate to="/user/dashboard" replace />;
  }

  // If authenticated and admin, render the children (protected component)
  return children;
};

export default ProtectedRoute;
