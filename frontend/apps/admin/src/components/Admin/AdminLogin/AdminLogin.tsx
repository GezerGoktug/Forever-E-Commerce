import { useNavigate } from 'react-router-dom';
import styles from './AdminLogin.module.scss'
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useLoginMutation } from '@/services/hooks/mutations/auth.mutations';
import toast from 'react-hot-toast';
import { setUser } from '@/store/auth/actions';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import { Button, Input } from '@forever/ui-kit';
import { ErrorMessage } from '@hookform/error-message';
import Logo from '@/components/common/Logo/Logo';
import { setLocalStorage } from '@forever/storage-kit';
import { handleShowApiErrorWithToastMessages } from '@/utils/common.utils';

interface LoginFormValues {
    email: string;
    password: string;
}

const AdminLogin = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormValues>({
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
                navigate("/stats");
                return;
            }
            navigate("/profile");
        },
        onError: (error) => handleShowApiErrorWithToastMessages(error),
    })

    const ShowPasswordIcon = showPassword ? FaEye : FaEyeSlash;

    const onSubmit: SubmitHandler<LoginFormValues> = (data) => mutate(data);

    const toggleShowPassword = () => setShowPassword(!showPassword);

    return (
        <div className={styles.admin_login_wrapper}>
            <div className={styles.admin_login}>
                <Logo className={styles.logo} isAdminLogo />
                <h5>Admin Login</h5>
                <form
                    className={styles.admin_login_form}
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <Input
                        size="lg"
                        className={styles.admin_login_form_input}
                        placeholder="Email"
                        type="email"
                        {...form.register("email", { required: "Email is required" })}
                    />
                    <ErrorMessage
                        errors={form.formState.errors}
                        name="email"
                        render={({ message }) => (
                            <p className={styles.admin_login_form_error_message}>{message}</p>
                        )}
                    />
                    <Input
                        size="lg"
                        className={styles.admin_login_form_input}
                        rightIcon={ShowPasswordIcon}
                        rightIconOnClick={toggleShowPassword}
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        {...form.register("password", { required: "Password is required" })}
                    />
                    <ErrorMessage
                        errors={form.formState.errors}
                        name="password"
                        render={({ message }) => (
                            <p className={styles.admin_login_form_error_message}>{message}</p>
                        )}
                    />
                    <Button className={styles.admin_login_form_btn} type="submit" loading={isPending}>
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
