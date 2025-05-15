import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import reviewService, { Review } from "../services/reviewService";

export const useGetReviewsByUser = (id?: number) => {
  return useQuery({
    queryKey: id ? ["reviews", {userId: id}] : ["review-no-specified"],
    queryFn: () => reviewService.getDifferentRouteWithId("by-user", id),
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
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      if (callback) {
        callback();
      }
    },
    throwOnError: true,
  });
};

export const useGetReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => reviewService.getAll(),
    throwOnError: true,
    staleTime: 30 * 60000, // 30 minut
  });
};

export const useGetOneReview = (id?: number) => {
  return useQuery({
    queryKey: id ? ["reviews", {id: id}] : [""],
    queryFn: () => reviewService.get(id),
    throwOnError: true,
    staleTime: 30 * 60000, // 30 minut
  });
};

export const useAdminDeleteReview = (callback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewService.deleteDiferentRoute("admin", id),
    onSuccess: (response, userPassedToFunction) => {
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

export const useDeleteReview = (callback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (callback) {
        callback();
      }
    },
    throwOnError: true,
  });
};

export default usePostReview;
