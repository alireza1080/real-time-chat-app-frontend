import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { UserRoundSearch } from "lucide-react";
import CheckOnlineSwitch from "./CheckOnlineSwitch";
import ContactsContainer from "./ContactsContainer";
import useAuthStore from "../store/authStore";

const Contacts = ({ children }: { children: React.ReactNode }) => {
  const isContactOpen = useAuthStore((state) => state.isContactOpen);
  const setIsContactOpen = useAuthStore((state) => state.setIsContactOpen);

  const handleCloseSheet = () => {
    setIsContactOpen(false);
  };

  return (
    <Sheet open={isContactOpen} onOpenChange={setIsContactOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <article className="flex flex-col gap-4">
              <section className="flex items-center gap-2">
                <UserRoundSearch />
                <h3>Contacts</h3>
              </section>
              <section>
                <CheckOnlineSwitch />
              </section>
            </article>
          </SheetTitle>
        </SheetHeader>
        <ContactsContainer handleCloseSheet={handleCloseSheet} />
      </SheetContent>
    </Sheet>
  );
};

export default Contacts;
