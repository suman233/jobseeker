"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/zustand/auth.zustand";
import { fetchUserProfileApi, UserProfile } from "@/api/functions/user.api";

export const useAuth = () => {
  const { user, token, isLoggedIn, isLoading, setAuth, updateUser, logout, initAuth } =
    useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const refreshProfile = useCallback(async () => {
    if (!token) return null;
    try {
      const res = await fetchUserProfileApi(token);
      if (res.status && res.user) {
        updateUser(res.user);
        return res.user;
      }
    } catch (err) {
      console.warn("Could not refresh user profile:", err);
    }
    return null;
  }, [token, updateUser]);

  const login = useCallback(
    (userData: UserProfile, authToken: string) => {
      setAuth(userData, authToken);
    },
    [setAuth]
  );

  return {
    user,
    token,
    isLoggedIn,
    isLoading,
    login,
    logout,
    refreshProfile,
    updateUser,
  };
};

export default useAuth;

