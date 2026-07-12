import type { Socket } from "socket.io-client";
import type { Conversation, Message } from "./chat";
import type { Friend, FriendRequest, User } from "./user";

// Dinh nghia cac interface cho store
// Auth store
export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      code?: string;
    };
  };
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  clearState: () => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  googleSignIn: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  getProfile: () => Promise<void>;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
  // ─────────────────────────────────────────────
  // Forgot Password
  // ─────────────────────────────────────────────
  forgotSendOTP: (payload: {
    email?: string;
    username?: string;
  }) => Promise<void>;
  forgotVerifyOTP: (payload: {
    email?: string;
    username?: string;
    otp: string;
  }) => Promise<string>;
  forgotResetPassword: (
    resetToken: string,
    newPassword: string,
  ) => Promise<void>;
  // ─────────────────────────────────────────────
  // Recover Account
  // ─────────────────────────────────────────────
  recoverLoading: boolean;
  recoverVerifyOTP: (payload: {
    username: string;
    otp: string;
  }) => Promise<void>;
  recoverResendOTP: (payload: { username: string }) => Promise<void>;
  // ─────────────────────────────────────────────
  // Deactivate Account
  // ─────────────────────────────────────────────
  deactivateLoading: boolean;
  deactivateAccount: (password: string) => Promise<void>;
}
// Theme store
export interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

// Chat store
export interface ChatState {
  conversations: Conversation[];
  messages: Record<
    string,
    {
      items: Message[];
      hasMore: boolean;
      nextCursor: string | null; //Phan trang
    }
  >;
  activeConversationId: string | null;
  convoLoading: boolean;
  messageLoading: boolean;
  loading: boolean;
  reset: () => void;
  setActiveConversationId: (id: string | null) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;

  sendDirectMessage: (
    recipientId: string,
    content?: string,
    images?: File[],
  ) => Promise<void>;
  sendGroupMessage: (
    conversationId: string,
    content?: string,
    images?: File[],
  ) => Promise<void>;

  // Add message
  addMessage: (message: Message) => Promise<void>;

  // Update conversation
  updateConversation: (coversation: unknown) => void;

  // Update marketSeen
  markAsSeen: () => Promise<void>;

  addConvo: (convo: Conversation) => void;

  createConversation: (
    type: "direct" | "group",
    name: string,
    memberIds: string[],
  ) => Promise<void>;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface FriendState {
  friends: Friend[];
  loading: boolean;
  receivedList: FriendRequest[];
  sentList: FriendRequest[];
  searchByUserName: (username: string) => Promise<User | null>;
  addFriend: (to: string, message?: string) => Promise<string>;
  getAllFriendRequests: () => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  getFriends: () => Promise<void>;
}

export interface UserState {
  updateAvatarUrl: (formData: FormData) => Promise<void>;
  updateProfile: (payload: {
    displayName?: string;
    phone?: string;
    bio?: string;
  }) => Promise<{ user: User; message: string }>;
}
