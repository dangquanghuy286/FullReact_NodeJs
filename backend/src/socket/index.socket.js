import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middlewares/socket.middlewares.js";

const app = express();
// Tạo một HTTP server và dùng app (Express) để xử lý các request từ client.
const server = http.createServer(app);
// Tạo Socket.IO server và cho phép frontend kết nối realtime từ domain CLIENT_URL.
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
// Sử dụng
io.use(socketAuthMiddleware);
// Lắng nghe
io.on("connection", async (socket) => {
  const user = socket.user;
  console.log(`${user.displayName} connected with : ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected : ${socket.id}`);
  });
});

export { io, app, server };
