import { io } from "socket.io-client";

export const socket = io(`${import.meta.env.VITE_BACKEND_URL}/auction`, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 5000,
});

socket.connect();
