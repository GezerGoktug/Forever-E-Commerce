import { Link } from "react-router-dom";
import styles from "./HeaderRight.module.scss";
import { RiHeartLine, RiUser3Line } from "react-icons/ri";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { IoSunny } from "react-icons/io5";
import { FaBars, FaMoon } from "react-icons/fa6";
import { useState } from "react";
import { useTotalCartQuantities } from "@/store/cart/hooks";
import { useIsAccess } from "@/store/auth/hooks";
import { useGetFavProductsCountQuery } from "@/services/hooks/queries/product.query";
import { useTheme } from "@forever/theme-kit"
import { Badge, Drawer, Tooltip } from "@forever/ui-kit";
import NavMenuDrawer from "./NavMenuDrawer/NavMenuDrawer";

const HeaderRight = () => {
  const isAccess = useIsAccess();
  const totalQuantity = useTotalCartQuantities();
  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useGetFavProductsCountQuery([isAccess ? "favProductEnabled" : "favProductDisabled"], {
    enabled: isAccess,
  });

  const NAV_MENU_LINKS = [
    {
      render: (
        <Tooltip message="Change Theme" >
          {
            theme === "dark" ?
              <FaMoon
                className={styles.theme_icon}
                size={25}
                onClick={() => setTheme("light")}
              /> :
              <IoSunny
                className={styles.theme_icon}
                size={25}
                onClick={() => setTheme("dark")}
              />
          }
        </Tooltip>
      )
    },
    {
      icon: RiUser3Line,
      href: "/profile",
      message: "Profile",
    },
    {
      icon: RiHeartLine,
      href: "/favourite",
      message: "Favourite",
      badge: (
        <Badge
          className={styles.header_right_link_badge}
          size="xs"
          loading={isLoading}
          variant="danger"
        >
          {data?.data.count ?? 0}
        </Badge>
      )
    },
    {
      icon: HiOutlineShoppingBag,
      href: "/cart",
      message: "Cart",
      badge: (
        <Badge
          className={styles.header_right_link_badge}
          size="xs"
          variant="primary"
        >
          {totalQuantity}
        </Badge>
      )
    },
    {
      icon: FaBars,
      menuIcon: true,
    }
  ];

  const closeNavMenuDrawer = () => setIsOpen(false);

  const toggleNavMenuDrawer = () => setIsOpen(!isOpen);

  return (
    <div>
      <Drawer align="right" isDisableCloseBtn={true} className={styles.nav_menu_drawer} open={isOpen} onClose={closeNavMenuDrawer}>
        <NavMenuDrawer onClose={closeNavMenuDrawer} />
      </Drawer>
      <nav>
        <ul className={styles.header_right_links}>
          {NAV_MENU_LINKS.map(({ render, menuIcon, icon: Icon, message, href, badge }, i) => (
            <li key={"header_links_" + i}>
              {render ?? (menuIcon
                ? <Icon
                  onClick={toggleNavMenuDrawer}
                  className={styles.toggle_menu_icon}
                  size={25}
                />
                : <Tooltip message={message ?? ""}>
                  <Link to={{ pathname: href }}>
                    <Icon size={25} />
                    {badge}
                  </Link>
                </Tooltip>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default HeaderRight;
