import toast from "react-hot-toast";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useVerifyResetPasswordCodeMutation } from "@/services/hooks/mutations/user.mutations";
import { Button, PinInput } from "@forever/ui-kit";

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

  const { mutate, isPending } = useVerifyResetPasswordCodeMutation({
    onSuccess: (data) => {
      setResetPasswordToken(data.data.token);
      toast.success(data.data.message);
      next();
    },
    onError: (error) => {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    }
  });

  const handleVerifyResetPasswordCode = () => mutate({ resetPasswordCode, resetPasswordEmail })

  return (
    <>
      <h6>Verify Reset Password Code</h6>
      <p>You can verify with fill your code from incoming in your gmail box from below</p>
      <PinInput
        characterLength={6}
        onInputChange={(val) => setResetPasswordCode(val)}
      />
      <Button
        loading={isPending}
        onClick={() => handleVerifyResetPasswordCode()}>
        VERIFY
      </Button>
    </>
  )
}

export default VerifyResetPasswordCode