import { AlertModal } from "@forever/ui-kit";
import { type DeleteProductDTO } from "@/components/Admin/Products/Products";
import toast from "react-hot-toast";
import { useDeleteProductMutation } from "@/services/hooks/mutations/product.mutations";
import { IoMdTrash } from "react-icons/io";
import { handleShowApiErrorWithToastMessages } from "@/utils/common.utils";

interface DeleteProductModalProps {
  data: DeleteProductDTO;
  closeModal: () => void;
  open: boolean;
}

const DeleteProductModal = ({ closeModal, data, open }: DeleteProductModalProps) => {
  const { mutate, isPending } = useDeleteProductMutation({
    onSuccess: (data) => {
      toast.success(data.data.message);
      closeModal();
    },
    onError: (err) => handleShowApiErrorWithToastMessages(err),
  });

  const handleDeleteProduct = () => mutate(data._id);

  return (
    <AlertModal
      open={open}
      closeModal={closeModal}
      title="Are you sure?"
      description="Are you sure you want to delete this product?"
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
