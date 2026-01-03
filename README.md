# 💬 FullReact_NodeJs – Realtime Chat Application

A **fullstack realtime chat application** built with **Node.js, React, TypeScript, Socket.IO, and MongoDB**, featuring a modern and clean UI using **Tailwind CSS + shadcn/ui**.

---

## ✨ Features

* 💬 **Realtime messaging** powered by Socket.IO
* 😀 **Rich emoji support**
* 📎 **Send images & file attachments**
* 👥 **One-to-one & group chats**
* 🔔 **Instant realtime notifications**
* 🔐 **Authentication & authorization** with JWT
* 🕒 **Message timestamps**
* 📧 **Email service** (account verification & notifications)
* 👤 **User profile management**
* 🔍 **Fast user search**
* ✅ **Realtime online / offline status**

---

## 🛠 Tech Stack

### Frontend

* **React 18** with TypeScript
* **Tailwind CSS** – Utility-first CSS framework
* **shadcn/ui** – Modern UI component library
* **Zustand / Context API** – State management
* **Socket.IO Client** – Realtime communication

### Backend

* **Node.js** + **Express.js**
* **Socket.IO** – WebSocket-based realtime engine
* **TypeScript** – Type-safe development

### Database

* **MongoDB** with **Mongoose ODM**
* Optimized schema design for chat applications

### Authentication & Security

* **JWT** (JSON Web Tokens)
* **bcrypt** – Password hashing
* HTTP-only cookies

### Email Service

* **Nodemailer** – Email verification & notifications

### Others

* **RESTful API** architecture
* **CORS** configuration
* **dotenv** for environment variables

---



## 🚀 Installation & Setup

### System Requirements

* **Node.js** >= 16.x
* **MongoDB** >= 5.x
* **npm** or **yarn**

---

### 1️⃣ Clone the repository

```bash
git clone https://github.com/dangquanghuy286/FullReact_NodeJs.git
cd FullReact_NodeJs
```

---

## 🔧 Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5001
MONGO_URL=mongodb+srv://huydang280603:OJH9PkGhTu1WZfIJ@cluster0.gqoflmu.mongodb.net/fullStack
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
ACCESS_TOKEN=your_accesstoken

# Frontend URL
CLIENT_URL=http://localhost:5173
```

Run the backend server:

```bash
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

---

## 🎨 Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 📝 API Endpoints

### Authentication
* `POST /api/auth/signup` – Register a new account
* `POST /api/auth/signin` – Login
* `POST /api/auth/signout` – Logout
* `GET /api/auth/refresh` – RefreshToken

### User
* `GET /api/user/profile` – Get Profile

### Friend
* `POST /api/friend/requests` – Add RequestFriend
* `POST /api/friend/requests/:requestId/accept` – Accept RequestFriend
* `POST /api/friend/requests/:requestId/decline` – Decline RequestFriend

### Messages
* `POST /api/messages/direct` – Fetch messages
* `POST /api/messages/group` – Fetch messages

### Conversations

* `GET /api/conversation` – Get conversations
* `POST /api/conversation` – Create a conversation
* `GET /api/conversation/:conversationId/messages` – Conversation details

---

## 🔌 Socket.IO Events

### Client → Server

* `join_room` – Join chat room
* `send_message` – Send message
* `typing` – User is typing
* `stop_typing` – Stop typing

### Server → Client

* `receive_message` – Receive new message
* `user_typing` – User typing indicator
* `user_online` – User online
* `user_offline` – User offline

---

## 🎨 UI Components (shadcn/ui)

* Button, Input, Textarea
* Dialog, Sheet, Popover
* Avatar, Badge, Card
* Dropdown Menu, Toast
* ScrollArea, Separator
* And more...

---

## 📸 Screenshots

*(Add application screenshots here)*

---


## 👨‍💻 Author

**Đặng Hữu Quang Huy**

