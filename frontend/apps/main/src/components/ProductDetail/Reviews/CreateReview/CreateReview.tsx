import styles from "./CreateReview.module.scss";
import { useState } from "react";
import { useAccount, useIsAccess } from "@/store/auth/hooks";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCreateCommentMutation } from "@/services/hooks/mutations/product.mutations";
import { Button, Rating } from "@forever/ui-kit";
import { handleShowApiErrorWithToastMessages } from "@/utils/common.utils";

const CreateReview = () => {
  const params = useParams();

  const currentUser = useAccount();
  const isAccess = useIsAccess();

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [clearRating, setClearRating] = useState(false);

  const { mutate, isPending } = useCreateCommentMutation({
    onSuccess: (data) => {
      toast.success(data.data.message);
      setClearRating(false);
    },
    onError(error) {
      handleShowApiErrorWithToastMessages(error)
      setClearRating(false);
    },
  })

  const handleComment = () => {
    if (params.id) {
      mutate({
        rating,
        productId: params?.id,
        content,
      });
      setContent("");
      setClearRating(true);
    }
  };

  return (
    <>
      {isAccess ? (
        <div className={styles.create_review_wrapper}>
          <h5 className={styles.create_review_title}>Create Comment</h5>
          <div className={styles.create_review}>
            <img src={currentUser?.image} alt="" />
            <div className={styles.create_review_right}>
              <h6>{currentUser?.name}</h6>
              <Rating
                clearRating={clearRating}
                rateAction={setRating}
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={250}
                placeholder="Enter something "
                name=""
                id=""
              ></textarea>
              <Button
                loading={isPending}
                onClick={handleComment}
                className={styles.create_review_btn}
              >
                SEND
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.create_review_wrapper}>
          <h5 className={styles.create_review_title}>Create Comment</h5>
          <div className={styles.create_review_not_logged_content}>
            <p className={styles.create_review_not_logged_title}>
              You must be logged in to post a comment.
            </p>
            <Link to="/auth">
              <Button>LOGIN</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateReview;
