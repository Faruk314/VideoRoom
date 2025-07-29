import { Navigate, Outlet } from "react-router-dom";
import { useLoginStatusQuery } from "../features/auth/queries/auth";
import Loader from "./loaders/Loader";

export default function Redirect() {
  const { data: user, isLoading } = useLoginStatusQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (user) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
}
