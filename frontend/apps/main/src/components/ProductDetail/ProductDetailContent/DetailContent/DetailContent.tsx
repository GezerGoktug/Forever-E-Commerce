import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import styles from "./DetailContent.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import type { ProductDetailContent, SizeType } from "@/types/product.type";
import { addProductToCart } from "@/store/cart/actions";
import toast from "react-hot-toast";
import { useIsAccess } from "@/store/auth/hooks";
import { useHandleFavouriteMutation } from "@/services/hooks/mutations/product.mutations";
import { Button, RatingStars } from "@forever/ui-kit";
import { getSize } from "@/utils/product.utils";
import { handleShowApiErrorWithToastMessages } from "@/utils/common.utils";

const DetailContent = ({
  productDetail,
}: {
  productDetail: ProductDetailContent & { isFav: boolean };
}) => {
  const isAccess = useIsAccess();

  const [selectedSize, setSelectedSize] = useState<SizeType | null>(null);
  const [isFav, setIsFav] = useState(false);

  const { mutate } = useHandleFavouriteMutation({
    onSuccess: (data) => {
      toast.success(data.data.message);
      setIsFav(!isFav);
    },
    onError: (error) => {
      setIsFav(!isFav)
      handleShowApiErrorWithToastMessages(error)
    }
  })

  useEffect(() => {
    setIsFav(productDetail.isFav);
  }, [productDetail.isFav])

  useEffect(() => {
    if (!isAccess) {
      setIsFav(false)
    }
  }, [isAccess])

  const toggleFavourite = () => isAccess ? mutate({ productId: productDetail._id, isFav }) : toast.error('Please log in to add favourites');

  const handleAddCart = () => {
    if (selectedSize === null) {
      toast.error("Please select a size for product.");
      return;
    }
    addProductToCart({
      _id: productDetail._id,
      size: selectedSize,
      price: productDetail.price,
      name: productDetail.name,
      image: productDetail.image,
    });
    toast.success("Product added to your cart");
  };

  return (
    <div className={styles.product_detail}>
      <h4 className={styles.product_detail_title}>{productDetail.name}</h4>
      <div className={styles.product_detail_rating}>
        <RatingStars rating={Math.floor(productDetail.totalRating)} />
        <span>({productDetail.reviewsCount})</span>
      </div>
      <div className={styles.product_detail_price}>${productDetail.price}</div>
      <p className={styles.product_detail_desc}>
        {productDetail.description}
      </p>

      <div className={styles.product_detail_select_size}>
        <div className={styles.product_detail_select_size_title}>
          Select Size
        </div>
        <div className={styles.product_detail_sizes}>
          {productDetail.sizes.map((size) => (
            <div
              key={"product_detail_size_" + size}
              className={clsx({
                [styles.selected]: selectedSize === size,
              })}
              onClick={() => setSelectedSize(size)}
            >
              {getSize(size)}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.product_detail_actions}>
        <Button onClick={handleAddCart}>ADD TO CART</Button>
        <div onClick={toggleFavourite} className={styles.product_detail_fav_action_btn}>
          {isFav ? <IoMdHeart fill="red" size={20} /> : <IoMdHeartEmpty size={20} />}
        </div>
      </div>
      <div className={styles.product_detail_short_features}>
        <ul>
          <li>100% original product.</li>
          <li>Cash on delivery is available on this product.</li>
          <li>Easy return and exchange policy within 7 days.</li>
        </ul>
      </div>
    </div>
  );
};

export default DetailContent;
