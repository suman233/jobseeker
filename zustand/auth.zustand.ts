import { create } from "zustand";
import Cookies from "js-cookie";
import { accessTokenName } from "@/config/constants";
import { UserProfile } from "@/api/functions/user.api";

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  updateUser: (updatedFields: Partial<UserProfile>) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  isLoading: true,

  setAuth: (user: UserProfile, token: string) => {
    // Save to cookies for Next.js middleware / proxy support
    const cookieOptions = {
      expires: 7, // 7 days
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
    };
    Cookies.set(accessTokenName, token, cookieOptions);

    // Save to localStorage for browser persistence
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("userToken", token);
        localStorage.setItem("userData", JSON.stringify(user));
      } catch (err) {
        console.error("Failed to save auth to localStorage:", err);
      }
    }

    set({
      user,
      token,
      isLoggedIn: true,
      isLoading: false,
    });
  },

  updateUser: (updatedFields: Partial<UserProfile>) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updatedFields };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      } catch (err) {
        console.error("Failed to update user in localStorage:", err);
      }
    }

    set({ user: updatedUser });
  },

  logout: () => {
    // Remove cookie
    Cookies.remove(accessTokenName);

    // Remove from localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
      } catch (err) {
        console.error("Failed to clear localStorage on logout:", err);
      }
    }

    set({
      user: null,
      token: null,
      isLoggedIn: false,
      isLoading: false,
    });
  },

  initAuth: () => {
    if (typeof window === "undefined") return;

    try {
      const cookieToken = Cookies.get(accessTokenName);
      const localToken = localStorage.getItem("userToken");
      const localUserData = localStorage.getItem("userData");

      const token = cookieToken || localToken;

      if (token && localUserData) {
        const user = JSON.parse(localUserData) as UserProfile;
        // Make sure cookie is in sync if localToken was present
        if (!cookieToken && token) {
          Cookies.set(accessTokenName, token, {
            expires: 7,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });
        }
        set({
          user,
          token,
          isLoggedIn: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          token: null,
          isLoggedIn: false,
          isLoading: false,
        });
      }
    } catch (err) {
      console.error("Failed to initialize auth state:", err);
      set({
        user: null,
        token: null,
        isLoggedIn: false,
        isLoading: false,
      });
    }
  },
}));

export default useAuthStore;
