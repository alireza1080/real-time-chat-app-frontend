import useOnlyGuestUser from "../hooks/useOnlyGuestUser";
import SigninForm from "../components/SigninForm";
import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";

const SigninPage = () => {
  useOnlyGuestUser();

  const signinPageRef = useRef<HTMLDivElement>(null);

  const authUser = useAuthStore((state) => state.authUser);

  useEffect(() => {
    if (!authUser) {
      signinPageRef.current?.classList.remove("opacity-0");
    }
  }, [authUser]);

  return (
    <div
      ref={signinPageRef}
      className="flex h-full w-full items-center justify-center px-5 py-10 opacity-0"
    >
      <SigninForm />
    </div>
  );
};

export default SigninPage;
