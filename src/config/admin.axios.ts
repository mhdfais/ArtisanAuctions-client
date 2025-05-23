import axios from "axios";
import { applyInterceptors } from "./interceptors";

const adminApi = axios.create({
  baseURL: "/api/admin",
  withCredentials: true,
});

applyInterceptors(adminApi, "admin");

export default adminApi;