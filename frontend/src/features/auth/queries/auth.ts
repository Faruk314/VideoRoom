import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, register, logout, getLoginStatus } from "../api/auth";
import { useToast } from "../../../hooks/useToast";
import { useUserStore } from "../../user/store/user";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../lib/error";

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const { toastError, toastSuccess } = useToast();
  const { setUser, setLoginStatus } = useUserStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "user"], data.userInfo);
      setUser(data.userInfo);
      setLoginStatus(true);
      toastSuccess("Login success");
      navigate("/home");
      return data;
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const { toastError, toastSuccess } = useToast();
  const { setUser, setLoginStatus } = useUserStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "user"], data.userInfo);
      setUser(data.userInfo);
      setLoginStatus(true);
      toastSuccess("Login success");
      navigate("/home");

      return data;
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useLogoutMutation() {
  const { setUser, setLoginStatus } = useUserStore();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
      setUser(null);
      setLoginStatus(false);
      navigate("/");
    },
  });
}

export function useLoginStatusQuery() {
  const { setUser, setLoginStatus } = useUserStore();

  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      try {
        const data = await getLoginStatus();

        setUser(data.userInfo);
        setLoginStatus(data.status);

        return data;
      } catch (error) {
        console.error(getErrorMessage(error));

        return false;
      }
    },
  });
}
