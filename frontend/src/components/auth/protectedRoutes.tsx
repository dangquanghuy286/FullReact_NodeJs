import { useAuthStore } from "@/stores/auth.store";
import React from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = () => {
  const { accessToken, user, loading } = useAuthStore();
  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet></Outlet>;
};

export default ProtectedRoutes;
