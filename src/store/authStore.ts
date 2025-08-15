import type { NavigateFunction } from "react-router-dom";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosInstance from "../lib/axiosInstance";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

type User = {
  id: string;
  fullName: string;
  email: string;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
};

type AuthStore = {
  authUser: User | null;
  isSigningUp: boolean;
  isSigningIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  checkAuth: () => Promise<void>;
  signUp: (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
    navigate: NavigateFunction,
  ) => Promise<void>;
  signIn: (
    email: string,
    password: string,
    navigate: NavigateFunction,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfilePicture: (
    file: File,
    closeDialogButton: HTMLButtonElement | null,
  ) => Promise<void>;
  connectToSocket: () => void;
  disconnectFromSocket: () => void;
};

type Response = {
  success: boolean;
  message: string;
  data?: User;
};

const useAuthStore = create<AuthStore>()(
  devtools((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isSigningIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
      try {
        const { data } = await axiosInstance.get<Response>("/auth/get-user");

        set({ authUser: data.data });
        get().connectToSocket();
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.log(error.response?.data.message);
        }
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    signUp: async (fullName, email, password, confirmPassword, navigate) => {
      try {
        set({ isSigningUp: true });
        const { data } = await axiosInstance.post<Response>("/auth/signup", {
          fullName,
          email,
          password,
          confirmPassword,
        });

        if (data.success) {
          set({ authUser: data.data });
          toast.success(data.message);
          navigate("/");
          get().connectToSocket();
        } else {
          toast.error(data.message);
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
          return;
        }

        console.log(error);
        toast.error("Something went wrong");
      } finally {
        set({ isSigningUp: false });
      }
    },

    signIn: async (email, password, navigate) => {
      try {
        set({ isSigningIn: true });
        const { data } = await axiosInstance.post<Response>("/auth/signin", {
          email,
          password,
        });

        if (data.success) {
          set({ authUser: data.data });
          toast.success(data.message);
          navigate("/");
          get().connectToSocket();
        } else {
          toast.error(data.message);
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
          return;
        }

        console.log(error);
        toast.error("Something went wrong");
      } finally {
        set({ isSigningIn: false });
      }
    },

    signOut: async () => {
      try {
        await axiosInstance.delete("/auth/logout");
        set({ authUser: null });
        get().disconnectFromSocket();
        toast.success("Signed out successfully");
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
          console.log(error.response?.data);
        }
      }
    },

    updateProfilePicture: async (file, closeDialogButton) => {
      try {
        set({ isUpdatingProfile: true });

        const formData = new FormData();
        formData.append("profilePicture", file);

        const { data } = await axiosInstance.put<Response>(
          "/auth/update-user",
          formData,
        );

        if (data.success) {
          set({ authUser: data.data });
          toast.success(data.message);
          closeDialogButton?.click();
        } else {
          toast.error(data.message);
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
          return;
        }

        console.log(error);
        toast.error("Something went wrong");
      } finally {
        set({ isUpdatingProfile: false });
      }
    },

    connectToSocket: () => {
      const authUser = get().authUser;
      if (!authUser) return;

      const previousSocket = get().socket;
      if (previousSocket?.connected) return;

      const socket = io(import.meta.env.VITE_SOCKET_URL, {
        withCredentials: true,
        query: {
          userId: authUser.id,
        },
      });

      socket.on("connect", () => {
        console.log("Connected to socket");
        set({ socket });
      });

      socket.on("getOnlineUsers", (onlineUsers) => {
        console.log("Received online users:", onlineUsers);
        set({ onlineUsers });
      });

      socket.on("connect_error", (error) => {
        console.log("Error connecting to socket", error);
      });
    },

    disconnectFromSocket: () => {
      const socket = get().socket;
      if (!socket?.connected) return;

      socket.disconnect();
      set({ socket: null });
    },
  })),
);

export default useAuthStore;
