import { Skeleton } from "./ui/skeleton";

const ContactSkeleton = () => {
  return (
    <div className="flex py-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
    </div>
  );
};

export default ContactSkeleton;
