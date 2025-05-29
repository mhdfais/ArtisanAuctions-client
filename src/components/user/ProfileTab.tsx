import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useFormik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import useToast from "@/hooks/useToast";
import { updatePassword, updateProfile } from "@/services/userService";

interface userDetail {
  name: string;
  email: string;
  bio: string;
  phone: string;
  profileImage: string;
}

interface Props {
  user: userDetail | null;
  setUser: React.Dispatch<React.SetStateAction<userDetail | null>>;
}

const ProfileTab = ({ user, setUser }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { success, error } = useToast();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      profileImage: null as File | null,
    },
    validationSchema: yup.object({
      name: yup.string().trim().required("Name is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("bio", values.bio);
      if (values.profileImage) {
        formData.append("profileImage", values.profileImage);
      }

      try {
        setIsProfileUpdating(true);
        await updateProfile(formData);
        success("Success", "Profile updated successfully");
        setUser((prev) => ({
          ...prev!,
          name: values.name,
          phone: values.phone,
          bio: values.bio,
          profileImage: previewImage || prev!.profileImage,
        }));
        setIsModalOpen(false);
      } catch (err) {
        error("Error", "Failed to update profile");
      } finally {
        setIsProfileUpdating(false);
      }
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("profileImage", file);
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      currentPassword: yup.string().required("Current password is required"),
      newPassword: yup
        .string()
        .min(6, "Password too short")
        .required("New password is required"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "Passwords must match")
        .required("Confirm your new password"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await updatePassword(values.currentPassword, values.newPassword);
        success("Success", "Password updated");
        resetForm();
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401) {
          error("Error", "Current password is incorrect");
        } else if (status === 400) {
          error("Error", "New password cannot be same as old password");
        } else {
          error("Error", "Failed to update password");
        }
      }
    },
  });

  if (!user) return (
    <div className="flex justify-center items-center py-12">
      <Progress value={30} className="w-64" />
    </div>
  );

  return (
    <>
      <TabsContent value="profile">
        <Card className="shadow-xl border-[#D6A85F]/20 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="mb-8">
              <h2 className="font-serif text-3xl font-bold text-gray-800 mb-2">
                Profile Settings
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#D6A85F] to-[#B8956A] rounded-full"></div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="relative">
                <img
                  src={
                    previewImage ||
                    user.profileImage ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#D6A85F]/30 shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#D6A85F]/20 to-transparent"></div>
              </div>
              <div className="text-center md:text-left space-y-3">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border border-[#D6A85F]/20">
                  <p className="text-gray-700">
                    <span className="font-semibold text-[#D6A85F]">Name:</span> {user.name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-[#D6A85F]">Email:</span> {user.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-[#D6A85F]">Phone:</span> {user.phone || "Not added"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-[#D6A85F]">Bio:</span> {user.bio || "Not added"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-[#D6A85F] to-[#E8B866] text-white font-medium px-6 py-3 rounded-lg hover:from-[#C19A56] hover:to-[#D6A85F] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Edit Details
              </button>
            </div>

            <hr className="my-8 border-[#D6A85F]/20" />

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-[#D6A85F]/20">
              <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Change Password</h3>
              <form
                onSubmit={passwordFormik.handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl"
              >
                <div className="col-span-1 md:col-span-2">
                  <Label className="text-gray-700 font-medium">Current Password</Label>
                  <Input
                    type="password"
                    name="currentPassword"
                    value={passwordFormik.values.currentPassword}
                    onChange={passwordFormik.handleChange}
                    className="mt-2 border-[#D6A85F]/30 focus:border-[#D6A85F] focus:ring-[#D6A85F]/20"
                  />
                  {passwordFormik.touched.currentPassword &&
                    passwordFormik.errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordFormik.errors.currentPassword}
                      </p>
                    )}
                </div>

                <div>
                  <Label className="text-gray-700 font-medium">New Password</Label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={passwordFormik.values.newPassword}
                    onChange={passwordFormik.handleChange}
                    className="mt-2 border-[#D6A85F]/30 focus:border-[#D6A85F] focus:ring-[#D6A85F]/20"
                  />
                  {passwordFormik.touched.newPassword &&
                    passwordFormik.errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordFormik.errors.newPassword}
                      </p>
                    )}
                </div>

                <div>
                  <Label className="text-gray-700 font-medium">Confirm Password</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={passwordFormik.values.confirmPassword}
                    onChange={passwordFormik.handleChange}
                    className="mt-2 border-[#D6A85F]/30 focus:border-[#D6A85F] focus:ring-[#D6A85F]/20"
                  />
                  {passwordFormik.touched.confirmPassword &&
                    passwordFormik.errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordFormik.errors.confirmPassword}
                      </p>
                    )}
                </div>

                <div className="md:col-span-2">
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-[#D6A85F] to-[#E8B866] hover:from-[#C19A56] hover:to-[#D6A85F] w-full py-3 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-[#D6A85F]/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-gray-800">Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4">
            <div>
              <Label className="text-gray-700 font-medium">Name</Label>
              <Input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="mt-2 border-[#D6A85F]/30 focus:border-[#D6A85F] focus:ring-[#D6A85F]/20"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <Label className="text-gray-700 font-medium">Phone</Label>
              <Input
                type="text"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                className="mt-2 border-[#D6A85F]/30 focus:border-[#D6A85F] focus:ring-[#D6A85F]/20"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-medium">Bio</Label>
              <Textarea
                name="bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
                className="mt-2 border-[#D6A85F]/30 focus:border-[#D6A85F] focus:ring-[#D6A85F]/20 min-h-[100px]"
              />
            </div>

            <div>
              <Label className="text-gray-700 font-medium">Profile Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 border-[#D6A85F]/30 focus:border-[#D6A85F] focus:ring-[#D6A85F]/20"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-3 w-20 h-20 rounded-full object-cover border-2 border-[#D6A85F]/30"
                />
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D6A85F] to-[#E8B866] hover:from-[#C19A56] hover:to-[#D6A85F] py-3 font-medium shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isProfileUpdating}
            >
              {isProfileUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileTab;
