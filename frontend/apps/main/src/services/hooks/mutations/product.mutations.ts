import { useMutation, type UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import type { IError, IResponse, IDefaultResponse } from "@forever/api";
import ProductService from "@/services/actions/product.service";
import type { DeleteCommentVariables, HandleFavouriteVariables, ICreateCommentVariables, UpdateCommentVariables } from "@/types/product.type";


const useHandleFavouriteMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, HandleFavouriteVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};

    return useMutation<IResponse<IDefaultResponse>, IError, HandleFavouriteVariables>({
        mutationKey: ["handle_favourites"],
        mutationFn: ({ isFav, productId }) => isFav ? ProductService.removeFav(productId) : ProductService.addFav(productId),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ['favProductCount'] })
            await queryClient.invalidateQueries({ queryKey: ['favProducts'] })
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    });
};

//! COMMENT MUTATIONS
const useUpdateCommentMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, UpdateCommentVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};

    return useMutation<IResponse<IDefaultResponse>, IError, UpdateCommentVariables>({
        mutationKey: ["update_comment"],
        mutationFn: ({ commentId, body }) =>
            ProductService.updateComment(commentId, body),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["product_detail"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    });
};

const useDeleteCommentMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, DeleteCommentVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};

    return useMutation<IResponse<IDefaultResponse>, IError, DeleteCommentVariables>({
        mutationKey: ["delete_comment"],
        mutationFn: ({ commentId, productId }) =>
            ProductService.deleteComment(commentId, productId),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["product_detail"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    });
};

const useCreateCommentMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, ICreateCommentVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};

    return useMutation<IResponse<IDefaultResponse>, IError, ICreateCommentVariables>({
        mutationKey: ["create_comment"],
        mutationFn: (data) =>
            ProductService.createComment(data),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["product_detail"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    });
};


export {
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useCreateCommentMutation,
    useHandleFavouriteMutation
};
