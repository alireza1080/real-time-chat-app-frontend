import useOnlyAuthenticatedUser from "../hooks/useOnlyAuthenticatedUser";
import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";
import ProfileSection from "../components/ProfileSection";

const ProfilePage = () => {
  useOnlyAuthenticatedUser();

  const profilePageRef = useRef<HTMLDivElement>(null);
  const authUser = useAuthStore((state) => state.authUser);

  useEffect(() => {
    if (authUser) {
      profilePageRef.current?.classList.remove("opacity-0");
    }
  }, [authUser]);

  return (
    <div
      ref={profilePageRef}
      className="flex h-full w-full items-center justify-center px-5 py-10 opacity-0"
    >
      <ProfileSection />
    </div>
  );
};

export default ProfilePage;
