import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RegistrationSettingsSection = () => {
  const { toast } = useToast();
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [registrationDate, setRegistrationDate] = useState({
    start: new Date(),
    end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  });
  const [registrationMessage, setRegistrationMessage] = useState(
    "Membership Registration is currently open. Join the MDPC to enhance your competitive programming skills!"
  );
  const [registrationDetails, setRegistrationDetails] = useState({
    title: "MDPC Membership Registration",
    fee: "500",
    maxMembers: "50",
    requirements:
      "- Valid student ID\n- Basic programming knowledge\n- Interest in competitive programming",
  });

  const toggleRegistration = (value) => {
    setIsRegistrationOpen(value);
    toast({
      title: value
        ? "Registration Status Updated"
        : "Registration Status Updated",
      description: value
        ? "Registration has been opened."
        : "Registration has been closed.",
    });
  };

  const handleDateSelect = (type, date) => {
    setRegistrationDate((prev) => ({
      ...prev,
      [type]: date,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = () => {
    // This would be where an API call would happen in the future
    const settings = {
      isRegistrationOpen,
      registrationDate,
      registrationMessage,
      registrationDetails,
    };
    console.log("Registration settings that would be saved:", settings);

    toast({
      title: "Settings Saved",
      description: "Registration settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Registration Settings
        </h2>
        <p className="text-muted-foreground">
          Manage club member registration settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registration Status</CardTitle>
          <CardDescription>
            Enable or disable new member registration for the Join page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="registration-toggle">
                Membership Registration
              </Label>
              <p className="text-sm text-muted-foreground">
                When enabled, new members can apply through the Join page
              </p>
            </div>
            <Switch
              id="registration-toggle"
              checked={isRegistrationOpen}
              onCheckedChange={toggleRegistration}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="registration-message">Registration Message</Label>
            <Textarea
              id="registration-message"
              value={registrationMessage}
              onChange={(e) => setRegistrationMessage(e.target.value)}
              placeholder="Message to display on the Join page"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registration Period</CardTitle>
          <CardDescription>
            Set the time period when registration will be available.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(registrationDate.start, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={registrationDate.start}
                    onSelect={(date) => handleDateSelect("start", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(registrationDate.end, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={registrationDate.end}
                    onSelect={(date) => handleDateSelect("end", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basic Settings</CardTitle>
          <CardDescription>
            Configure basic details for the membership registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="registration-fee">Registration Fee (BDT)</Label>
              <Input
                id="registration-fee"
                name="fee"
                type="number"
                value={registrationDetails.fee}
                onChange={handleInputChange}
                placeholder="e.g., 500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-members">Maximum Members</Label>
              <Input
                id="max-members"
                name="maxMembers"
                type="number"
                value={registrationDetails.maxMembers}
                onChange={handleInputChange}
                placeholder="Maximum number of members to accept"
              />
              <p className="text-xs text-muted-foreground">
                Set to 0 for unlimited registrations.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings} className="ml-auto">
            <Save className="mr-2 h-4 w-4" /> Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationSettingsSection;
