import { useAuthStore } from "@/stores/auth.store";
import React from "react";

const ChatAppPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      ChatAppPage
      <br />
      User: {user?.username}
    </div>
  );
};

export default ChatAppPage;
