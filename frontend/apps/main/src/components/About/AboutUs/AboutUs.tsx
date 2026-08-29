import { BaseImage } from "@forever/ui-kit";
import styles from "./AboutUs.module.scss";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div className={styles.about_wrapper}>
      <motion.h5
        initial={{ x: 250, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        ABOUT <span>US</span>
      </motion.h5>
      <div className={styles.about}>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}>
          <BaseImage src="/about_img.png" alt="" />
        </motion.div>
        <div className={styles.about_content}>
          <motion.p
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className={styles.about_desc_1}
          >
            Forever was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with a
            simple idea: to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from the
            comfort of their homes.
            <br />
            <br />
            Since our inception, we've worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference. From fashion and beauty to electronics and home
            essentials, we offer an extensive collection sourced from trusted
            brands and suppliers.
          </motion.p>
          <motion.h6
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            Our Mission
          </motion.h6>
          <motion.p
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className={styles.about_desc_2}
          >
            Our mission at Forever is to empower customers with choice,
            convenience, and confidence. We're dedicated to providing a seamless
            shopping experience that exceeds expectations, from browsing and
            ordering to delivery and beyond.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
