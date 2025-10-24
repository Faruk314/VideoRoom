import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday } from "date-fns";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatMessageTime(date: Date, short = false): string {
  if (short) {
    return format(date, "h:mm a");
  }

  if (isToday(date)) {
    return format(date, "h:mm a");
  }

  return format(date, "MMMM d 'at' h:mm a");
}

export { cn, formatMessageTime };
