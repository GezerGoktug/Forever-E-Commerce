import { IoMdTrash } from "react-icons/io";
import toast from "react-hot-toast";
import type { ReviewToDelete } from "@/components/ProductDetail/Reviews/Reviews/Reviews";
import { useParams } from "react-router-dom";
import { useDeleteCommentMutation } from "@/services/hooks/mutations/product.mutations";
import { AlertModal } from "@forever/ui-kit";
import { handleShowApiErrorWithToastMessages } from "@/utils/common.utils";

interface DeleteReviewModalProps {
  data: ReviewToDelete | undefined;
  closeModal: () => void;
  open: boolean;
}

const DeleteReviewModal = ({ data, closeModal, open }: DeleteReviewModalProps) => {
  const params = useParams();

  const { mutate, isPending } = useDeleteCommentMutation({
    onSuccess: (response) => {
      toast.success(response.data.message);
      closeModal();
    },
    onError: (error) => handleShowApiErrorWithToastMessages(error),
  })

  const handleDeleteComment = () => {
    if (params.id && data)
      mutate({ productId: params.id, commentId: data._id });
  };

  return (
    <AlertModal
      open={open}
      closeModal={closeModal}
      title="Are you sure you want to delete your comment?"
      description="This comment will be permanently deleted. Are you sure you still want to delete it?"
      onCancel={closeModal}
      onConfirm={handleDeleteComment}
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

export default DeleteReviewModal;
