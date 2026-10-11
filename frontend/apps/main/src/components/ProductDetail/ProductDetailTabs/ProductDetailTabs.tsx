import { useState } from "react";
import clsx from "clsx";
import styles from "./ProductDetailTabs.module.scss";
import Description from "./Description/Description";
import CreateReview from "./Reviews/CreateReview/CreateReview";
import Reviews from "./Reviews/Reviews";
import type { Review } from "@/types/product.type";

interface ProductDetailTabsProps {
  isPending: boolean;
  reviews: Review[];
  reviewsCount?: number;
}

const ProductDetailTabs = ({ isPending, reviews, reviewsCount }: ProductDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  const showDescriptionTab = () => setActiveTab("description");
  const showReviewsTab = () => setActiveTab("reviews");

  if (isPending) {
    return (
      <>
        <div className={styles.product_detail_skeleton_tabs} />
        <div className={styles.product_detail_skeleton_tab_contents} />
      </>
    );
  }

  return (
    <div className={styles.product_detail_bottom}>
      <div className={styles.product_detail_tab}>
        <div
          className={clsx({ [styles.active]: activeTab === "description" })}
          onClick={showDescriptionTab}
        >
          Description
        </div>
        <div
          className={clsx({ [styles.active]: activeTab === "reviews" })}
          onClick={showReviewsTab}
        >
          Reviews ({reviewsCount})
        </div>
      </div>
      <div className={styles.product_detail_tab_content}>
        {activeTab === "description" ? (
          <Description />
        ) : (
          <div>
            <CreateReview />
            <Reviews reviews={reviews} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailTabs;
