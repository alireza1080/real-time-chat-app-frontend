import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useOnlyGuestUser = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);

  useEffect(() => {
    if (authUser) {
      navigate("/");
      toast.error("You are logged in.");
    }
  }, []);
};

export default useOnlyGuestUser;
