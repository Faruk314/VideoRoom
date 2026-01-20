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
      <SelectTrigger className="w-full bg-white/5 hover:bg-white/10 ring-0 outline-none border border-white/10 text-white transition-all duration-200 rounded-2xl h-20 px-6 shadow-sm hover:shadow-md hover:border-white/20 focus:ring-2 focus:ring-blue-500/20">
        <div className="flex items-center space-x-4 truncate w-full">
          {icon && (
            <span className="text-blue-400 opacity-80 scale-125">{icon}</span>
          )}
          <span className="flex-1 text-left truncate text-lg font-medium text-white/90">
            <SelectValue placeholder={placeholder} />
          </span>
        </div>
      </SelectTrigger>

      <SelectContent className="max-h-[24rem] bg-[#1a1f2e] border-white/10 shadow-2xl rounded-xl">
        <SelectGroup>
          {label && (
            <SelectLabel className="text-sm uppercase tracking-wider text-blue-200/40 py-4 px-5 font-bold">
              {label}
            </SelectLabel>
          )}
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="py-2 px-5 text-[1rem] cursor-pointer focus:bg-blue-600 focus:text-white transition-colors rounded-lg mx-1 my-1"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
