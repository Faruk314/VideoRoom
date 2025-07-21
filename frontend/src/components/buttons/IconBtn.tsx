import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../../components/ui/tooltip";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  description?: string;
  showAlert?: boolean;
}

export function IconBtn({
  icon,
  description,
  showAlert = false,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative">
          <button
            className={cn(
              "flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-sm h-11 w-11 md:h-12 md:w-12 cursor-pointer duration-200",
              className
            )}
            {...props}
          >
            {icon}
          </button>

          {showAlert && (
            <div className="absolute top-[-0.3rem] right-[-0.1rem] w-4 h-4 text-white rounded-full text-center">
              <AlertCircle fill="orange" />
            </div>
          )}
        </div>
      </TooltipTrigger>

      {description && (
        <TooltipContent
          side="top"
          sideOffset={8}
          className="px-4 py-1 text-[0.9rem] font-black"
        >
          {description}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
