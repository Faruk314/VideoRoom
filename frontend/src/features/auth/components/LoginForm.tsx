import { LoginSchema } from "../schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryBtn } from "../../../components/buttons/PrimaryBtn";
import { PrimaryInput } from "../../../components/buttons/PrimaryInput";
import type { LoginInput } from "../types/auth";
import { useLoginMutation } from "../queries/auth";
import { Lock, LogIn, Mail } from "lucide-react";
import Separator from "../../../components/Separator";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../../components/loaders/Spinner";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: loginUser, isPending } = useLoginMutation();
  const navigate = useNavigate();

  async function onSubmit(data: LoginInput) {
    loginUser(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-8 shadow-md px-6 py-8 rounded-xl border border-gray-200"
    >
      <img src="/images/logo.png" className="w-50 mx-auto" />

      <div className="grid gap-4">
        <PrimaryInput
          placeholder="Enter you email"
          icon={<Mail />}
          {...register("email")}
          type="text"
        />
        {errors.email && <p className="text-red-600">{errors.email.message}</p>}

        <PrimaryInput
          placeholder="Enter your password"
          icon={<Lock />}
          {...register("password")}
          type="password"
        />

        {errors.password && (
          <p className="text-red-600">{errors.password.message}</p>
        )}
      </div>

      <PrimaryBtn
        icon={<LogIn />}
        className="w-full"
        disabled={isPending}
        type="submit"
      >
        {isPending ? <Spinner className="h-6 w-6" /> : "Sign In"}
      </PrimaryBtn>

      <Separator />

      <PrimaryBtn
        onClick={() => navigate("/register")}
        type="button"
        className="w-full"
      >
        Create Account
      </PrimaryBtn>
    </form>
  );
}
