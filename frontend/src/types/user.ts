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
  avatarUrl?: string;
}
// Friend request
export interface FriendRequest {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}
