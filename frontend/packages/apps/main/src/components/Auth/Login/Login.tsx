import { type SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import styles from "./Login.module.scss";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/store/auth/actions";
import { useLoginMutation } from "@/services/hooks/mutations/auth.mutations";
import ResetPasswordModal from "@/components/Auth/Register/ResetPasswordModal/ResetPasswordModal";
import { Button, Input, Modal } from "@forever/ui-kit";
import { setLocalStorage } from "@forever/storage-kit";
import { FcGoogle } from "react-icons/fc";
import { GoogleOauthPopupActionButton, useGoogleOauth } from "@forever/google-oauth-kit";
import clsx from "clsx";

type LoginProps = {
  chanceForm: () => void;
};

interface Login_Form_Types {
  email: string;
  password: string;
}

const Login = ({ chanceForm }: LoginProps) => {
  const navigate = useNavigate();
  const { isPopupOpen, loading } = useGoogleOauth();
  const form = useForm<Login_Form_Types>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLoginMutation({
    onSuccess: (data) => {
      setUser(data.data.user);
      setLocalStorage("accessToken", data.data.accessToken, 1000 * 60 * 60);
      toast.success(data.data.message);

      if (data.data.user.role === "ADMIN") {
        navigate("/admin/stats");
        return;
      }
      navigate("/profile");
    },
    onError: (error) => {
      const apiError = error?.response?.data?.error.errorMessage;
      if (typeof apiError === "string") toast.error(apiError);
    },
  })

  const onSubmit: SubmitHandler<Login_Form_Types> = (data) => mutate(data);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const ShowPasswordIcon = showPassword ? FaEye : FaEyeSlash;

  return (
    <div className={styles.login_wrapper}>
      <Modal wrapperClassName={styles.reset_password_request_modal_wrapper} open={modal} closeModal={() => setModal(false)}>
        <ResetPasswordModal closeModal={() => setModal(false)} />
      </Modal>
      <h5>Login</h5>
      <form
        className={styles.login_form}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Input
          size="lg"
          className={styles.login_form_input}
          placeholder="Email"
          type="email"
          {...form.register("email", { required: "Email is required" })}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="email"
          render={({ message }) => (
            <p className={styles.login_form_error_message}>{message}</p>
          )}
        />
        <Input
          size="lg"
          className={styles.login_form_input}
          rightIcon={ShowPasswordIcon}
          rightIconOnClick={() => setShowPassword(!showPassword)}
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          {...form.register("password", { required: "Password is required" })}
        />
        <ErrorMessage
          errors={form.formState.errors}
          name="password"
          render={({ message }) => (
            <p className={styles.login_form_error_message}>{message}</p>
          )}
        />
        <div className={styles.login_form_interactions}>
          <span onClick={() => setModal(true)}>Forgot your password?</span>
          <span onClick={() => chanceForm()}>Create account</span>
        </div>
        <Button className={styles.login_form_btn} type="submit" loading={isPending}>
          Sign In
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

export default Login;
