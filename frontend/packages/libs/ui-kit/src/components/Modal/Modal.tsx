import { type FC, type ReactNode } from "react";
import styles from "./Modal.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import Backdrop from "../Backdrop/Backdrop";
import Overlay from "../Overlay/Overlay";
import { OutsideClickHandler } from "@forever/common-utils";
import { MdOutlineClose } from "react-icons/md";
import clsx from "clsx";

interface ModalProps {
  children: ReactNode;
  open: boolean;
  closeModal: () => void;
  className?: string,
  wrapperClassName?: string
}

const Modal: FC<ModalProps> = ({
  children,
  open,
  closeModal,
  className,
  wrapperClassName
}) => {
  return (
    <AnimatePresence>
      {open && (
        <Overlay>
          <Backdrop>
            <div className={clsx(styles.modal_wrapper, wrapperClassName)}>
              <OutsideClickHandler onOutsideClick={() => closeModal()}>
                <motion.div
                  initial={{ scale: 0.7, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className={clsx(styles.modal_content, className)}
                >
                  {children}
                  <MdOutlineClose
                    size={25}
                    className={styles.modal_close_btn}
                    onClick={() => closeModal()}
                  />
                </motion.div>
              </OutsideClickHandler>
            </div>
          </Backdrop>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default Modal;