import type { Socket } from "socket.io-client";
import type { Conversation, Message } from "./chat";
import type { User } from "./user";

// Dinh nghia cac interface cho store
// Auth store
export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  clearState: () => void;
  signUp: (
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getProfile: () => Promise<void>;
  refresh: () => Promise<void>;
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
  reset: () => void;
  setActiveConversationId: (id: string | null) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;

  sendDirectMessage: (
    recipientId: string,
    content?: string,
    imgUrl?: string,
  ) => Promise<void>;
  sendGroupMessage: (
    conversationId: string,
    content?: string,
    imgUrl?: string,
  ) => Promise<void>;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}
