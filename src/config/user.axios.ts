import axios from "axios";
import { applyInterceptors } from "./interceptors";

const userApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  withCredentials: true,
});

applyInterceptors(userApi, "user");

export default userApi;