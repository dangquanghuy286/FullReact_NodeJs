/* eslint-disable react-hooks/exhaustive-deps */
import { useAuthStore } from "@/stores/auth.store";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = () => {
  const { accessToken, user, loading, refresh, getProfile } = useAuthStore();
  const [starting, setStarting] = useState(true);
  const init = async () => {
    // Có thể xảy ra khi refresh trang
    if (!accessToken) {
      await refresh();
    }
    if (accessToken && !user) {
      await getProfile();
    }
    setStarting(false);
  };
  useEffect(() => {
    init();
  }, []);

  if (loading || starting) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500">
          {""}
        </div>
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet></Outlet>;
};

export default ProtectedRoutes;
