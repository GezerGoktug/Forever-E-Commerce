import { Image } from "@forever/ui-kit";
import styles from "./Hero.module.scss";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.hero_left}>
        <div className={styles.hero_left_content}>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className={styles.hero_left_top_title}
          >
            OUR BESTSELLERS
          </motion.div>
          <motion.h4
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={styles.hero_left_main_title}
          >
            Latest Arrivals
          </motion.h4>
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className={styles.hero_left_bottom_title}
          >
            SHOP NOW
          </motion.div>
        </div>
      </div>
      <div className={styles.hero_right}>
        <Image
          src="/hero_img.avif"
          fetchPriority="high"
          placeholder={
            <div className={styles.hero_img_placeholder} />
          }
          alt="hero_img"
          isDefaultAppNameUrl
        />
      </div>
    </div>
  );
};

export default Hero;
