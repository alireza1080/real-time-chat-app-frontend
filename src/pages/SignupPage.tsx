import useOnlyGuestUser from "../hooks/useOnlyGuestUser";
import SignupForm from "../components/SignupForm";
import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";

const SignupPage = () => {
  useOnlyGuestUser();

  const signupPageRef = useRef<HTMLDivElement>(null);

  const authUser = useAuthStore((state) => state.authUser);

  useEffect(() => {
    if (!authUser) {
      signupPageRef.current?.classList.remove("opacity-0");
    }
  }, [authUser]);

  return (
    <div
      ref={signupPageRef}
      className="flex h-full w-full items-center justify-center px-5 py-10 opacity-0"
    >
      <SignupForm />
    </div>
  );
};

export default SignupPage;
