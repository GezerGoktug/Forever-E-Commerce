import { useNavigate } from "react-router-dom";
import styles from "./Topbar.module.scss";
import { Button, Drawer } from "@forever/ui-kit";
import { FaBars, FaMoon } from "react-icons/fa6";
import { useState } from "react";
import Logo from "@/components/common/Logo/Logo";
import { useLogoutMutation } from "@/services/hooks/mutations/auth.mutations";
import toast from "react-hot-toast";
import { removeLocalStorage } from "@forever/storage-kit";
import { clearUser } from "@/store/auth/actions";
import NavMenuDrawer from "../NavMenuDrawer/NavMenuDrawer";
import { useThemeStore } from "@forever/theme-kit";
import { IoSunny } from "react-icons/io5";

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme, theme } = useThemeStore()
  const navigate = useNavigate();

  const { mutate, isPending } = useLogoutMutation({
    onSuccess() {
      clearUser();
      navigate("/login");
      removeLocalStorage("accessToken");
      toast.success("Logout succesfully");
    },
  })

  return (
    <div className={styles.topbar_wrapper}>
      <Drawer align="left" open={isOpen} onClose={() => setIsOpen(false)} className={styles.nav_menu_drawer}>
        <NavMenuDrawer />
      </Drawer>
      <div className={styles.topbar}>
        <div className={styles.topbar_left}>
          <FaBars
            onClick={() => setIsOpen(true)}
            size={25}
            className={styles.topbar_toggle_bar_icon}
          />
          <Logo isAdminLogo />
        </div>
        <div className={styles.topbar_right}>
          <div
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={styles.theme_btn}
          >
            {theme === "dark" ? <FaMoon size={25} /> : <IoSunny size={25} />}
          </div>
          <Button
            onClick={() => mutate()}
            size="sm"
            className={styles.topbar_logout_btn}
            loading={isPending}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
