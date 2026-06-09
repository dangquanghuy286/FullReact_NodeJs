# 💬 FullReact_NodeJs – Realtime Chat Application

A **fullstack realtime chat application** built with **Node.js, React, TypeScript, Socket.IO, and MongoDB**, featuring a modern and clean UI using **Tailwind CSS + shadcn/ui**, with full **internationalization (i18n)** support.

---

## ✨ Features

* 💬 **Realtime messaging** powered by Socket.IO
* 😀 **Rich emoji support**
* 📎 **Send images & file attachments**
* 👥 **One-to-one & group chats**
* 🔔 **Instant realtime notifications**
* 🔐 **Authentication & authorization** with JWT
* 🕒 **Message timestamps**
* 📧 **Email service** (account verification & notifications via Nodemailer)
* 👤 **User profile management**
* 🔍 **Fast user search**
* ✅ **Realtime online / offline status**
* 🌍 **Multi-language support** via i18n (Vietnamese & English)

---

## 🛠 Tech Stack

### Frontend

* **React 18** with TypeScript
* **Tailwind CSS** – Utility-first CSS framework
* **shadcn/ui** – Modern UI component library
* **Zustand / Context API** – State management
* **Socket.IO Client** – Realtime communication
* **i18next + react-i18next** – Internationalization (i18n)

### Backend

* **Node.js** + **Express.js**
* **Socket.IO** – WebSocket-based realtime engine
* **TypeScript** – Type-safe development
* **i18next** – Server-side i18n for email templates & API messages

### Database

* **MongoDB** with **Mongoose ODM**
* Optimized schema design for chat applications

### Authentication & Security

* **JWT** (JSON Web Tokens)
* **bcrypt** – Password hashing
* HTTP-only cookies

### Email Service

* **Nodemailer** – Email verification & notifications
* HTML email templates with multi-language support (i18n)
* Supports Gmail / SMTP providers

### Internationalization (i18n)

* **i18next** – Core i18n framework (frontend & backend)
* **react-i18next** – React bindings
* **i18next-browser-languagedetector** – Auto-detect browser language
* **i18next-http-backend** – Lazy-load translation files
* Supported languages: 🇻🇳 Vietnamese, 🇺🇸 English

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

# Nodemailer (Email Service)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM="FullChat App <your_email@gmail.com>"

# i18n
DEFAULT_LANGUAGE=vi
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
VITE_DEFAULT_LANGUAGE=vi
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

## 🌍 Internationalization (i18n)

Translation files are located at `client/public/locales/`:

```
public/
  locales/
    en/
      translation.json
    vi/
      translation.json
```

Example `translation.json`:

```json
{
  "auth": {
    "login": "Đăng nhập",
    "register": "Đăng ký",
    "logout": "Đăng xuất"
  },
  "chat": {
    "placeholder": "Nhập tin nhắn...",
    "send": "Gửi"
  },
  "email": {
    "verifySubject": "Xác minh tài khoản của bạn",
    "verifyBody": "Nhấn vào liên kết để xác minh tài khoản."
  }
}
```

To switch language programmatically:

```typescript
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();
i18n.changeLanguage('en'); // or 'vi'
```

---

## 📧 Email Service (Nodemailer)

Nodemailer is used for:

* ✅ Account verification emails
* 🔑 Password reset emails
* 🔔 Chat notifications (optional)

Email templates support i18n and are rendered as HTML.

Example usage in backend:

```typescript
import transporter from './mailer';
import i18next from 'i18next';

await transporter.sendMail({
  from: process.env.MAIL_FROM,
  to: user.email,
  subject: i18next.t('email.verifySubject'),
  html: `<p>${i18next.t('email.verifyBody')}</p>`,
});
```

> ⚠️ For Gmail, you must enable **App Password** in your Google account settings.

---

## 📝 API Endpoints

### Authentication

* `POST /api/auth/signup` – Register a new account
* `POST /api/auth/signin` – Login
* `POST /api/auth/signout` – Logout
* `GET /api/auth/refresh` – RefreshToken
* `POST /api/auth/verify-email` – Verify email via token
* `POST /api/auth/forgot-password` – Send password reset email
* `POST /api/auth/reset-password` – Reset password

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
