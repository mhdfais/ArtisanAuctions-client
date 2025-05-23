import { AxiosInstance } from "axios";
import store from "../redux/store/store";
import { logout } from "../redux/store/authSlice";
import useToast from "../hooks/useToast";

const {error}=useToast()

export const applyInterceptors = (
  api: AxiosInstance,
  role: "user" | "admin"
) => {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (err) => {
      const originalRequest = err.config;

      // checking if token expired or unauthorized
      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // attempt to refresh
          await api.get("/auth/refresh"); // backend refresh
          console.log('hhhhh')
          return api(originalRequest); // retry original request
        } catch (refreshError) {
          // on error what to do
          store.dispatch(logout())
          window.location.href = "/login";
          error('Error','Please login again...')

        }
      }

      return Promise.reject(error);
    }
  );
};
