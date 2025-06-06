import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import productService, { Product } from "../services/productService";
import { AxiosError } from "axios";
import { ErrorCode } from "../services/api-client";

const usePostProduct = (callback?: () => void) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: Product) => productService.post(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["product"],
        });
  
        if (callback) {
          callback();
        }
      },
      throwOnError: true,
    });
  };

export const useGetProducts = () => {
    return useQuery({
        queryKey: ["product"],
        queryFn: () => productService.getAll(),
        throwOnError: true,
        staleTime: 30 * 60000, // 30 minut
    })
}

export const useGetProductsByUser = () => {
    return useQuery<Product[], AxiosError<ErrorCode>>({
        queryKey: ["product", "by-user"],
        queryFn: () => productService.getDifferentRoute("by-user"),
        throwOnError: (error) => {
            if (error.response?.status === 400) return false;
            else return true;
        },
        staleTime: 30 * 60000, // 30 minut
    })
}

export const useGetActiveProduct = () => {
    return useQuery<Product[], AxiosError<ErrorCode>>({
        queryKey: ["active-products"],
        queryFn: () => productService.getDifferentRoute("active"),
        throwOnError: (error) => {
            if (error.response?.status === 400) return false;
            else return true;
        },
        staleTime: 30 * 60000, // 30 minut
    })
}

export const useGetUIProducts = () => {
    return useQuery({
        queryKey: ["product", "ui"],
        queryFn: () => productService.getDifferentRoute("ui"),
        throwOnError: true,
        staleTime: 30 * 60000, // 30 minut
    })
}

export const useGetOneProduct = (id?: number) => {
    return useQuery({
        queryKey: id ? ["product", {id: id}] : [""],
        queryFn: () => productService.get(id),
        throwOnError: true,
        staleTime: 30 * 60000, // 30 minut
    })
}
export const useEditProduct = (callback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Product) => productService.put(data, data.product_id),
        onSuccess: (response, userPassedToFunction) => {
            // invalid query
            queryClient.invalidateQueries({
                queryKey: ["product"],
            });
            if (callback) {
                callback();
            }
        },
        throwOnError: true,
    });
}
export const useEditProductStatus = (callback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Product) => productService.putDifferentRoute(data, data.product_id, "active"),
        onSuccess: (response, userPassedToFunction) => {
            // invalid query
            queryClient.invalidateQueries({
                queryKey: ["product"],
            });
            if (callback) {
                callback();
            }
        },
        throwOnError: true,
    });
}
export const useDeleteProduct = (callback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => productService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product"] });
            if (callback) {
                callback();
            }
        },
        throwOnError: true,
    });
}
export default usePostProduct;