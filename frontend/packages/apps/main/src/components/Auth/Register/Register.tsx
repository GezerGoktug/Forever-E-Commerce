import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import styles from "./Register.module.scss";
import { ErrorMessage } from "@hookform/error-message";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setUser } from "@/store/auth/actions";
import ResetPasswordModal from "./ResetPasswordModal/ResetPasswordModal";
import { useRegisterMutation } from "@/services/hooks/mutations/auth.mutations";
import { Button, Input, Modal } from "@forever/ui-kit";
import { setLocalStorage } from "@forever/storage-kit";
import { GoogleOauthPopupActionButton, useGoogleOauth } from "@forever/google-oauth-kit";
import clsx from "clsx";

type RegisterProps = {
  chanceForm: () => void;
};

const schema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("İnvalid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /(?=(?:[^a-zA-Z]*[a-zA-Z]){4})/,
        "Password must contain at least 4 letters"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = ({ chanceForm }: RegisterProps) => {
  const navigate = useNavigate();
  const { isPopupOpen, loading } = useGoogleOauth();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useRegisterMutation({
    onSuccess(data) {
      setUser(data.data.user);
      setLocalStorage("accessToken", data.data.accessToken, 1000 * 60 * 60);
      toast.success(data.data.message);
      navigate("/profile");
    },
    onError(error) {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
      if (apiError && typeof apiError === "object") {
        Object.entries(apiError).forEach(([key, value]) => {
          value.forEach((val) => {
            toast.error(`${key} : ${val}`);
          });
        });
      }
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => mutate(data);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const ShowPasswordIcon = showPassword ? FaEye : FaEyeSlash;

  return (
    <div className={styles.register_wrapper}>
      <Modal wrapperClassName={styles.reset_password_request_modal_wrapper} open={modal} closeModal={() => setModal(false)}>
        <ResetPasswordModal closeModal={() => setModal(false)} />
      </Modal>
      <h5>Sign Up</h5>
      <form
        className={styles.register_form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Input
          size="lg"
          className={styles.register_form_input}
          placeholder="Name"
          type="text"
          {...form.register("name")}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="name"
          render={({ message }) => (
            <p className={styles.register_form_error_message}>{message}</p>
          )}
        />
        <Input
          size="lg"
          className={styles.register_form_input}
          placeholder="Email"
          type="email"
          {...form.register("email")}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="email"
          render={({ message }) => (
            <p className={styles.register_form_error_message}>{message}</p>
          )}
        />
        <Input
          size="lg"
          className={styles.register_form_input}
          rightIcon={ShowPasswordIcon}
          rightIconOnClick={() => setShowPassword(!showPassword)}
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          {...form.register("password")}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="password"
          render={({ message }) => (
            <p className={styles.register_form_error_message}>{message}</p>
          )}
        />
        <Input
          size="lg"
          className={styles.register_form_input}
          placeholder="Confirm password"
          type="password"
          {...form.register("confirmPassword")}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="confirmPassword"
          render={({ message }) => (
            <p className={styles.register_form_error_message}>{message}</p>
          )}
        />
        <div className={styles.register_form_interactions}>
          <span onClick={() => setModal(true)}>Forgot your password?</span>
          <span onClick={() => chanceForm()}>Login here</span>
        </div>
        <Button className={styles.register_form_btn} type="submit" loading={isPending} >
          Sign Up
        </Button>
      </form>
      <div className={styles.login_with_app_provider_section}>
        <div className={styles.seperator}>
          <div />
          <span>OR</span>
          <div />
        </div>
        <GoogleOauthPopupActionButton>
          <div
            className={clsx(
              styles.login_with_google_btn,
              { [styles.isDisabled]: isPopupOpen || loading }
            )}
          >
            <FcGoogle size={30} />
            <span>Login with Google</span>
          </div>
        </GoogleOauthPopupActionButton>
      </div>
    </div>
  );
};

export default Register;
