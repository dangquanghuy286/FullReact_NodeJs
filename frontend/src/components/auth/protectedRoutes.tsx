/* eslint-disable react-hooks/exhaustive-deps */
import { useAuthStore } from "@/stores/auth.store";
import { useShallow } from "zustand/react/shallow";
import React, { useEffect, useRef, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = () => {
  const { accessToken, user, loading, refresh, getProfile } = useAuthStore(
    useShallow((s) => ({
      accessToken: s.accessToken,
      user: s.user,
      loading: s.loading,
      refresh: s.refresh,
      getProfile: s.getProfile,
    })),
  );

  const [starting, setStarting] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      try {
        if (!accessToken) {
          await refresh();
        } else if (!user) {
          await getProfile();
        }
      } finally {
        setStarting(false);
      }
    };

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

  return <Outlet />;
};

export default ProtectedRoutes;
