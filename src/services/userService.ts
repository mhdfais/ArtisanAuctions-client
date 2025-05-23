import userApi from "@/config/user.axios";

export const getUserDetails = async () => {
  try {
    const response = await userApi.get("/users/getUserDetails");
    return response;
  } catch (error) {
    throw error || "Failed to get details";
  }
};

