import userApi from "@/config/user.axios";
import { IUserProfileUpdate } from "@/types/Types";

export const getUserDetails = async () => {
  try {
    const response = await userApi.get("/users/getUserDetails");
    return response;
  } catch (error) {
    throw error || "Failed to get details";
  }
};

export const logoutUser = async () => {
  try {
    const response = await userApi.post("/auth/logout");
    return response;
  } catch (error) {
    throw error || "Failed to logout";
  }
};

export const updateProfile = async (formData: FormData) => {
  try {
    const response = await userApi.put("/users/updateProfile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error || "Failed to update Profile";
  }
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const response = await userApi.put("/users/updatePassword", {
      currentPassword,
      newPassword,
    });
    return response
  } catch (error) {
    throw error || "Failed to update Password";
  }
};
