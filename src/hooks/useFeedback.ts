import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import feedbackService, { Feedback } from "../services/feedbackService";

export const useFeedback = () => {
  return useQuery({
    queryKey: ["feedback"],
    queryFn: () => feedbackService.getAll(),
    throwOnError: true,
    staleTime: 30 * 60000, // 30 minut
  });
};

const usePostFeedback = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Feedback) => feedbackService.post(data),
    onSuccess: (response, userPassedToFunction) => {

        // mby dat postnutou review do stavajicich i kdyz moc efekt by to asi nemelo jen u toho jednoho usera
      // invalid query
      queryClient.invalidateQueries({
        queryKey: ["feedback"],
      });

      if (callback) {
        callback();
      }
    },
    throwOnError: true,
  });
};

export default usePostFeedback;
