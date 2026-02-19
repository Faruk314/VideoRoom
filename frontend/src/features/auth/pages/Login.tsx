import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0B0E14] text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0B0E14] to-[#0B0E14]"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/5 to-transparent"></div>

        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] mix-blend-screen animate-pulse delay-1000 duration-[10000ms]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[560px] p-4 sm:p-12">
        <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[24px] sm:rounded-[32px] p-1.5 shadow-2xl ring-1 ring-white/5">
          <div className="bg-[#0f1219]/90 rounded-[20px] sm:rounded-[26px] p-6 sm:p-10 border border-white/5">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
