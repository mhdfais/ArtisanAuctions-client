import { api } from "../config/auth.axios";
import { LoginFormData, RegisterData } from "../types/Types";

export const sentOtp = async (email: string) => {
  try {
    const response = await api.post("/auth/sentOtp", { email });
    return response;
  } catch (error: any) {
    throw error || "otp not sent";
  }
};

export const verifyOtp = async (otp: string) => {
  try {
    const response = await api.post("/auth/verifyOtp", { otp });
    return response;
  } catch (error: any) {
    throw error || "failed to verify otp";
  }
};

export const registerUser = async (FormData: RegisterData) => {
  try {
    const response = await api.post("/auth/registerUser", FormData);
    return response;
  } catch (error: any) {
    throw error || "failed to register user";
  }
};

export const findByEmailAndSentOtp = async (email: string) => {
  try {
    const response = await api.post("/auth/findByEmailAndSentOtp", {
      email,
    });
    return response;
  } catch (error) {
    throw error || "Failed to sent OTP";
  }
};

export const resetPassword = async (newPassword: string, email: string) => {
  try {
    const response = await api.post("/auth/resetPassword", {
      newPassword,
      email,
    });
    return response;
  } catch (error) {
    throw error || "Failed to reset password";
  }
};

export const loginUser = async (data: LoginFormData) => {
  try {
    const response = await api.post("/auth/login", data);
    return response;
  } catch (error) {
    throw error || "Failed to login user";
  }
};

