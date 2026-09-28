import toast from "react-hot-toast";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useResetPasswordRequestMutation, useVerifyResetPasswordCodeMutation } from "@/services/hooks/mutations/user.mutations";
import { Button, PinInput } from "@forever/ui-kit";
import { handleShowApiErrorWithToastMessages } from "@/utils/common.utils";
import { useTimer } from "@forever/hook-kit";
import clsx from "clsx";
import styles from "./VerifyResetPasswordCode.module.scss";

const RESEND_CODE_COOLDOWN_SECOND = 60 * 2;

const convertSecondToDigitalTimeFormat = (second: number) => {
  const minutes = Math.floor(second / 60);
  const remainSecond = second % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainSecond.toFixed(0).toString().padStart(2, "0")}`
}

const VerifyResetPasswordCode = ({
  next,
  resetPasswordEmail,
  setResetPasswordToken
}: {
  next: () => void,
  resetPasswordEmail: string,
  setResetPasswordToken: Dispatch<SetStateAction<string>>
}) => {
  const [resetPasswordCode, setResetPasswordCode] = useState('');
  const [remainSecond, resetTimer] = useTimer(RESEND_CODE_COOLDOWN_SECOND, "reset-password-code");

  const { mutate, isPending } = useVerifyResetPasswordCodeMutation({
    onSuccess: (data) => {
      setResetPasswordToken(data.data.token);
      toast.success(data.data.message);
      next();
    },
    onError: (error) => handleShowApiErrorWithToastMessages(error)
  });

  const { mutate: resendCode, isPending: isResendPending } = useResetPasswordRequestMutation({
    onSuccess: (data) => {
      toast.success(data.data.message);
      resetTimer();
    },
    onError: (error) => handleShowApiErrorWithToastMessages(error)
  });

  const handleVerifyResetPasswordCode = () => mutate({ resetPasswordCode, resetPasswordEmail })

  const handleResendCode = () => {
    if (remainSecond > 0 || isResendPending) return;
    resendCode(resetPasswordEmail);
  }

  return (
    <>
      <h6>Verify Reset Password Code</h6>
      <p>You can verify with fill your code from incoming in your gmail box from below</p>
      <PinInput
        characterLength={6}
        onInputChange={setResetPasswordCode}
      />
      <div className={styles.verify_reset_password_code_resend}>
        <span>Didn't receive the code?</span>
        <span
          onClick={handleResendCode}
          className={clsx(styles.verify_reset_password_code_resend_link, {
            [styles.disabled]: remainSecond > 0 || isResendPending,
          })}
        >
          Resend
        </span>
        {remainSecond > 0 && (
          <span className={styles.verify_reset_password_code_resend_timer}>
            {convertSecondToDigitalTimeFormat(remainSecond)}
          </span>
        )}
      </div>
      <Button
        loading={isPending}
        onClick={handleVerifyResetPasswordCode}>
        VERIFY
      </Button>
    </>
  )
}

export default VerifyResetPasswordCode
