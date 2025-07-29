import { Loader } from "lucide-react";
import { useLoginStatusQuery } from "../features/auth/queries/auth";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { data: user, isLoading, isError } = useLoginStatusQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
