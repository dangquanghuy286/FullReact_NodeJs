import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middlewares/socket.middlewares.js";
import { getUserConversationsForSocketIO } from "../controllers/conversation.controller.js";

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
// Apply socket authentication middleware
io.use(socketAuthMiddleware);

const onlineUser = new Map(); //{userId:socketId}
// Lắng nghe
io.on("connection", async (socket) => {
  const user = socket.user;
  console.log(`${user.displayName} connected with : ${socket.id}`);

  onlineUser.set(user._id, socket.id);

  io.emit("online-users", Array.from(onlineUser.keys()));

  const conversationIds = await getUserConversationsForSocketIO(user._id);

  conversationIds.forEach((id) => {
    socket.join(id);
  });

  socket.on("join-conversation", (conversationId) => {
    socket.join(conversationId);
  });
  // Tao phong theo userId de gui thong bao den user do khi co tin nhan moi
  socket.join(user._id.toString());
  socket.on("disconnect", () => {
    onlineUser.delete(user._id);
    io.emit("online-users", Array.from(onlineUser.keys()));
    console.log(`Socket disconnected : ${socket.id}`);
  });
});

export { io, app, server };
