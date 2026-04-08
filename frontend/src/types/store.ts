import type { Socket } from "socket.io-client";
import type { Conversation, Message } from "./chat";
import type { Friend, FriendRequest, User } from "./user";

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
