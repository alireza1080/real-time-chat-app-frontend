import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "./ui/conversation";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import { useEffect } from "react";
import MessageComponent from "./Message";

const Messages = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const messages = useChatStore((state) => state.messages);
  const getMessages = useChatStore((state) => state.getMessages);
  const subscribeToNewMessages = useChatStore(
    (state) => state.subscribeToNewMessages,
  );
  const unsubscribeFromNewMessages = useChatStore(
    (state) => state.unsubscribeFromNewMessages,
  );

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      subscribeToNewMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    return () => {
      if (selectedUser) {
        unsubscribeFromNewMessages();
      }
    };
  }, [selectedUser]);

  return (
    <Conversation className="relative w-full" style={{ height: "100%" }}>
      <ConversationContent>
        {messages.map((message) => (
          <MessageComponent
            key={message.id}
            from={message.senderId === authUser?.id ? "authUser" : "contact"}
            content={message.text || ""}
            imageSrc={message.image || ""}
            avatarSrc={
              message.senderId === authUser?.id
                ? authUser?.profilePicture || ""
                : selectedUser?.profilePicture || ""
            }
            avatarName={
              message.senderId === authUser?.id
                ? authUser?.fullName || ""
                : selectedUser?.fullName || ""
            }
          />
        ))}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
};

export default Messages;
