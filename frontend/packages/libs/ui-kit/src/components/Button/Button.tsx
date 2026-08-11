import { type ButtonHTMLAttributes, type FC, type ReactNode } from "react";
import styles from "./Button.module.scss";
import clsx from "clsx";
import { BiLoaderCircle } from "react-icons/bi";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        { [styles.loading]: loading },
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <BiLoaderCircle size={20} className={styles.loaderIcon} />
          <span className={styles.loaderText}>Loading</span>
        </>
      ) : (
        <>{children}</>
      )}
    </button>
  );
};

export default Button;
