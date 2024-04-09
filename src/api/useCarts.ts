import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "./axios";
import type { ICart, IProduct, ResponseDto } from "@/types";
import type { InfiniteData } from "@tanstack/react-query";

const fetchCarts = async (page: number) => {
  const query = new URLSearchParams({ page: page.toString(), limit: "5" });
  const { data } = await apiClient.get<ResponseDto<ICart[]>>(
    `/carts?${query.toString()}`
  );
  return data;
};

const postCart = async (product: IProduct) => {
  const { data } = await apiClient.post<{
    ok: boolean;
    code: string;
    message?: string;
    data?: IProduct;
  }>("/carts", product);
  return data;
};
const changeQuantity = async (productId: number, quantity: number) => {
  const { data } = await apiClient.patch<{
    ok: boolean;
    code: string;
    message?: string;
    product?: IProduct;
  }>(`/carts/${productId}`, { quantity });
  return data;
};
const deleteCartItem = async (id: number) => {
  const { data } = await apiClient.delete<IProduct>(`/carts/${id}`);
  return data;
};

export const useCarts = () => {
  return useInfiniteQuery({
    queryKey: ["carts"],
    queryFn: ({ pageParam }) => fetchCarts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (_lastPage, _allPages, lastPageParam) =>
      lastPageParam + 1,
  });
};

export const usePostCarts = (successCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: IProduct) => postCart(product),

    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["carts"] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(["carts"]);

      // Optimistically update to the new value --> if exists quantity should be updated
      queryClient.setQueryData(
        ["carts"],
        (old: InfiniteData<ResponseDto<ICart[]>> | undefined) => {
          if (!old) return;
          const existingItem = old.pages.flatMap((page) =>
            page.data.find((item) => item.product.id === newTodo.id)
          );
          if (!existingItem) {
            return {
              pageParams: old.pageParams,
              pages: [
                {
                  data: [
                    ...old.pages.flatMap((page) => page.data),
                    { product: newTodo, quantity: 1 },
                  ],
                  nextCursor: null,
                },
              ],
            };
          } else {
            const updatedData = old.pages.flatMap((page) =>
              page.data.map((item) => {
                if (item.product.id === newTodo.id) {
                  return { ...item, quantity: item.quantity + 1 };
                }
                return item;
              })
            );
            return {
              pageParams: old.pageParams,
              pages: [
                {
                  data: updatedData,
                  nextCursor: null,
                },
              ],
            };
          }
        }
      );
      return { previousTodos };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(["carts"], context?.previousTodos);
    },
    onSuccess: () => {
      successCallback?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
  });
};
export const useDeleteCartItem = (successCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCartItem(id),
    onSuccess: () => {
      successCallback?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
  });
};
export const useChangeQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => changeQuantity(productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["carts"] });
      const previousData = queryClient.getQueryData(["carts"]);
      queryClient.setQueryData(
        ["carts"],
        (old: InfiniteData<ResponseDto<ICart[]>> | undefined) => {
          if (!old) return;
          const updatedData = old.pages.flatMap((page) =>
            page.data.map((item) => {
              if (item.product.id === productId) {
                return { ...item, quantity };
              }
              return item;
            })
          );
          return {
            pageParams: old.pageParams,
            pages: [
              {
                data: updatedData,
                nextCursor: null,
              },
            ],
          };
        }
      );
      return { previousData };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(["carts"], context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
  });
};
