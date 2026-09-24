import { useState } from "react";
import styles from "./DetailPictures.module.scss";
import { Image } from "@forever/ui-kit";
import TshirtIcon from "@/icons/TshirtIcon";
import { cloudinaryImageOptimizer } from "@forever/common-utils";

type ProductImages = {
  subImages: string[];
  image: string;
};

const DetailPictures = ({ images }: { images: ProductImages }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <div className={styles.detail_pictures_section}>
      <div className={styles.detail_pictures_section_left}>
        {images.subImages.slice(0, 4).map((subImage, index) => (
          <Image
            key={subImage || index}
            wrapperClassname={styles.detail_pictures_section_left_img_wrapper}
            onClick={() => setActiveImage(subImage)}
            src={cloudinaryImageOptimizer(subImage)}
            alt=""
            placeholder={
              <div className={styles.detail_pictures_section_left_img_placeholder}>
                <TshirtIcon />
              </div>
            }
          />
        ))}
      </div>
      <div className={styles.detail_pictures_section_right}>
        <Image
          className={styles.detail_pictures_section_right_img}
          wrapperClassname={styles.detail_pictures_section_right_img_wrapper}
          src={cloudinaryImageOptimizer(activeImage || images.image)}
          placeholder={
            <div className={styles.detail_pictures_section_right_img_placeholder}>
              <TshirtIcon />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default DetailPictures;
