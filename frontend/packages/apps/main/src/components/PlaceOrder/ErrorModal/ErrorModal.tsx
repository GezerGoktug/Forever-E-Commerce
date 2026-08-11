import styles from "./ErrorModal.module.scss";
import { MdOutlineError } from "react-icons/md";
import { FaXmark } from "react-icons/fa6";
import { type FieldErrors } from "react-hook-form";
import { Button, Modal } from "@forever/ui-kit";

const ErrorModal = ({
  open,
  closeModal,
  errors,
}: {
  open: boolean;
  closeModal: () => void;
  errors: FieldErrors;
}) => {
  return (
    <Modal
      open={open}
      closeModal={closeModal}
      className={styles.error_modal}
      closeBtnClassname={styles.error_modal_close_btn}
    >
      <div className={styles.error_modal_content}>
        <div className={styles.error_modal_header}>
          <MdOutlineError className={styles.error_modal_icon} size={35} />
          <h6>Error</h6>
        </div>
        <div className={styles.errors}>
          {Object.values(errors).map((error, i) => (
            <span key={"error_" + i} className={styles.error_item}>
              <span className={styles.dot_icon}>&#9679;</span>{" "}
              {error?.message as string} <br />
            </span>
          ))}
        </div>
        <div className={styles.error_modal_actions}>
          <Button
            onClick={() => closeModal()}
            rightIconSize={15}
            rightIcon={FaXmark}
            className={styles.error_modal_btn}
            variant="danger"
          >
            CLOSE
          </Button>
        </div>
      </div>
    </Modal>

  );
};

export default ErrorModal;
