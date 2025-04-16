import { createContext, useContext, useState, useEffect } from "react";
import { userApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

// Create context
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to get user profile to check authentication status
        const response = await userApi.getProfile();
        if (response.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        // User is not authenticated - that's okay, just don't set the user
        console.log("User not authenticated: " + err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userApi.login({ email, password });

      if (response.success) {
        setUser(response.data.user);
        toast({
          title: "Login successful",
          description: "You have successfully logged in",
        });
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err.response?.data?.message || "Invalid credentials",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (navigate) => {
    setLoading(true);
    try {
      await userApi.logout();
      setUser(null);
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
      // Only navigate if the navigate function is provided
      if (navigate) {
        navigate("/");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An error occurred during logout",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === "admin";
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
