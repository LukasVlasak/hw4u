import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import taskService, { Task } from "../services/taskService";

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

export const useTask = (id: number) => {
  return useQuery({
    queryKey: ["tasks/" + id],
    queryFn: () => taskService.get(id),
    throwOnError: true,
  });
};

export const usePostTask = (data: Task, callback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => taskService.post(data),
    throwOnError: true,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      if (callback) {
        callback();
      }
    },
  });
};

export default useTasks;
