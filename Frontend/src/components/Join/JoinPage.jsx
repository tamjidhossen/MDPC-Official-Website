import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Upload, Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { memberApi } from "@/services/api";

// Form schema using Zod for validation
const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(11, { message: "Phone number must be at least 11 digits" })
    .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
  session: z.string().min(1, { message: "Session is required" }),
  roll: z.string().min(1, { message: "Roll number is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  codeforces: z.string().min(1, { message: "Codeforces handle is required" }),
  vjudge: z.string().min(1, { message: "Vjudge handle is required" }),
  photo: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: "Photo is required" })
    .refine((files) => files[0].size <= 2 * 1024 * 1024, {
      message: "Photo size should be less than 2MB",
    })
    .refine(
      (files) =>
        ["image/jpeg", "image/jpg", "image/png"].includes(files[0]?.type),
      { message: "Only .jpg, .jpeg, and .png formats are supported" }
    ),
});

const JoinPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      session: "",
      roll: "",
      department: "",
      codeforces: "",
      vjudge: "",
      photo: undefined,
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setValue("photo", e.target.files);

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("session", data.session);
      formData.append("roll", data.roll);
      formData.append("department", data.department);

      // Add programming handles as a nested object
      const programmingHandles = {
        codeforces: data.codeforces,
        vjudge: data.vjudge,
      };
      formData.append("programmingHandles", JSON.stringify(programmingHandles));

      // Add the photo
      if (data.photo && data.photo[0]) {
        formData.append("photo", data.photo[0]);
      }

      // Submit to the API
      const response = await memberApi.apply(formData);

      if (response.success) {
        // Show success toast
        toast.success("Membership application submitted successfully!");

        // Show thank you message
        setIsSubmitted(true);
      } else {
        toast.error(response.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit registration. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {!isSubmitted ? (
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-2xl md:text-3xl text-center text-primary">
              MDPC Membership Registration
            </CardTitle>
            <CardDescription className="text-center pt-2">
              Fill out the form below to join Mid Day Programming Club
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="your.email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="01XXXXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-4" />
                  <h3 className="font-medium">Academic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="session"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Session" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2020-21">2020-21</SelectItem>
                              <SelectItem value="2021-22">2021-22</SelectItem>
                              <SelectItem value="2022-23">2022-23</SelectItem>
                              <SelectItem value="2023-24">2023-24</SelectItem>
                              <SelectItem value="2024-25">2024-25</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="roll"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roll Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Roll" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CSE">CSE</SelectItem>
                              <SelectItem value="EEE">EEE</SelectItem>
                              <SelectItem value="Civil">Civil</SelectItem>
                              <SelectItem value="Architecture">
                                Architecture
                              </SelectItem>
                              <SelectItem value="Textile">Textile</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-4" />
                  <h3 className="font-medium">Coding Profile Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="codeforces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Codeforces Handle</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Codeforces username"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            <a
                              href="https://codeforces.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Create account if you don't have one
                            </a>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vjudge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vjudge Handle</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Vjudge username"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            <a
                              href="https://vjudge.net/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Create account if you don't have one
                            </a>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-4" />

                  <FormField
                    control={form.control}
                    name="photo"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Your Photo</FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full text-center cursor-pointer hover:border-primary/70 transition-colors">
                              <Input
                                {...fieldProps}
                                id="photo"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                className="hidden"
                                onChange={(e) => {
                                  handleImageChange(e);
                                }}
                              />
                              <label
                                htmlFor="photo"
                                className="cursor-pointer flex flex-col items-center"
                              >
                                {selectedImage ? (
                                  <div className="text-center">
                                    <img
                                      src={selectedImage}
                                      alt="Selected"
                                      className="w-32 h-32 object-cover rounded-md mx-auto mb-2"
                                    />
                                    <div className="flex items-center justify-center text-sm text-primary">
                                      <Check className="w-4 h-4 mr-1" /> Photo
                                      Selected
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                    <p className="text-sm font-medium">
                                      Click to upload a photo
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      PNG, JPG, JPEG (max 2MB)
                                    </p>
                                  </>
                                )}
                              </label>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 shadow-lg text-center">
          <CardHeader className="bg-green-50">
            <div className="mx-auto rounded-full bg-green-100 p-3 w-14 h-14 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl md:text-3xl text-center">
              Registration Complete!
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6 pb-8 px-6 md:px-10">
            <p className="text-lg mb-6">
              Thank you for registering with Mid Day Programming Club!
            </p>
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-6">
              <p className="text-amber-800 font-medium mb-2">Next Steps:</p>
              <p className="text-amber-700">
                Please pay the registration fee of{" "}
                <span className="font-bold">Tk 200</span> to your respective
                class representative to confirm your membership.
              </p>
            </div>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="mt-4"
            >
              Register Another Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JoinPage;
