import { useMultipleStepForm } from "@forever/hook-kit";
import ChangePassword from "./Steps/ChangePassword";
import ResetPasswordRequest from "./Steps/ResetPasswordRequest";
import VerifyResetPasswordCode from "./Steps/VerifyResetPasswordCode";
import styles from './ResetPasswordModal.module.scss';
import { useEffect, useRef, useState } from "react";
import { Modal } from "@forever/ui-kit";

interface ResetPasswordModalProps {
  open: boolean;
  closeModal: () => void;
}

const ResetPasswordModal = ({ open, closeModal }: ResetPasswordModalProps) => {

  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [resetPasswordToken, setResetPasswordToken] = useState('');
  const callbackRef = useRef(() => { });

  const handleNext = () => callbackRef.current();

  const { next, step } = useMultipleStepForm([
    <ResetPasswordRequest
      resetPasswordEmail={resetPasswordEmail}
      setResetPasswordEmail={setResetPasswordEmail}
      next={handleNext}
    />,
    <VerifyResetPasswordCode
      setResetPasswordToken={setResetPasswordToken}
      resetPasswordEmail={resetPasswordEmail}
      next={handleNext}
    />,
    <ChangePassword
      closeModal={closeModal}
      resetPasswordEmail={resetPasswordEmail}
      resetPasswordToken={resetPasswordToken}
    />,
  ]);

  useEffect(() => {
    callbackRef.current = () => next();
  }, [next])

  return (
    <Modal
      wrapperClassName={styles.reset_password_request_modal_wrapper}
      open={open}
      closeModal={closeModal}
    >
      <div className={styles.reset_password_request_modal_content}>{step}</div>
    </Modal>
  );
};

export default ResetPasswordModal;
