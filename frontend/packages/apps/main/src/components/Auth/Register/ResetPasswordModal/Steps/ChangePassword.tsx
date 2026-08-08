import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import styles from "./ChangePassword.module.scss";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useResetPasswordMutation } from "@/services/hooks/mutations/user.mutations";
import { Button, Input } from "@forever/ui-kit";

const schema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /(?=(?:[^a-zA-Z]*[a-zA-Z]){4})/,
        "Password must contain at least 4 letters"
      ),
    newPasswordConfirm: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ChangePassword = ({
  resetPasswordEmail,
  closeModal,
  resetPasswordToken
}: {
  resetPasswordEmail: string,
  closeModal: () => void
  resetPasswordToken: string
}) => {

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: '',
      newPasswordConfirm: ''
    }
  })

  const { mutate } = useResetPasswordMutation({
    onSuccess: (data) => {
      toast.success(data.data.message);
      closeModal();
    },
    onError: (error) => {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => mutate({ newPassword: data.newPassword, resetPasswordEmail, resetPasswordToken })
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const ShowPasswordIcon = showPassword ? FaEye : FaEyeSlash;
  return (
    <>
      <h6>Change Password</h6>
      <p>You can change with fill your desire to new password from below</p>
      <form className={styles.change_password_form} onSubmit={form.handleSubmit(onSubmit)} >
        <Input
          size="lg"
          className={styles.change_password_form_input}
          rightIcon={ShowPasswordIcon}
          rightIconOnClick={() => setShowPassword(!showPassword)}
          placeholder="New Password"
          type={showPassword ? "text" : "password"}
          {...form.register("newPassword")}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="newPassword"
          render={({ message }) => (
            <p className={styles.change_password_form_error_message}>{message}</p>
          )}
        />
        <Input
          size="lg"
          className={styles.change_password_form_input}
          placeholder="New Password Confirm"
          type='password'
          {...form.register("newPasswordConfirm")}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="newPasswordConfirm"
          render={({ message }) => (
            <p className={styles.change_password_form_error_message}>{message}</p>
          )}
        />
        <Button
          type="submit"
          loading={form.formState.isSubmitting}
        >
          CHANGE
        </Button>
      </form>
    </>
  )
}

export default ChangePassword