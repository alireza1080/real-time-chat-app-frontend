import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "sonner";
import { AxiosError } from "axios";
import useAuthStore from "./authStore";

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  id: string;
  fullName: string;
  email: string;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ChatStore = {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSendingMessage: boolean;
  showOnlyOnlineUsers: boolean;

  getUsers: () => Promise<void>;
  getMessages: (id: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  sendMessage: (
    text: string,
    setText: React.Dispatch<React.SetStateAction<string>>,
    image: File | null,
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
    setImagePreview: React.Dispatch<React.SetStateAction<string | null>>,
    adjustHeight: (reset?: boolean) => void,
  ) => Promise<void>;
  setShowOnlyOnlineUsers: () => void;
  subscribeToNewMessages: () => Promise<void>;
  unsubscribeFromNewMessages: () => Promise<void>;
};

type Response<T> = {
  success: boolean;
  message: string;
  data?: T;
};

const useChatStore = create<ChatStore>()(
  devtools((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSendingMessage: false,
    showOnlyOnlineUsers: false,

    getUsers: async () => {
      try {
        set({ isUsersLoading: true });
        const { data } =
          await axiosInstance.get<Response<User[]>>("/messages/users");

        set({ users: data.data });
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          return toast.error(error.response?.data.message);
        }
        console.log(error);
      } finally {
        set({ isUsersLoading: false });
      }
    },

    getMessages: async (id: string) => {
      try {
        set({ isMessagesLoading: true });
        const { data } = await axiosInstance.get<Response<Message[]>>(
          `/messages/${id}`,
        );

        set({ messages: data.data });
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          return toast.error(error.response?.data.message);
        }
        console.log(error);
      } finally {
        set({ isMessagesLoading: false });
      }
    },

    setSelectedUser: (user) => {
      set({ selectedUser: user });
    },

    sendMessage: async (
      text,
      setText,
      image,
      setImage,
      setImagePreview,
      adjustHeight,
    ) => {
      try {
        set({ isSendingMessage: true });

        const selectedUser = get().selectedUser;

        if (!selectedUser) {
          return toast.error("No user selected");
        }

        if (!text && !image) {
          return toast.error("Either text or image is required");
        }

        const formData = new FormData();
        formData.append("text", text);
        if (image) {
          formData.append("image", image);
        }

        const { data } = await axiosInstance.post<Response<Message>>(
          `/messages/send/${selectedUser?.id}`,
          formData,
        );

        const messages = get().messages;

        set({ messages: [...messages, data.data as Message] });
        setText("");
        setImage(null);
        setImagePreview(null);
        adjustHeight(true);

        toast.success("Message sent successfully");
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          return toast.error(error.response?.data.message);
        }
        console.log(error);
      } finally {
        set({ isSendingMessage: false });
      }
    },

    setShowOnlyOnlineUsers: () => {
      const showOnlyOnlineUsers = get().showOnlyOnlineUsers;
      set({ showOnlyOnlineUsers: !showOnlyOnlineUsers });
    },

    subscribeToNewMessages: () => {
      const selectedUser = get().selectedUser;

      if (!selectedUser) {
        return null;
      }

      const socket = useAuthStore.getState().socket;

      if (!socket) {
        return null;
      }

      socket.on("newMessage", (newMessage: Message) => {
        const selectedUser = get().selectedUser;

        if (selectedUser?.id !== newMessage.senderId) {
          return;
        }

        const messages = get().messages;

        set({ messages: [...messages, newMessage] });
      });
    },

    unsubscribeFromNewMessages: () => {
      const socket = useAuthStore.getState().socket;

      if (!socket) {
        return null;
      }

      socket.off("newMessage");
    },
  })),
);

export default useChatStore;
