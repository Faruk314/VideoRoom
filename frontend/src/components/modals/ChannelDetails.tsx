import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { IconBtn } from "../buttons/IconBtn";
import { AlertCircle } from "lucide-react";
import { CopyLinkBox } from "../CopyLinkBox";
import { useParams } from "react-router-dom";

export default function ChannelDetails() {
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const link = `${import.meta.env.VITE_FRONTEND_URL}/channel/${id}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconBtn
          description="Channel details"
          className="bg-transparent text-black hover:bg-gray-200"
          icon={<AlertCircle size={30} />}
        />
      </DialogTrigger>

      <DialogContent className="">
        <DialogTitle>Channel details</DialogTitle>

        <p className="text-sm">
          Share this channel link with the people you want to invite
        </p>

        <CopyLinkBox link={link} />
      </DialogContent>
    </Dialog>
  );
}
