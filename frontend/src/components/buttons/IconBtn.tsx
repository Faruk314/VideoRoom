import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
}

export function IconBtn({ icon, className, ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-full h-12 w-12 md:h-13 md:w-13 cursor-pointer duration-200",
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
