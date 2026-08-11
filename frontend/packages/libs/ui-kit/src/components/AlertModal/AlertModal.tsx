import { type ComponentProps, type FC, type ReactNode } from "react";
import styles from "./AlertModal.module.scss";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import clsx from "clsx";

type ButtonProps = ComponentProps<typeof Button>;

interface AlertModalProps {
  open: boolean;
  closeModal: () => void;
  title: ReactNode;
  titleClassName?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmBtnContent?: ReactNode;
  cancelBtnContent?: ReactNode;
  cancelBtnProps?: Omit<ButtonProps, "onClick">;
  confirmBtnProps?: Omit<ButtonProps, "onClick" | "loading" | "children">;
  customActionContent?: ReactNode;
}

const AlertModal: FC<AlertModalProps> = ({
  open,
  closeModal,
  title,
  titleClassName,
  description,
  descriptionClassName,
  loading = false,
  onCancel,
  onConfirm,
  confirmBtnContent = "CONFIRM",
  cancelBtnContent = "CANCEL",
  cancelBtnProps,
  confirmBtnProps,
  customActionContent,
}) => {
  return (
    <Modal open={open} closeModal={closeModal}>
      <div className={styles.alert_modal_content}>
        <h6 className={titleClassName}>{title}</h6>
        {description &&
          (typeof description === "string" ? (
            <p className={clsx(styles.alert_modal_description, descriptionClassName)}>{description}</p>
          ) : (
            <div className={clsx(styles.alert_modal_description, descriptionClassName)}>{description}</div>
          ))}
        {customActionContent ?? (
          <div className={styles.alert_modal_btn_group}>
            <Button
              size="sm"
              variant="secondary"
              onClick={onCancel}
              {...cancelBtnProps}
            >
              {cancelBtnContent}
            </Button>
            <Button
              size="sm"
              variant="danger"
              loading={loading}
              onClick={onConfirm}
              {...confirmBtnProps}
            >
              {confirmBtnContent}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AlertModal;
