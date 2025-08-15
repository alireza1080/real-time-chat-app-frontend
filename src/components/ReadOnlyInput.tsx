import { useId } from "react";

import { Input } from "./ui/input";
import { Label } from "./ui/label";

type ReadOnlyInputProps = {
  label: string;
  value: string;
};

export default function ReadOnlyInput({ label, value }: ReadOnlyInputProps) {
  const id = useId();
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        className="read-only:bg-muted cursor-not-allowed"
        defaultValue={value}
        readOnly
        placeholder={label}
        type="text"
      />
    </div>
  );
}
