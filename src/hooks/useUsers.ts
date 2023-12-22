import { useMutation, useQueryClient } from "@tanstack/react-query";
import userService, { User } from "../services/userService";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorCode } from "../services/api-client";

const useRegister = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<User>, AxiosError<ErrorCode>, User>({
    mutationFn: (data: User) => userService.post(data),
    onSuccess: (response, userPassedToFunction) => {

      const authToken = response.headers["x-auth-token"];
      localStorage.setItem("x-auth-token", authToken);

      // invalid query
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["auth"],
        
      });
      
      if (callback) {
        callback();
      }
    },
    throwOnError(error) {
      if (error.response?.status === 400) return false;
      else return true;
    },
  });
};

export default useRegister;
