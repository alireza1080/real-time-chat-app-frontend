import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Paperclip, Plus, Send } from "lucide-react";

import { cn } from "../lib/utils";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import useChatStore from "../store/chatStore";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

const useAutoResizeTextarea = ({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY),
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight],
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
};

const MIN_HEIGHT = 48;
const MAX_HEIGHT = 164;

const AnimatedPlaceholder = () => (
  <AnimatePresence mode="wait">
    <motion.p
      key={"ask"}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.1 }}
      className="text-muted-foreground pointer-events-none absolute w-[150px] text-sm"
    >
      Message...
    </motion.p>
  </AnimatePresence>
);

const AiInput = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = useChatStore((state) => state.sendMessage);
  const isSendingMessage = useChatStore((state) => state.isSendingMessage);

  const handelClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    setImagePreview(null); // Use null instead of empty string
    setImage(null);
  };

  const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (!file?.type.startsWith("image/")) {
      return toast.error("Only image is allowed");
    }

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleSubmit = async () => {
    await sendMessage(
      text,
      setText,
      image,
      setImage,
      setImagePreview,
      adjustHeight,
    );
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  return (
    <div className="mt-2 w-full">
      <div className="bg-input relative mx-auto w-full max-w-4xl rounded-[22px] border p-1">
        {imagePreview && (
          <div className="relative mb-2 max-w-[100px]">
            <img
              className="rounded-2xl object-cover"
              src={imagePreview || "/picture1.jpeg"}
              alt="additional image"
            />
            <button
              onClick={handelClose}
              className="shadow-3xl bg-secondary text-secondary-foreground absolute -top-1 -right-1 rotate-45 rounded-full"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="bg-card relative flex flex-col rounded-2xl border">
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${MAX_HEIGHT}px` }}
          >
            <div className="relative">
              <Textarea
                id="ai-input-04"
                value={text}
                placeholder=""
                className="text-foreground w-full resize-none rounded-2xl rounded-b-none border-none bg-transparent px-4 py-3 leading-[1.2] focus-visible:ring-0"
                ref={textareaRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                onChange={(e) => {
                  setText(e.target.value);
                  adjustHeight();
                }}
              />
              {!text && (
                <div className="absolute top-3 left-4">
                  <AnimatedPlaceholder />
                </div>
              )}
            </div>
          </div>

          <div className="bg-muted flex h-12 items-center justify-between rounded-b-xl px-2">
            <div className="flex items-center">
              <label
                className={cn(
                  "relative cursor-pointer rounded-full p-2",
                  imagePreview
                    ? "border-primary bg-primary/15 text-primary border"
                    : "bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handelChange}
                  className="hidden"
                />
                <Paperclip
                  className={cn(
                    "h-4 w-4 transition-colors",
                    imagePreview && "text-primary",
                  )}
                />
              </label>
            </div>
            <div className="">
              <button
                type="button"
                disabled={isSendingMessage}
                onClick={handleSubmit}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  text || imagePreview
                    ? "bg-primary/15 text-primary"
                    : "bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInput;
