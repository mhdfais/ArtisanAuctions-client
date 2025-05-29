import axios from "axios";
import { applyInterceptors } from "./interceptors";

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  withCredentials: true,
});

applyInterceptors(adminApi, "admin");

export default adminApi;