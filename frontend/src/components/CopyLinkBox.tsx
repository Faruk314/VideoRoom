import { useState } from "react";
import { Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

export function CopyLinkBox({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTooltipOpen(true);

    setTimeout(() => {
      setTooltipOpen(false);
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="flex items-center space-x-2 w-max border bg-gray-100 h-10 pl-2">
      <input
        value={link}
        readOnly
        className="cursor-text h-full w-[14rem] md:w-[20rem] outline-none bg-gray-100"
      />
      <TooltipProvider>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <button
              onClick={handleCopy}
              className="bg-transparent text-indigo-600 hover:bg-gray-200 h-full px-2 text-center cursor-pointer"
            >
              <Copy />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="px-4 py-1 text-[0.9rem] font-black"
          >
            {copied ? "Copied!" : "Copy link"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
