import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useOnlyAuthenticatedUser = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);

  useEffect(() => {
    if (!authUser) {
      navigate("/signin");
      toast.error("You must be logged in to access this page.");
    }
  }, [authUser]);
};

export default useOnlyAuthenticatedUser;
