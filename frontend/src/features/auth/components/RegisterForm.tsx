import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "../schemas/auth";
import type { RegisterInput } from "../types/auth";
import { PrimaryInput } from "../../../components/buttons/PrimaryInput";
import { Mail, Lock, User } from "lucide-react";
import { PrimaryBtn } from "../../../components/buttons/PrimaryBtn";
import { useRegisterMutation } from "../queries/auth";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../components/loaders/Spinner";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { mutate: registerUser, isPending } = useRegisterMutation();

  async function onSubmit(data: RegisterInput) {
    registerUser(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex flex-col items-center justify-center mb-8 text-center space-y-4">
        <img
          src="/images/logo.webp"
          alt="Logo"
          className="w-40 h-40 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        />
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-100 to-blue-300">
            Create Account
          </h1>
          <p className="text-blue-200/50 text-sm sm:text-base font-medium leading-relaxed">
            Start your journey with us today
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-blue-200/80 ml-1 uppercase tracking-wider">
            Username
          </label>
          <PrimaryInput
            {...register("userName")}
            placeholder="Choose a username"
            type="text"
            error={errors.userName?.message}
            icon={<User size={20} className="text-blue-300/50" />}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-blue-200/80 ml-1 uppercase tracking-wider">
            Email Address
          </label>
          <PrimaryInput
            {...register("email")}
            placeholder="name@company.com"
            type="text"
            error={errors.email?.message}
            icon={<Mail size={20} className="text-blue-300/50" />}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-blue-200/80 ml-1 uppercase tracking-wider">
            Password
          </label>
          <PrimaryInput
            {...register("password")}
            placeholder="••••••••"
            type="password"
            error={errors.password?.message}
            icon={<Lock size={20} className="text-blue-300/50" />}
          />
        </div>
      </div>

      <div className="pt-4">
        <PrimaryBtn
          className="w-full text-lg font-bold shadow-blue-900/20 py-3"
          disabled={isPending}
          type="submit"
        >
          {isPending ? (
            <Spinner className="h-6 w-6 text-white/90" />
          ) : (
            "Sign Up"
          )}
        </PrimaryBtn>
      </div>

      <div className="text-center pt-2">
        <p className="text-base text-blue-200/40 font-medium">
          Already have an account?{" "}
          <span
            className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors ml-1 font-semibold"
            onClick={() => navigate("/")}
          >
            Sign In
          </span>
        </p>
      </div>
    </form>
  );
}
