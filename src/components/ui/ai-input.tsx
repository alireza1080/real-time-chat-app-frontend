import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Paperclip, Plus, Send } from "lucide-react";

import { cn } from "../../lib/utils";
import { Textarea } from "./textarea";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
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
}

const MIN_HEIGHT = 48;
const MAX_HEIGHT = 164;

const AnimatedPlaceholder = ({ showSearch }: { showSearch: boolean }) => (
  <AnimatePresence mode="wait">
    <motion.p
      key={showSearch ? "search" : "ask"}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.1 }}
      className="pointer-events-none absolute w-[150px] text-sm text-black/70 dark:text-white/70"
    >
      {showSearch ? "Search the web..." : "Ask Skiper Ai..."}
    </motion.p>
  </AnimatePresence>
);

export default function AiInput() {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });
  const [showSearch, setShowSearch] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handelClose = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    setImagePreview(null); // Use null instead of empty string
  };

  const handelChange = (e: any) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    setValue("");
    adjustHeight(true);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  return (
    <div className="w-full py-4">
      <div className="relative mx-auto w-full max-w-xl rounded-[22px] border border-black/5 p-1">
        <div className="relative flex flex-col rounded-2xl border border-black/5 bg-neutral-800/5">
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${MAX_HEIGHT}px` }}
          >
            <div className="relative">
              <Textarea
                id="ai-input-04"
                value={value}
                placeholder=""
                className="w-full resize-none rounded-2xl rounded-b-none border-none bg-black/5 px-4 py-3 leading-[1.2] focus-visible:ring-0 dark:bg-white/5 dark:text-white"
                ref={textareaRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
              />
              {!value && (
                <div className="absolute top-3 left-4">
                  <AnimatedPlaceholder showSearch={showSearch} />
                </div>
              )}
            </div>
          </div>

          <div className="h-12 rounded-b-xl bg-black/5 dark:bg-white/5">
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <label
                className={cn(
                  "relative cursor-pointer rounded-full bg-black/5 p-2 dark:bg-white/5",
                  imagePreview
                    ? "border border-[#ff3f17] bg-[#ff3f17]/15 text-[#ff3f17]"
                    : "bg-black/5 text-black/40 hover:text-black dark:bg-white/5 dark:text-white/40 dark:hover:text-white",
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
                    "h-4 w-4 text-black/40 transition-colors hover:text-black dark:text-white/40 dark:hover:text-white",
                    imagePreview && "text-[#ff3f17]",
                  )}
                />
                {imagePreview && (
                  <div className="absolute top-14 -left-4 h-[100px] w-[100px]">
                    <img
                      className="rounded-2xl object-cover"
                      src={imagePreview || "/picture1.jpeg"}
                      alt="additional image"
                    />
                    <button
                      onClick={handelClose}
                      className="shadow-3xl absolute -top-1 -left-1 rotate-45 rounded-full bg-[#e8e8e8] text-[#464646]"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowSearch(!showSearch);
                }}
                className={cn(
                  "flex h-8 items-center gap-2 rounded-full border px-1.5 py-1 transition-all",
                  showSearch
                    ? "border-[#ff3f17] bg-[#ff3f17]/15 text-[#ff3f17]"
                    : "border-transparent bg-black/5 text-black/40 hover:text-black dark:bg-white/5 dark:text-white/40 dark:hover:text-white",
                )}
              >
                <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
                  <motion.div
                    animate={{
                      rotate: showSearch ? 180 : 0,
                      scale: showSearch ? 1.1 : 1,
                    }}
                    whileHover={{
                      rotate: showSearch ? 180 : 15,
                      scale: 1.1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                    }}
                  >
                    <Globe
                      className={cn(
                        "h-4 w-4",
                        showSearch ? "text-[#ff3f17]" : "text-inherit",
                      )}
                    />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {showSearch && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{
                        width: "auto",
                        opacity: 1,
                      }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0 overflow-hidden text-sm whitespace-nowrap text-[#ff3f17]"
                    >
                      Search
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
            <div className="absolute right-3 bottom-3">
              <button
                type="button"
                onClick={handleSubmit}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  value
                    ? "bg-[#ff3f17]/15 text-[#ff3f17]"
                    : "bg-black/5 text-black/40 hover:text-black dark:bg-white/5 dark:text-white/40 dark:hover:text-white",
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
}
