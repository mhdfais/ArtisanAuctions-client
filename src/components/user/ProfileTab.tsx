import { useEffect, useState } from "react";
import { TabsContent } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import useToast from "@/hooks/useToast";
import {
  getUserDetails,
  updatePassword,
  updateProfile,
} from "@/services/userService";
import { useFormik } from "formik";
import * as yup from "yup";

interface userDetail {
  name: string;
  email: string;
  bio: string;
  phone: string;
  profileImage: string;
}

const ProfileTab = () => {
  const [user, setUser] = useState<userDetail | null>(null);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { success, error } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      setUserDetailLoading(true);
      try {
        const userDetails = await getUserDetails();
        setUser(userDetails.data.user);
      } catch (err) {
        error("Error", "Failed to fetch user details");
      } finally {
        setUserDetailLoading(false);
      }
    };

    fetchUser();
  }, []);

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
        setIsProfileUpdating(false);
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
      currentPassword: yup
        .string()
        .trim()
        .required("Current password is required"),
      newPassword: yup
        .string()
        .trim()
        .min(6, "Password too short")
        .required("New password is required"),
      confirmPassword: yup
        .string()
        .trim()
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

  return (
    <>
      <TabsContent value="profile">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-2xl font-medium mb-4">
              Profile Settings
            </h2>
            <p className="text-gray-600 mb-6">
              Update your personal information and preferences.
            </p>

            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">
                Profile photo
              </label>
              <img
                src={
                  userDetailLoading
                    ? "Loading..."
                    : user?.profileImage ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div>
                <label className="block text-sm font-medium mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  defaultValue={user?.name}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
                  defaultValue={user?.email}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="Not added"
                  className="w-full p-2 border rounded-md"
                  disabled
                  defaultValue={user?.phone}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  placeholder="Not added"
                  rows={4}
                  disabled
                  defaultValue={user?.bio}
                />
              </div>

              <div className="pt-4 mb-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#D6A85F] text-white hover:bg-[#de9f40] px-4 py-2 rounded-md"
                >
                  Edit Details
                </button>
              </div>
            </div>
            <hr />
            <h2 className="font-serif text-2xl font-medium mb-4 mt-4">
              Update Password
            </h2>
            <form onSubmit={passwordFormik.handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Current password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordFormik.values.currentPassword}
                  onChange={passwordFormik.handleChange}
                  placeholder="enter your current password"
                  className="w-full p-2 border rounded-md"
                />
                {passwordFormik.touched.currentPassword &&
                  passwordFormik.errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordFormik.errors.currentPassword}
                    </p>
                  )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  New password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordFormik.values.newPassword}
                  onChange={passwordFormik.handleChange}
                  placeholder="enter your new password"
                  className="w-full p-2 border rounded-md"
                />
                {passwordFormik.touched.newPassword &&
                  passwordFormik.errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordFormik.errors.newPassword}
                    </p>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordFormik.values.confirmPassword}
                  onChange={passwordFormik.handleChange}
                  placeholder="confirm new password"
                  className="w-full p-2 border rounded-md"
                />
                {passwordFormik.touched.confirmPassword &&
                  passwordFormik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordFormik.errors.confirmPassword}
                    </p>
                  )}
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-[#D6A85F] text-white hover:bg-[#de9f40] px-4 py-2 rounded-md"
                >
                  Change Password
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* edit modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={
                  previewImage ||
                  user?.profileImage ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div>
                <label className="block text-sm font-medium mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="w-full p-2 border rounded-md"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
                className="w-full p-2 border rounded-md"
                rows={4}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#D6A85F] text-white hover:bg-[#de9f40] px-4 py-2 rounded-md"
              >
                {isProfileUpdating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileTab;
