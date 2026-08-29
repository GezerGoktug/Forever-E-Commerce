import styles from "./WhyChooseUs.module.scss";
import { motion } from "framer-motion";

const WhyChooseUs = () => {
  return (
    <div className={styles.why_choose_us_wrapper}>
      <h5>
        WHY <span>CHOOSE US</span>
      </h5>
      <div className={styles.why_choose_us}>
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={styles.why_choose_us_item}
        >
          <h6>Quality Assurance:</h6>
          <p>
            We meticulously select and vet each product to ensure it meets our
            stringent quality standards.
          </p>
        </motion.div>
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3,delay:0.2 }}
          className={styles.why_choose_us_item}
        >
          <h6>Convenience:</h6>
          <p>
            With our user-friendly interface and hassle-free ordering process,
            shopping has never been easier.
          </p>
        </motion.div>
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3,delay:0.4 }}
          className={styles.why_choose_us_item}
        >
          <h6>Exceptional Customer Service:</h6>
          <p>
            Our team of dedicated professionals is here to assist you the way,
            ensuring your satisfaction is our top priority.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
