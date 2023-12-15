import { useMutation, useQueryClient } from "@tanstack/react-query";
import userService, { User } from "../services/userService";

const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: User) => userService.post(data),
    onSuccess: (userFromServer, userPassedToFunction) => {
      // invalid query
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      console.log(userFromServer);
    },
  });
};

export default useRegister;
