import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import categoryService, { Category } from "../services/categoryService";
import taskService from "../services/taskService";

const usePostCategory = (callback?: () => void) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: Category) => categoryService.post(data),
      onSuccess: (response, userPassedToFunction) => {
        queryClient.invalidateQueries({
          queryKey: ["category"],
        });
  
        if (callback) {
          callback();
        }
      },
      throwOnError: true,
    });
  };

export const useGetCategories = () => {
    return useQuery({
        queryKey: ["category"],
        queryFn: () => categoryService.getAll(),
        throwOnError: true,
        staleTime: 30 * 60000, // 30 minut
    })
}
export const useGetOneCategory = (id?: number) => {
    return useQuery({
        queryKey: id ? ["category", {id: id}] : [""],
        queryFn: () => categoryService.get(id),
        throwOnError: true,
        staleTime: 30 * 60000, // 30 minut
    })
}
export const useEditCategory = (callback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Category) => categoryService.put(data, data.category_id),
        onSuccess: (response, userPassedToFunction) => {
            // invalid query
            queryClient.invalidateQueries({
                queryKey: ["category"],
            });
            if (callback) {
                callback();
            }
        },
        throwOnError: true,
    });
}
export const useDeleteCategory = (callback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => categoryService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["category"] });
            if (callback) {
                callback();
            }
        },
        throwOnError: true,
    });
}
export default usePostCategory;