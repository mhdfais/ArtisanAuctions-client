import axios from "axios";

export const refreshToken = async (): Promise<boolean> => {
  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`,
      {},
      { withCredentials: true } 
    );
    return true;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return false;
  }
};