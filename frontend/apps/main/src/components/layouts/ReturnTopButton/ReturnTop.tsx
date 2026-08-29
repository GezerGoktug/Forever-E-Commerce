import { FaArrowUp } from "react-icons/fa6";
import styles from "./ReturnTop.module.scss";
import {
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
  motion,
} from "framer-motion";
import { useState } from "react";

const ReturnTop = () => {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (val) => {
    if (val > 500) {
      setShow(true);
    } else {
      setShow(false);
    }
  });

  
  const returnTopHandle = () => {
    window.scrollTo({
        top:0,
        behavior:"smooth"
    })
  }
  

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ rotate:180, y: 60, opacity: 0 }}
            animate={{rotate:0, y: 0, opacity: 1 }}
            exit={{rotate:180, y: 60, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={styles.return_top_btn}
            onClick={returnTopHandle}
          >
            <FaArrowUp size={25} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReturnTop;
