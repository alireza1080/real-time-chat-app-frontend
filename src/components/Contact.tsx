import ContactsAvatar from "./ContactsAvatar";
import useChatStore from "../store/chatStore";
import { useMemo } from "react";

type User = {
  id: string;
  fullName: string;
  email: string;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const Contact = ({
  user,
  handleCloseSheet,
}: {
  user: User;
  handleCloseSheet: () => void;
}) => {
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const selectedUser = useChatStore((state) => state.selectedUser);

  const isUserSelected = useMemo(() => {
    return selectedUser?.id === user.id;
  }, [selectedUser]);

  const handleClick = () => {
    setSelectedUser(user);
    handleCloseSheet();
  };

  return (
    <div
      className={`hover:bg-muted-foreground/20 my-2 flex cursor-pointer rounded-md px-2 py-2 transition-colors ${
        isUserSelected ? "bg-muted-foreground/20" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <ContactsAvatar
          image={user.profilePicture as string}
          userId={user.id}
        />
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">{user.fullName}</h3>
        </div>
      </div>
    </div>
  );
};

export default Contact;
