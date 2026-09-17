import type { BaseHTMLAttributes, FC, ReactNode } from "react";
import styles from "./Badge.module.scss";
import { clsx } from "clsx";
import { BiLoaderCircle } from "react-icons/bi";

interface BadgeProps extends BaseHTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger";
    size?: "xs" | "sm" | "md" | "lg";
    loading?: boolean;
    customLoadingContent?: ReactNode;
    className?: string
}

const Badge: FC<BadgeProps> = ({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    customLoadingContent,
    className,
    ...props
}) => {
    return (
        <div
            className={clsx(
                styles.badge,
                styles[variant],
                styles[size],
                { [styles.loading]: loading },
                className
            )}
            {...props}
        >
            {loading ? (
                customLoadingContent ?? (
                    <BiLoaderCircle className={styles.loaderIcon} />
                )
            ) : (
                children
            )}
        </div>
    );
};

export default Badge;
