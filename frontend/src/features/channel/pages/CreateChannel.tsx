import { LogOut } from "lucide-react";
import { useUserStore } from "../../user/store/user";
import ChannelForm from "../components/ChannelForm";
import { useLogoutMutation } from "../../auth/queries/auth";
import { PrimaryBtn } from "../../../components/buttons/PrimaryBtn";

export function CreateChannel() {
  const { user } = useUserStore();
  const { mutate: logoutUser } = useLogoutMutation();

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-[#0B0E14] text-white flex flex-col">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0B0E14] to-[#0B0E14]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/5 to-transparent"></div>

        {/* Abstract Shapes */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] mix-blend-screen animate-pulse delay-1000 duration-[10000ms]"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-20 w-full border-b border-white/5 bg-[#0B0E14]/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8 py-5 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 md:space-x-5">
              <div className="p-2 rounded-2xl bg-white/5 border border-white/5 shadow-lg ring-1 ring-white/10">
                <img
                  src="/images/logo.webp"
                  alt="Logo"
                  className="w-14 h-14 md:w-16 md:h-16 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-medium text-blue-200/50">
                  Welcome back,
                </span>
                <span className="text-lg md:text-2xl font-bold text-white tracking-tight leading-tight">
                  {user?.userName}
                </span>
              </div>
            </div>

            <PrimaryBtn
              onClick={() => logoutUser()}
              className="w-max text-lg font-bold shadow-blue-900/20 py-3"
              icon={<LogOut size={20} />}
            >
              Sign Out
            </PrimaryBtn>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center relative z-10 p-4 sm:p-12">
        <div className="w-full max-w-[520px]">
          <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[24px] sm:rounded-[32px] p-1.5 shadow-2xl ring-1 ring-white/5">
            <div className="bg-[#0f1219]/90 rounded-[20px] sm:rounded-[26px] p-6 sm:p-10 border border-white/5">
              <div className="flex flex-col items-center justify-center mb-8 text-center space-y-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-100 to-blue-300">
                  Create or Join
                </h1>
                <p className="text-blue-200/50 text-sm sm:text-base font-medium leading-relaxed max-w-xs mx-auto">
                  Video calls and meetings for everyone. Connect with your team
                  instantly.
                </p>
              </div>

              <ChannelForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
