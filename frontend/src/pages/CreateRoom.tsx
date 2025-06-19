import { Keyboard, Video, UserPlus, User } from "lucide-react";
import { PrimaryBtn } from "../components/buttons/PrimaryBtn";
import { PrimaryInput } from "../components/buttons/PrimaryInput";

export function CreateRoom() {
  return (
    <section className="flex items-center justify-center w-full h-[100vh]">
      <div className="flex flex-col space-y-10">
        <div className="flex flex-col text-center px-4 md:px-0 items-center space-y-2">
          <h1 className="text-4xl font-semibold">
            Video Calls and Meetings for anyone!
          </h1>
          <p className="text-gray-400 text-xl font-medium">
            Enter your meeting code or create a new one to get started.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-10">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
            <PrimaryInput
              icon={<Keyboard />}
              placeholder="Enter code or link"
            />

            <PrimaryBtn icon={<UserPlus size={20} />}>Join Meeting</PrimaryBtn>
          </div>

          <div className="flex items-center w-full space-x-4 text-gray-500">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="text-sm font-medium">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
            <PrimaryInput
              icon={<User />}
              placeholder="Enter your displayed name"
            />

            <PrimaryBtn icon={<Video />}>New Meeting</PrimaryBtn>
          </div>
        </div>
      </div>
    </section>
  );
}
