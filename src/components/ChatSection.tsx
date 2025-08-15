import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import SendMessageSection from "./SendMessageSection";
import useChatStore from "../store/chatStore";

const ChatSection = () => {
  const selectedUser = useChatStore((state) => state.selectedUser);

  return (
    <div
      className="mx-auto flex h-full w-full max-w-4xl flex-col"
      key={selectedUser?.id}
    >
      <ChatHeader />
      <div className="flex-1 overflow-hidden">
        <Messages />
      </div>
      <SendMessageSection />
    </div>
  );
};

export default ChatSection;
