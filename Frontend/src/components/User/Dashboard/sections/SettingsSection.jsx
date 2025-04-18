import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cfUserProfile } from "../utils/ratingUtils";
import { useAuth } from "@/context/AuthContext";
import { userApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const SettingsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
  });

  const [programmingHandles, setProgrammingHandles] = useState({
    codeforces: cfUserProfile?.handle || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
      });

      if (user.programmingHandles) {
        setProgrammingHandles({
          codeforces:
            user.programmingHandles.codeforces || cfUserProfile?.handle || "",
        });
      }
    }
  }, [user]);

  // Handle avatar file change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile data change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle programming handles change
  const handleHandleChange = (e) => {
    const { name, value } = e.target;
    setProgrammingHandles((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password data change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manually refresh user data
  const refreshUserData = async () => {
    try {
      const response = await userApi.getProfile();
      if (response.success) {
        // We can't update the context directly, but we can show success message
        // The user will see updated data on page refresh
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      return false;
    }
  };

  // Update profile
  const handleProfileUpdate = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      // Create form data to handle file upload
      const formData = new FormData();
      formData.append("name", profileData.name);

      // Add programming handles as JSON
      formData.append(
        "programmingHandles",
        JSON.stringify(
          Object.fromEntries(
            Object.entries(programmingHandles).filter(
              ([_, value]) => value !== ""
            )
          )
        )
      );

      // Add avatar if changed
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      // Call API to update profile
      const response = await userApi.updateProfile(formData);

      if (response.success) {
        toast({
          title: "Profile Updated",
          description:
            "Your profile has been updated successfully. Changes will appear after page refresh.",
        });

        // Try to refresh user data
        await refreshUserData();

        // Reset avatar file state if it was included
        if (avatarFile) {
          setAvatarFile(null);
          // Keep the preview to show the user their current avatar
        }
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update avatar
  const handleAvatarUpdate = async () => {
    if (!avatarFile) return;

    setAvatarLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const response = await userApi.updateProfile(formData);

      if (response.success) {
        toast({
          title: "Avatar Updated",
          description:
            "Your profile picture has been updated. It will appear after page refresh.",
        });

        // Try to refresh user data
        await refreshUserData();

        // Reset avatar file state but keep the preview
        setAvatarFile(null);
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Failed to update avatar. Please try again.",
        });
      }
    } catch (error) {
      console.error("Avatar update error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  // Change password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await userApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        toast({
          title: "Password Changed",
          description: "Your password has been updated successfully.",
        });

        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description:
            "Failed to change password. Please check your current password.",
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={
                    avatarPreview ||
                    getImageUrl(user?.avatar) ||
                    cfUserProfile?.avatar
                  }
                  alt={user?.name || cfUserProfile?.handle}
                />
                <AvatarFallback>
                  {(
                    user?.name?.[0] ||
                    cfUserProfile?.handle?.[0] ||
                    "U"
                  ).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload">
                  <Button size="sm" className="w-full" asChild>
                    <span>Change Avatar</span>
                  </Button>
                </label>
                {avatarFile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAvatarUpdate}
                    disabled={avatarLoading}
                  >
                    {avatarLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                )}
              </div>
            </div>

            <form
              onSubmit={handleProfileUpdate}
              className="flex-1 space-y-4 w-full"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact an administrator if needed.
                </p>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile Changes"
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Handles</CardTitle>
          <CardDescription>
            Connect your competitive programming accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Codeforces Handle</label>
            <Input
              name="codeforces"
              value={programmingHandles.codeforces}
              onChange={handleHandleChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleProfileUpdate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Handles"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password & Security</CardTitle>
          <CardDescription>
            Update your password and security settings
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Confirm New Password
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SettingsSection;
