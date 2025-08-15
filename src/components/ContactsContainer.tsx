import { useEffect } from "react";

import { ScrollArea } from "./ui/scroll-area";
import useChatStore from "../store/chatStore";
import Contact from "./Contact";
import ContactSkeleton from "./ContactSkeleton";
import useAuthStore from "../store/authStore";

const ContactsContainer = ({
  handleCloseSheet,
}: {
  handleCloseSheet: () => void;
}) => {
  const users = useChatStore((state) => state.users);
  const isUsersLoading = useChatStore((state) => state.isUsersLoading);
  const getUsers = useChatStore((state) => state.getUsers);
  const showOnlyOnlineUsers = useChatStore(
    (state) => state.showOnlyOnlineUsers,
  );
  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <ScrollArea className="max-h-[calc(100vh-10rem)] w-full">
      {!isUsersLoading && (
        <div className="p-4">
          {users
            .filter((user) => {
              if (showOnlyOnlineUsers) {
                return onlineUsers.includes(user.id);
              }
              return true;
            })
            .map((user) => (
              <Contact
                key={user.id}
                user={user}
                handleCloseSheet={handleCloseSheet}
              />
            ))}
        </div>
      )}
      {isUsersLoading && (
        <div className="p-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <ContactSkeleton key={index} />
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default ContactsContainer;
