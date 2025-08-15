import AvatarSection from "./AvatarSection";
import ReadOnlyInput from "./ReadOnlyInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import useAuthStore from "../store/authStore";

const ProfileSection = () => {
  const authUser = useAuthStore((state) => state.authUser);

  const memberSince = new Date(
    authUser?.createdAt as unknown as string,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="mx-auto w-full max-w-sm py-8">
      <CardHeader className="flex flex-col items-center gap-2">
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your profile information</CardDescription>
        <CardContent className="flex flex-col items-center gap-4 py-4">
          <AvatarSection />
        </CardContent>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="flex flex-col gap-6">
          <ReadOnlyInput
            label="Full Name"
            value={authUser?.fullName as string}
          />
          <ReadOnlyInput label="Email" value={authUser?.email as string} />
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex-col gap-4">
        <h3 className="self-start font-semibold">Account Information</h3>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <h3 className="text-muted-foreground text-sm font-semibold">
              Member Since
            </h3>
            <h2 className="text-muted-foreground font-mono text-sm">
              {memberSince}
            </h2>
          </div>
          <div className="flex w-full items-center justify-between">
            <h3 className="text-muted-foreground text-sm font-semibold">
              Account Status
            </h3>
            <h2 className="font-mono text-sm text-green-500">Active</h2>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfileSection;
