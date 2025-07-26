import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
}

export function PrimaryBtn({ icon, className, children, ...props }: Props) {
  return (
    <button
      className={cn(
        "bg-indigo-600 w-max font-semibold hover:bg-indigo-500 duration-200 text-white rounded-full px-7 py-[10px] md:py-3 flex items-center justify-center space-x-4 cursor-pointer",
        className
      )}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
