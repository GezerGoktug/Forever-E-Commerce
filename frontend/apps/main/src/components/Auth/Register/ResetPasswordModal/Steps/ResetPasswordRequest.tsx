import toast from "react-hot-toast";
import { useResetPasswordRequestMutation } from "@/services/hooks/mutations/user.mutations";
import { Button, Input } from "@forever/ui-kit";
import type { Dispatch, SetStateAction } from "react";

const ResetPasswordRequest = ({
  next,
  setResetPasswordEmail,
  resetPasswordEmail
}: {
  next: () => void,
  setResetPasswordEmail: Dispatch<SetStateAction<string>>,
  resetPasswordEmail: string
}) => {

  const { mutate, isPending } = useResetPasswordRequestMutation({
    onSuccess: (data) => {
      toast.success(data.data.message);
      next()
    },
    onError: (error) => {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    }
  });

  const handleResetPasswordRequest = () => mutate(resetPasswordEmail)

  return (
    <>
      <h6>Reset Password Request</h6>
      <p>You can send reset password request code to your email account with fill your email from below</p>
      <Input
        placeholder="Your Email"
        size="lg"
        type="email"
        onChange={(e) => {
          setResetPasswordEmail(e.target.value)
        }}
      />
      <Button
        loading={isPending}
        onClick={() => handleResetPasswordRequest()}>
        SEND REQUEST
      </Button>


    </>
  )
}

export default ResetPasswordRequest