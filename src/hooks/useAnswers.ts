import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import answerService, { Answer } from "../services/answerService";
import APIClient, { ErrorCode } from "../services/api-client";
import { AxiosError, AxiosResponse } from "axios";

const usePostAnswer = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => answerService.post(data),
    onSuccess: (response, userPassedToFunction) => {

      // invalid query
      queryClient.invalidateQueries();
      if (callback) {
        callback();
      }
    },
    throwOnError: true,
  });
};

export const usePutPaidAnswer = (callback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['answer/paid'],
    mutationFn: (id: number) => new APIClient<Answer>("answers").putDifferentRoute({} as Answer, id, "paid"),
    throwOnError: true,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["answers"]});
      queryClient.invalidateQueries({queryKey: ["answers/by/task"]});
      queryClient.invalidateQueries({queryKey: ["answers/by/user"]});
      queryClient.invalidateQueries({queryKey: ["answers/bought"]});
      queryClient.invalidateQueries({queryKey: ["answers/provided"]});
      if (callback) {
        callback();
      }
    }
  });
}

export const useGetAnswers = () => {
  return useQuery({
    queryKey: ["answers"],
    queryFn: () => new APIClient<Answer>("answers").getAll(),
    throwOnError: true,
    staleTime: 10 * 60000, // 10 minut
  });
}

export const useGetFullAnswer = (id?: number) => {
  return useQuery({
    queryKey: id ? ['answers/full', {id: id}] : [''],
    queryFn: () => new APIClient<Answer>("answers").getDifferentRouteWithId("full-answer", id),
    throwOnError: true,
    staleTime: 10 * 60000, // 10 minut
  });
}

export const usePutConfirmAnswer = (callback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['answer/confirm'],
    mutationFn: (id: number) => new APIClient<Answer>("answers").putDifferentRoute({} as Answer, id, "confirm"),
    throwOnError: true,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["answers"]});
      queryClient.invalidateQueries({queryKey: ["answers/by/task"]});
      queryClient.invalidateQueries({queryKey: ["answers/by/user"]});
      queryClient.invalidateQueries({queryKey: ["answers/bought"]});
      queryClient.invalidateQueries({queryKey: ["answers/provided"]});
      if (callback) {
        callback();
      }
    }
  });
}


export const useGetBoughtAnswers = () => {
  return useQuery({
    queryKey: ["answers/bought"],
    queryFn: () => answerService.getDifferentRoute("bought"),
    throwOnError: true,
    staleTime: 10 * 60000, // 10 minut
  });
}

export const useGetProvidedAnswers = () => {
  return useQuery({
    queryKey: ["answers/provided"],
    queryFn: () => answerService.getDifferentRoute("provided"),
    throwOnError: true,
    staleTime: 10 * 60000, // 10 minut
  });
}

export const useBuyAnswer = (callback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation<AxiosResponse<Answer>, AxiosError<ErrorCode>, number>({
    mutationKey: ['answer/buy'],
    mutationFn: (id: number) => new APIClient<Answer>("answers").putDifferentRoute({} as Answer, id, "buy"),
    throwOnError: (error) => {
      if (error.response?.status === 400) return false;
      else return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["answers/bought"]});
      if (callback) {
        callback();
      }
    }
  });
}

export const useAnswersByUser = (id?: number) => {
  return useQuery<Answer[] | null, AxiosError<ErrorCode>>({
    queryKey: ["answers/by/user"],
    queryFn: () => new APIClient<Answer>("answers").getDifferentRouteWithId("by-user", id),
    throwOnError: (error) => {
      if (error.response?.status === 400) return false;
      else return true;
    },
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
