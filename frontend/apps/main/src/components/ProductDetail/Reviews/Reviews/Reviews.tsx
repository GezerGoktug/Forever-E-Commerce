import { IoMdTrash } from "react-icons/io";
import styles from "./Reviews.module.scss";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ReviewType } from "@/types/product.type";
import { HiDotsVertical } from "react-icons/hi";
import { GoPencil } from "react-icons/go";
import { lazy, Suspense, useState } from "react";
import { useAccount } from "@/store/auth/hooks";
import { Dropdown, RatingStars } from "@forever/ui-kit";

const EditReviewModal = lazy(() => import("@/components/ProductDetail/Reviews/EditReviewModal/EditReviewModal"));
const DeleteReviewModal = lazy(() => import("@/components/ProductDetail/Reviews/DeleteReviewModal/DeleteReviewModal"));

interface ModalState<T> {
  modal_type: "DELETE" | "EDIT";
  data: T;
}

export type DeleteReviewModalDTO = Pick<ReviewType, "_id">;

export type EditReviewModalDTO = Pick<ReviewType, "content" | "rating" | "_id">;

const Reviews = ({ reviews }: { reviews: ReviewType[] }) => {
  dayjs.extend(relativeTime);

  const user = useAccount();

  const [modal, setModal] = useState<ModalState<
    EditReviewModalDTO | DeleteReviewModalDTO
  > | null>(null);

  return (
    <div className={styles.reviews_wrapper}>
      <Suspense fallback={<div></div>}>
        <EditReviewModal
          open={modal?.modal_type === "EDIT"}
          closeModal={() => setModal(null)}
          data={modal?.data as EditReviewModalDTO | undefined}
        />
        <DeleteReviewModal
          closeModal={() => setModal(null)}
          open={modal?.modal_type === "DELETE"}
          data={modal?.data as DeleteReviewModalDTO | undefined}
        />
      </Suspense>
      <h5>{reviews.length} Reviews</h5>
      <div className={styles.reviews}>
        {reviews.map((item) => (
          <div key={item._id} className={styles.review_item}>
            <img src={item.user.image} alt="" />
            <div className={styles.review_item_right}>
              <div className={styles.review_item_infos}>
                <h6>{item.user.name}</h6>
                <div>&#9679;</div>
                <span>{dayjs(item.createdAt).fromNow()}</span>
                {user?.email === item.user.email && (
                  <Dropdown
                    trigger={<HiDotsVertical size={20} />}
                    listItems={[
                      {
                        icon: <IoMdTrash />,
                        label: "Delete",
                        onClick: () =>
                          setModal({
                            modal_type: "DELETE",
                            data: {
                              _id: item._id,
                            },
                          }),
                      },
                      {
                        icon: <GoPencil />,
                        label: "Update",
                        onClick: () =>
                          setModal({
                            modal_type: "EDIT",
                            data: {
                              _id: item._id,
                              content: item.content,
                              rating: item.rating,
                            },
                          }),
                      },
                    ]}
                    className={styles.review_dropdown}
                  />
                )}
              </div>
              <RatingStars
                rating={item.rating}
                className={styles.review_item_stars}
              />
              <p className={styles.review_item_content}>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
