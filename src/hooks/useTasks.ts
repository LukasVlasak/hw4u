import { useInfiniteQuery, useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import taskService, { Task } from "../services/taskService";
import { AxiosError } from "axios";

interface TaskQuery {
  page: number;
  pageSize: number;
}

interface TaskInfiniteQuery {
  pageSize: number;
  orderBy?: string;
  where?: string;
}

const useTasks = (queryObject?: TaskQuery) => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () =>
      taskService.getAll(
        queryObject && {
          _start: (queryObject.page - 1) * queryObject.pageSize,
          _limit: queryObject.pageSize,
        }
      ), // queryFn: taskService.getAll - nefunguje - this v classe nefunguje
    throwOnError: true,
  });
};

export const useTasksWithUsers = () => {
  return useQuery({
    queryKey: ["tasks/with/users"],
    queryFn: () => taskService.getDifferentRoute("with-users"),
    throwOnError: true,
  });
}

export const useTasksByUser = (id?: number) => {
  return useQuery({
    queryKey: id ? ["user/tasks/" + id] : [""],
    queryFn: () => taskService.getDifferentRouteWithId("by-user", id),
    throwOnError: true,
  });
}

export const useDeleteTask = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['task/delete'],
    mutationFn: (id: number) => taskService.delete(id),
    throwOnError: true,
    onSuccess: () => {

      queryClient.invalidateQueries({queryKey: ["tasks/by/user"]});
      queryClient.invalidateQueries({queryKey: ["tasks"]});
      queryClient.invalidateQueries({queryKey: ["tasks/with/users"]});

      if (callback) {
        callback();
      }
    }
  });
}

export const useGetOneTask = (id?: number) => {
  return useQuery({
    queryKey: id ? ['tasks', {id: id}] : [''],
    queryFn: () => taskService.get(id),
    throwOnError: true,
    staleTime: 10 * 60000, // 10 minut
  })
}

export const useEditTask = (callback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['task/edit/'],
    mutationFn: (data: Task) => taskService.put(data, data.task_id),
    throwOnError: true,
    onMutate(variables) {
      //console.log('on mutate');
      //console.log(variables);

      // variables - to co tam posilam, optimistic update - zde updatnout cache?
      
      
    },
    onSuccess: (fromserver, varialbes, context) => {      
      queryClient.invalidateQueries({queryKey: ['tasks', {id: varialbes.task_id}]});
      queryClient.invalidateQueries({queryKey: ["tasks/by/user"]});
      queryClient.invalidateQueries({queryKey: ["tasks"]});
      queryClient.invalidateQueries({queryKey: ["tasks/with/users"]});
      if (callback) {
        callback();
      }
    }
  })
}

export const useInfiniteTasks = (queryObject: TaskInfiniteQuery) => {

  return useInfiniteQuery({
    queryKey: ["tasksInfinite"],
    queryFn: ({ pageParam }) => {
      const _limit = queryObject.pageSize;
      const where = queryObject.where;
      const orderBy = queryObject.orderBy;
      const _start = (pageParam as number - 1) * queryObject.pageSize;
      return taskService.getAll({_limit, _start, orderBy, where})
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    throwOnError: true
  })
}

export const useTask = (id?: number) => {
  return useQuery({
    queryKey: id ? ["tasks/" + id] : [],
    queryFn: () => taskService.get(id),
    throwOnError: true,
  });
};

export const usePostTask = (callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Task) => taskService.post(data),
    throwOnError: true,
    onSuccess() {
      queryClient.invalidateQueries({queryKey: ["tasks/by/user"]});
      queryClient.invalidateQueries({queryKey: ["tasks"]});
      queryClient.invalidateQueries({queryKey: ["tasks/with/users"]});

      if (callback) {
        callback();
      }
    },
  });
};

export default useTasks;
