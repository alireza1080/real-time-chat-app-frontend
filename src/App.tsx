import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import ToasterWrapper from "./components/ToasterWrapper";
import useAuthStore from "./store/authStore";
import { useEffect } from "react";
import Loader from "./components/Loader";

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="flex h-screen w-full max-w-full flex-col overflow-hidden overflow-x-hidden xl:container xl:mx-auto">
      <Navbar />
      <main className="flex flex-1 overflow-y-auto">
        {isCheckingAuth ? <Loader /> : <Outlet />}
      </main>
      <ToasterWrapper />
    </div>
  );
};

export default App;
