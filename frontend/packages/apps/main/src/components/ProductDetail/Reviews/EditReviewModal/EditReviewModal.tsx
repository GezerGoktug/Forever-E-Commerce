import { useEffect, useState } from "react";
import styles from "./EditReviewModal.module.scss";
import { FaPencil } from "react-icons/fa6";
import type { EditReviewModalDTO } from "@/components/ProductDetail/Reviews/Reviews/Reviews";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useUpdateCommentMutation } from "@/services/hooks/mutations/product.mutations";
import { Button, Modal, Rating } from "@forever/ui-kit";

interface EditReviewModalProps {
  data: EditReviewModalDTO | undefined;
  closeModal: () => void;
  open: boolean;
}

const EditReviewModal = ({ data, closeModal, open }: EditReviewModalProps) => {
  const params = useParams();

  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (open && data) {
      setRating(data.rating);
      setContent(data.content);
    }
  }, [open, data]);


  const { mutate, isPending } = useUpdateCommentMutation({
    onSuccess: (data) => {
      toast.success(data.data?.message);
      closeModal();
    },
    onError: (error) => {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    }
  })

  const updateComment = () => {
    if (params.id && data) {
      const body = {
        rating,
        content,
        productId: params.id,
      };
      mutate({ commentId: data._id, body });
    }
  };

  return (
    <Modal open={open} closeModal={closeModal}>
      <div className={styles.edit_review_modal_wrapper}>
        <h6>Edit Comment</h6>
        <Rating
          defaultRating={data?.rating}
          rateAction={(rate: number) => setRating(rate)}
        />
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={250}
          placeholder="Enter something "
          name="edit-review-modal"
          id="edit-review-modal"
        ></textarea>
        <div className={styles.edit_review_modal_btn_group}>
          <Button onClick={() => closeModal()} size="sm" variant="secondary">
            CANCEL
          </Button>
          <Button
            size="sm"
            rightIcon={FaPencil}
            rightIconSize={15}
            loading={isPending}
            onClick={() => updateComment()}
          >
            UPDATE
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditReviewModal;
