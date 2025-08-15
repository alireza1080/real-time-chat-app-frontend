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
import { useState } from "react";

const Contacts = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  const handleCloseSheet = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
