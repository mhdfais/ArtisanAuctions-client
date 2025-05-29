import { AxiosInstance } from "axios";
import store from "@/redux/store/store";
import { logout } from "@/redux/store/authSlice";
import { adminLogout } from "@/redux/store/adminAuthSlice";

export const applyInterceptors = (
  api: AxiosInstance,
  role: "user" | "admin"
) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // if (!originalRequest) return Promise.reject(error);

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshUrl =
            role === "admin" ? "/admin/refresh" : "/auth/refresh";
          // console.log(refreshUrl)
          await api.get(refreshUrl, { withCredentials: true });

          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);

          if (role === "admin") {
            store.dispatch(adminLogout());
            window.location.href = "/admin/login";
          } else {
            store.dispatch(logout());
            window.location.href = "/login";
          }
        }
      }

      return Promise.reject(error);
    }
  );
};
