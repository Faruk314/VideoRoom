import { LogOut } from "lucide-react";
import { PrimaryBtn } from "../../../components/buttons/PrimaryBtn";
import { useUserStore } from "../../user/store/user";
import ChannelForm from "../components/ChannelForm";
import { useLogoutMutation } from "../../auth/queries/auth";

export function CreateChannel() {
  const { user } = useUserStore();
  const { mutate: logoutUser } = useLogoutMutation();

  return (
    <section className="flex flex-col items-center justify-center w-full h-[100vh]">
      <div className="fixed top-0 p-4 flex items-center justify-between w-full">
        <div className="flex items-baseline space-x-2 text-2xl md:text-3xl">
          <span className="font-semibold">Welcome</span>
          <span className="text-gray-500 text-xl md:text-2xl">
            {user?.userName}
          </span>
        </div>

        <PrimaryBtn onClick={() => logoutUser()} icon={<LogOut size={20} />}>
          Log Out
        </PrimaryBtn>
      </div>
      <div className="flex flex-col justify-center items-center space-y-10">
        <div className="flex flex-col text-center px-4 md:px-0 items-center space-y-2">
          <h1 className="text-4xl font-semibold">
            Video Calls and Meetings for anyone!
          </h1>
          <p className="text-gray-400 text-xl font-medium">
            Enter your meeting code or create a new one to get started.
          </p>
        </div>

        <ChannelForm />
      </div>
    </section>
  );
}
