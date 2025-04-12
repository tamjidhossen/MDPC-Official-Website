import React from "react";
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
import { Switch } from "@/components/ui/switch";
import { cfUserProfile } from "../utils/ratingUtils";

const SettingsSection = () => {
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
                  src={cfUserProfile.avatar}
                  alt={cfUserProfile.handle}
                />
                <AvatarFallback>
                  {cfUserProfile.handle[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <Button size="sm">Change Avatar</Button>
                <Button variant="outline" size="sm">
                  Remove Photo
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input defaultValue="Ahmed Khan" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input defaultValue="ahmed@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea defaultValue="Competitive programmer and algorithm enthusiast. I love solving challenging problems and sharing knowledge with the CP community." />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
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
            <Input defaultValue={cfUserProfile.handle} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">AtCoder Handle</label>
            <Input placeholder="Enter your AtCoder handle" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">LeetCode Handle</label>
            <Input placeholder="Enter your LeetCode handle" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">SPOJ Handle</label>
            <Input placeholder="Enter your SPOJ handle" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Update Handles</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password & Security</CardTitle>
          <CardDescription>
            Update your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input type="password" placeholder="Enter your current password" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input type="password" placeholder="Confirm new password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Change Password</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Manage how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about contests via email
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Upcoming Contest Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Get reminded about contests you've registered for
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Blog Comment Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when someone comments on your blog
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Preferences</Button>
        </CardFooter>
      </Card>

      <Card className="border-destructive/10 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;
