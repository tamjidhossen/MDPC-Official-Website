// filepath: /home/tamjid/Codes/Projects/Mid Day Website/MDPC-Official-Website-Frontend/Frontend/src/components/User/UserProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading state if auth state is still being determined
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login page if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected component
  return children;
};

export default UserProtectedRoute;
