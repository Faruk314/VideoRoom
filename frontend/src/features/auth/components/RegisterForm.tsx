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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
      <div className="grid gap-4">
        <PrimaryInput
          placeholder="Enter you username"
          icon={<User />}
          {...register("userName")}
          type="text"
        />
        {errors.userName && (
          <p className="text-red-600">{errors.userName.message}</p>
        )}

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
