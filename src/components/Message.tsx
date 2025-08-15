import { Message, MessageContent, MessageAvatar } from "./ui/message";
import { ImageZoom } from "./ui/image-zoom";

type MessageComponentProps = {
  from: "authUser" | "contact";
  content?: string;
  imageSrc?: string;
  avatarSrc: string;
  avatarName: string;
};

const MessageComponent = ({
  from,
  content,
  imageSrc,
  avatarSrc,
  avatarName,
}: MessageComponentProps) => {
  return (
    <>
      <Message from={from} className="flex">
        <MessageContent className="w-fit">
          {imageSrc && (
            <ImageZoom>
              <img src={imageSrc} className="w-full max-w-60" />
            </ImageZoom>
          )}
          {content && (
            <p
              className={`w-full max-w-60 text-sm ${imageSrc ? "mt-2" : ""}`}
              style={{
                wordBreak: "break-word",
              }}
            >
              {content}
            </p>
          )}
        </MessageContent>
        <MessageAvatar
          src={avatarSrc || ""}
          name={avatarName || ""}
          className={`${avatarSrc ? "ring-1" : ""}`}
        />
      </Message>
    </>
  );
};

export default MessageComponent;
