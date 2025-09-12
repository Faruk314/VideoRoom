import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "../schemas/auth";
import type { RegisterInput } from "../types/auth";
import { PrimaryInput } from "../../../components/buttons/PrimaryInput";
import { Mail, Lock, User } from "lucide-react";
import { PrimaryBtn } from "../../../components/buttons/PrimaryBtn";
import { useRegisterMutation } from "../queries/auth";
import Separator from "../../../components/Separator";
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-8 shadow-md px-6 py-8 rounded-xl border border-gray-200"
    >
      <img src="/images/logo.png" className="w-50 mx-auto" />

      <div className="grid gap-6">
        <PrimaryInput
          placeholder="Enter your username"
          icon={<User />}
          {...register("userName")}
          type="text"
          error={errors.userName?.message}
        />

        <PrimaryInput
          placeholder="Enter your email"
          icon={<Mail />}
          {...register("email")}
          type="text"
          error={errors.email?.message}
        />

        <PrimaryInput
          placeholder="Enter your password"
          icon={<Lock />}
          {...register("password")}
          type="password"
          error={errors.password?.message}
        />
      </div>

      <PrimaryBtn className="w-full" disabled={isPending} type="submit">
        {isPending ? <Spinner className="h-6 w-6" /> : "Sign up"}
      </PrimaryBtn>

      <Separator />

      <PrimaryBtn
        onClick={() => navigate("/")}
        type="button"
        className="w-full"
      >
        Sign In
      </PrimaryBtn>
    </form>
  );
}
