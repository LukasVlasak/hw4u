import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import reviewService, { Review } from "../services/reviewService";

export const useReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => reviewService.getAll(),
    throwOnError: true,
    staleTime: 30 * 60000, // 30 minut
  });
};

const usePostReview = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Review) => reviewService.post(data),
    onSuccess: (response, userPassedToFunction) => {

        // mby dat postnutou review do stavajicich i kdyz moc efekt by to asi nemelo jen u toho jednoho usera
      // invalid query
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });

      if (callback) {
        callback();
      }
    },
    throwOnError: true,
  });
};

export default usePostReview;
