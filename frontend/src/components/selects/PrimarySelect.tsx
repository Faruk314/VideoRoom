import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Option {
  label: string;
  value: string;
}

interface PrimarySelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export function PrimarySelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  icon,
  disabled = false,
}: PrimarySelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="bg-transparent ring-0 outline-none border border-black w-[14rem]">
        <div className="flex items-center space-x-2 truncate">
          {icon}

          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>

      <SelectContent className="max-w-[14rem] max-h-[8rem] md:max-h-[10rem]">
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
