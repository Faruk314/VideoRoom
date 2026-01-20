import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
}

export function PrimaryBtn({ icon, className, children, ...props }: Props) {
  return (
    <button
      className={cn(
        "bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200 rounded-xl px-6 py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
