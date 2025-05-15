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

export const useGetOneFeedback = (id?: number) => {
  return useQuery({
    queryKey: id ? ["feedback", { id: id }] : [""],
    queryFn: () => feedbackService.get(id),
    throwOnError: true,
  });
};

export const useGetUnresolvedFeedback = () => {
  return useQuery({
    queryKey: ["feedback/unresolved"],
    queryFn: () => feedbackService.getDifferentRoute("unresolved"),
    throwOnError: true,
    staleTime: 30 * 60000, // 30 minut
  });
};

export const useDeleteFeedback = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => feedbackService.delete(id),
    onSuccess: (response, userPassedToFunction) => {
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
export const useEditFeedback = (callback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Feedback) => feedbackService.put(data, data.feedback_id),
    onSuccess: () => {
      // invalid query
      queryClient.invalidateQueries({
        queryKey: ["feedback"],
      });
      queryClient.invalidateQueries({
        queryKey: ["feedback/unresolved"],
      });

      if (callback) {
        callback();
      }
    },
    throwOnError: true,
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
