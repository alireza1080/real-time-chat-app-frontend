import { Toaster } from "sonner";
import { useWindowSize } from "../hooks/guarahooks/use-window-size";

const ToasterWrapper = () => {
  const { width } = useWindowSize();

  return <Toaster position={width < 768 ? "bottom-right" : "top-center"} />;
};

export default ToasterWrapper;
