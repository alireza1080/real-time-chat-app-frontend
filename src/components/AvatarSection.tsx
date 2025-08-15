import useAuthStore from "../store/authStore";
import AvatarDialog from "./AvatarDialog";

const AvatarSection = () => {
  const authUser = useAuthStore((state) => state.authUser);

  return (
    <div className="relative size-20 rounded-full sm:size-24 md:size-28 lg:size-32">
      <img
        src={authUser?.profilePicture}
        alt="avatar"
        className="size-full rounded-full object-cover"
      />
      <AvatarDialog />
    </div>
  );
};

export default AvatarSection;
