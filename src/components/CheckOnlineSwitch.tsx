import { useId } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import useChatStore from "../store/chatStore";

const CheckOnlineSwitch = () => {
  const id = useId();

  const showOnlyOnlineUsers = useChatStore(
    (state) => state.showOnlyOnlineUsers,
  );
  const setShowOnlyOnlineUsers = useChatStore(
    (state) => state.setShowOnlyOnlineUsers,
  );

  return (
    <div className="inline-flex items-center gap-2">
      <Switch
        id={id}
        checked={showOnlyOnlineUsers}
        onCheckedChange={setShowOnlyOnlineUsers}
        aria-label="Toggle switch"
      />
      <Label htmlFor={id} className="text-sm font-medium">
        Only online contacts
      </Label>
    </div>
  );
};

export default CheckOnlineSwitch;
