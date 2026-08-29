import { useMutation, type UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import type { IError, IResponse, IDefaultResponse } from "@forever/api";
import ProductService from "@/services/actions/product.service";
import type { IUpdateProductVariables } from "@/types/product.type";

const useAddProductMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, FormData>
) => useMutation<IResponse<IDefaultResponse>, IError, FormData>({
    mutationKey: ["add_product"],
    mutationFn: (body) =>
        ProductService.addProduct(body),
    ...mutationDetails
});

const useDeleteProductMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, string>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};

    return useMutation<IResponse<IDefaultResponse>, IError, string>({
        mutationKey: ["admin_delete_product"],
        mutationFn: (id) => ProductService.deleteProduct(id),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    });
};

const useUpdateProductMutation = (
    mutationDetails?: UseMutationOptions<IResponse<IDefaultResponse>, IError, IUpdateProductVariables>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...details } = mutationDetails ?? {};

    return useMutation<IResponse<IDefaultResponse>, IError, IUpdateProductVariables>({
        mutationKey: ["admin_update_product"],
        mutationFn: ({ id, updatedProduct }) => ProductService.updateProduct(id, updatedProduct),
        onSuccess: async (data, variables, context) => {
            await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...details
    });
};




export {
    useAddProductMutation,
    useDeleteProductMutation,
    useUpdateProductMutation
};
