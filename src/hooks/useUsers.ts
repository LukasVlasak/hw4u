import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userService, { User } from "../services/userService";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorCode } from "../services/api-client";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getAll(),
    throwOnError: true,
  });
}

export const useGetOneUser = (id?: number) => {
  return useQuery({
    queryKey: id ? ['users', {id: id}] : [''],
    queryFn: () => userService.get(id),
    throwOnError: true,
  });
}

export const useEditAccount = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<User>, AxiosError<ErrorCode>, User>({
    mutationFn: (data: User) => userService.putCurrentUser(data),
    onSuccess: (response, userPassedToFunction) => {      
      // invalid query
      queryClient.invalidateQueries({
        queryKey: ["users"]
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
}

export const useEditUser = (callback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: User) => userService.put(data, data.app_user_id),
    onSuccess: (response, userPassedToFunction) => {
      // invalid query
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      if (callback) {
        callback();
      }
    },
    throwOnError: true
  });
};

export const useDeleteUser = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: () => {
      // invalid query
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      
      if (callback) {
        callback();
      }
    },
    throwOnError: true
  });
};

export const useGetTopEarningUsers = () => {
  return useQuery({
    queryKey: ["top-earning-users"],
    queryFn: () => userService.getDifferentRoute("top-users"),
    throwOnError: true,
    staleTime: 30 * 60000, // 30 minut
  });
}

const useRegister = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<User>, AxiosError<ErrorCode>, User>({
    mutationFn: (data: User) => userService.post(data),
    onSuccess: (response, userPassedToFunction) => {

      // invalid query
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      queryClient.resetQueries({
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
