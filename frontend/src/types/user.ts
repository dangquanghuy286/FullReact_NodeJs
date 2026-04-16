// Dinh nghia cac interface cho user
// User
export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  avatarURL?: string;
  bio?: string;
  phone?: string;
  createAt?: string;
  updateAt?: string;
}
// Friend
export interface Friend {
  _id: string;
  username: string;
  displayName: string;
  avatarURL?: string;
}
// Friend request
export interface FriendRequest {
  _id: string;
  from?: {
    _id: string;
    username: string;
    displayName: string;
    avatarURL?: string;
  };
  to?: {
    _id: string;
    username: string;
    displayName: string;
    avatarURL?: string;
  };
  message?: string;
  createAt: string;
  updateAt: string;
}
