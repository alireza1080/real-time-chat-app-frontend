import { X } from "lucide-react";
import ContactsAvatar from "./ContactsAvatar";
import useChatStore from "../store/chatStore";

const ChatHeader = () => {
  const selectedUser = useChatStore((state) => state.selectedUser);
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);

  return (
    <div className="mb-2 flex h-16 w-full items-center justify-between rounded-[22px] px-4 shadow-2xl">
      <div className="flex items-center gap-6">
        <div className="scale-110">
          <ContactsAvatar
            image={selectedUser?.profilePicture as string}
            userId={selectedUser?.id as string}
          />
        </div>
        <h3 className="hidden text-lg sm:block">{selectedUser?.fullName}</h3>
      </div>
      <div
        onClick={() => setSelectedUser(null)}
        className="hover:bg-muted-foreground/20 cursor-pointer rounded-full p-2"
      >
        <X />
      </div>
    </div>
  );
};

export default ChatHeader;
