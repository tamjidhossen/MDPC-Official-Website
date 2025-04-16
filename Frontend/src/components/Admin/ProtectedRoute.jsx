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

  // Check if user is authenticated and has admin role
  if (!user || !isAdmin()) {
    // Redirect to login page if not authenticated or not admin
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated and admin, render the children (protected component)
  return children;
};

export default ProtectedRoute;
