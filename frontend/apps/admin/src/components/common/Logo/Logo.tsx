import clsx from "clsx";
import styles from "./Logo.module.scss";
import { useThemeStore } from "@forever/theme-kit";

interface LogoProps {
  className?: string
  isAdminLogo?: boolean
}
const LOGO_SOURCES = {
  ADMIN: { dark: "/@forever-static/images/admin-logo-dark.png", light:  "/@forever-static/images/admin-logo.png" },
  DEFAULT: { dark: "/@forever-static/images/logo_dark.png", light: "/@forever-static/images/logo.png" },
}

const Logo = ({ className, isAdminLogo = false }: LogoProps) => {  
  const { theme } = useThemeStore();
  return (
    <div className={clsx(styles.logo, className)}>
      <img src={isAdminLogo ? LOGO_SOURCES.ADMIN[theme || "light"] : LOGO_SOURCES.DEFAULT[theme || "light"]} alt="logo" />
    </div>
  );
};

export default Logo;
