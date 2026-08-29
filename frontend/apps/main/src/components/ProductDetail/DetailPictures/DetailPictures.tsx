import { useState } from "react";
import styles from "./DetailPictures.module.scss";
import { Image } from "@forever/ui-kit";
import TshirtIcon from "@/icons/TshirtIcon";
import { cloudinaryImageOptimizer } from "@forever/common-utils";

type DetailPicturesProps = {
  subImages: string[];
  image: string;
};

const DetailPictures = ({ images }: { images: DetailPicturesProps }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <div className={styles.detail_pictures_section}>
      <div className={styles.detail_pictures_section_left}>
        <Image
          wrapperClassname={styles.detail_pictures_section_left_img_wrapper}
          onClick={() => setActiveImage(images.subImages[0])}
          src={cloudinaryImageOptimizer(images.subImages[0])}
          alt=""
          placeholder={
            <div className={styles.detail_pictures_section_left_img_placeholder}>
              <TshirtIcon />
            </div>
          }
        />
        <Image
          wrapperClassname={styles.detail_pictures_section_left_img_wrapper}
          onClick={() => setActiveImage(images.subImages[1])}
          src={cloudinaryImageOptimizer(images.subImages[1])}
          alt=""
          placeholder={
            <div className={styles.detail_pictures_section_left_img_placeholder}>
              <TshirtIcon />
            </div>
          }
        />
        <Image
          wrapperClassname={styles.detail_pictures_section_left_img_wrapper}
          onClick={() => setActiveImage(images.subImages[2])}
          src={cloudinaryImageOptimizer(images.subImages[2])}
          alt=""
          placeholder={
            <div className={styles.detail_pictures_section_left_img_placeholder}>
              <TshirtIcon />
            </div>
          }
        />
        <Image
          wrapperClassname={styles.detail_pictures_section_left_img_wrapper}
          onClick={() => setActiveImage(images.subImages[3])}
          src={cloudinaryImageOptimizer(images.subImages[3])}
          alt=""
          placeholder={
            <div className={styles.detail_pictures_section_left_img_placeholder}>
              <TshirtIcon />
            </div>
          }
        />
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
