import { AlertModal } from "@forever/ui-kit";
import { type ProductToDelete } from "@/components/Admin/Products/Products";
import toast from "react-hot-toast";
import { useDeleteProductMutation } from "@/services/hooks/mutations/product.mutations";
import { IoMdTrash } from "react-icons/io";
import { handleShowApiErrorWithToastMessages } from "@/utils/common.utils";

interface DeleteProductModalProps {
  data: ProductToDelete | undefined;
  closeModal: () => void;
  open: boolean;
}

const DeleteProductModal = ({ closeModal, data, open }: DeleteProductModalProps) => {
  const { mutate, isPending } = useDeleteProductMutation({
    onSuccess: (response) => {
      toast.success(response.data.message);
      closeModal();
    },
    onError: (error) => handleShowApiErrorWithToastMessages(error),
  });

  const handleDeleteProduct = () => {
    if (data)
      mutate(data._id);
  };

  return (
    <AlertModal
      open={open}
      closeModal={closeModal}
      title="Delete this product?"
      description="This product will be permanently deleted. Are you sure you want to continue?"
      onCancel={closeModal}
      onConfirm={handleDeleteProduct}
      loading={isPending}
      confirmBtnContent={
        <>
          DELETE
          <IoMdTrash size={20} />
        </>
      }
    />
  );
};

export default DeleteProductModal;
