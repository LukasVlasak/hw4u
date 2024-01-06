import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";
import { AxiosError, AxiosResponse } from "axios";
import { User } from "../services/userService";
import APIClient, { ErrorCode } from "../services/api-client";

const useAuth = () => {  
    return useQuery<User[], AxiosError, User[]>({
      queryKey: ['auth'],
      queryFn: () => authService.getAll(),
      throwOnError: (error, query) => {        
        if (error.response?.status === 400) return false;
        else return true;
      },
      staleTime: 10 * 60000, // 10 minut
      retry: false
    })
}

export const useLogin = (callback?: () => void) => {

  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<User>, AxiosError<ErrorCode>, User>({
    mutationFn: (data: User) => authService.post(data),
    onSuccess: (fromServer) => {

      const authToken = fromServer.headers["x-auth-token"];
      localStorage.setItem("x-auth-token", authToken);

      queryClient.invalidateQueries({
        queryKey: ['auth'],
      });

      if (callback) {
        callback();
      }
    },
    throwOnError(error) {
      if (error.response?.status === 400) return false;
      else return true; 
    },
  })
}

export const useLogout = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return new APIClient("auth/logout").post({} as User);
    },
    onSuccess() {
      localStorage.removeItem("x-auth-token");
      setTimeout(() => {}, 50); // aby localstorage stihlo odstranit a neblblo to

      queryClient.invalidateQueries({
        queryKey: ['auth'],
      });

      if (callback) {
        callback();
      }
    },
    throwOnError: true
  })
}

export default useAuth;