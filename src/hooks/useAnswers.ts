import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import answerService, { Answer } from "../services/answerService";

const usePostAnswer = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => answerService.post(data),
    onSuccess: (response, userPassedToFunction) => {

      // invalid query
      queryClient.invalidateQueries({
        queryKey: ["answers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["answers/by/task"],
      });
      queryClient.invalidateQueries({
        queryKey: ["answers/by/user"],
      });
      if (callback) {
        callback();
      }
    },
    throwOnError: true,
  });
};

export const useAnswersByUser = () => {
  return useQuery({
    queryKey: ["answers/by/user"],
    queryFn: () => answerService.getDifferentRoute("by-user"),
    throwOnError: true,
  });
}

export const useGetOneAnswer = (id?: number) => {
  return useQuery({
    queryKey: id ? ['answers', {id: id}] : [''],
    queryFn: () => answerService.get(id),
    throwOnError: true,
    staleTime: 10 * 60000, // 10 minut
  })
}

export const useAnswersByTask = (id?: number) => {
  return useQuery({
    queryKey: ["answers/by/task", {id: id}],
    queryFn: () => {
      if (!id) return null;
      return answerService.getDifferentRoute("by-task/" + id);
    },
    throwOnError: true,
    staleTime: 60 * 10000
  })
}

export const useDeleteAnswer = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['answer/delete'],
    mutationFn: (id: number) => answerService.delete(id),
    throwOnError: true,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["answers/by/user"]});
      queryClient.invalidateQueries({queryKey: ["answers"]});
      queryClient.invalidateQueries({queryKey: ["answers/by/task"]});

      if (callback) {
        callback();
      }
    }
  });
}

export const useEditAnswer = (callback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['answer/edit/'],
    mutationFn: (data: FormData) => answerService.put(data),
    throwOnError: true,
    onSuccess: () => {      
      queryClient.invalidateQueries({queryKey: ["answers/by/user"]});
      queryClient.invalidateQueries({queryKey: ["answers"]});
      queryClient.invalidateQueries({queryKey: ["answers/with/users"]});
      if (callback) {
        callback();
      }
    }
  })
}

export default usePostAnswer;
