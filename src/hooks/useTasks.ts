import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import taskService, { Task } from "../services/taskService"

const useTasks = () => {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: () => taskService.getAll(), // queryFn: taskService.getAll - nefunguje - getAll musi vracet promise a to nevraci
        throwOnError: true,
    })
}

export const useTask = (id: number) => {
    return useQuery({
        queryKey: ['tasks/' + id],
        queryFn: () => taskService.get(id),
        throwOnError: true
    })
}

export const usePostTask = (data: Task, callback?: () => void) => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => taskService.post(data),
        throwOnError: true,
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['tasks']
            })

            if (callback) {
                callback();
            }
        }
    })
}

export default useTasks;