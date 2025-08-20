import useOnlyAuthenticatedUser from "../hooks/useOnlyAuthenticatedUser";
import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";
import useChatStore from "../store/chatStore";
import chatSVG from "../assets/chat-svg.svg";
import ChatSection from "../components/ChatSection";

const HomePage = () => {
  useOnlyAuthenticatedUser();

  const authUser = useAuthStore((state) => state.authUser);
  const selectedUser = useChatStore((state) => state.selectedUser);
  const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const setIsContactOpen = useAuthStore((state) => state.setIsContactOpen);

  const homePageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authUser) {
      homePageRef.current?.classList.remove("opacity-0");
    }
  }, [authUser]);

  useEffect(() => {
    return () => {
      setSelectedUser(null);
      setIsContactOpen(false);
    };
  }, []);

  return (
    <div
      ref={homePageRef}
      className="flex h-full w-full flex-1 !overflow-auto px-4 py-2 opacity-0"
    >
      {!selectedUser && (
        <div className="flex h-full w-full items-center justify-center">
          <img src={chatSVG} alt="chat" className="size-2/3" />
        </div>
      )}
      {selectedUser && <ChatSection />}
    </div>
  );
};

export default HomePage;
