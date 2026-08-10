import { type HTMLAttributes, type FC, type ReactNode } from "react";
import styles from "./Badge.module.scss";
import { clsx } from "clsx";
import { BiLoaderCircle } from "react-icons/bi";

interface BadgeProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger";
    size?: "xs" | "sm" | "md" | "lg" ;
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
    className
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
