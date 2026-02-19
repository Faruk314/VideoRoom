import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { truncateText } from "../../lib/utils";

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
    <div className="flex flex-col gap-1.5 w-full sm:max-w-full">
      {label && (
        <label className="text-[11px] font-bold text-white/30 ml-1 uppercase tracking-wider">
          {label}
        </label>
      )}

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className="
            flex items-center justify-between
            w-full px-4 py-5 
            bg-[#0C0C0C] border border-white/10
            hover:border-white/20 hover:bg-[#111111]
            text-white transition-all duration-200
            rounded-xl outline-none ring-0
          "
        >
          <div className="flex items-center gap-3 truncate">
            {icon && (
              <span className="text-white/40 shrink-0 scale-90">{icon}</span>
            )}
            <span className="text-sm font-medium truncate">
              <SelectValue placeholder={placeholder} />
            </span>
          </div>
        </SelectTrigger>

        <SelectContent className="bg-[#0C0C0C] border border-white/10 shadow-2xl rounded-xl">
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="py-3 px-4 text-sm text-white/60 cursor-pointer rounded-lg focus:bg-white/10 focus:text-white"
              >
                {truncateText(opt.label, 35)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
