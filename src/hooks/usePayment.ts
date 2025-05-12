import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorCode } from "../services/api-client";
import { User } from "../services/userService";
import paymentService, { Payment } from "../services/paymentService";

const useHandleAdminPayment = (callback?: () => void) => {
    const queryClient = useQueryClient();

  return useMutation<AxiosResponse<Payment>, AxiosError<ErrorCode>, User>({
    mutationFn: (data: User) => paymentService.post(data as unknown as Payment),
    onSuccess: () => {

      // invalid query
      queryClient.invalidateQueries({
        queryKey: ["payment"],
      });
      queryClient.invalidateQueries({
        queryKey: ["active-products"],
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

export default useHandleAdminPayment;