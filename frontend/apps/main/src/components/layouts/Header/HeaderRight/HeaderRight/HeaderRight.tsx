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
import { useThemeStore } from "@forever/theme-kit"
import { Badge, Drawer, Tooltip } from "@forever/ui-kit";
import NavMenuDrawer from "../NavMenuDrawer/NavMenuDrawer";


const HeaderRight = () => {
  const isAccess = useIsAccess();
  const totalQuantity = useTotalCartQuantities();
  const { theme, setTheme } = useThemeStore();

  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useGetFavProductsCountQuery([isAccess ? "favProductEnabled" : "favProductDisabled"], {
    enabled: isAccess,
  });

  const links = [
    {
      render: (
        <Tooltip message="Change Theme" >
          {
            theme === "dark" ? <FaMoon className={styles.theme_icon} size={25} onClick={() => setTheme("light")} /> : <IoSunny className={styles.theme_icon} size={25} onClick={() => setTheme("dark")} />
          }
        </Tooltip>
      ),
      isCustomItem: true
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
      badgeData: data?.data.count || 0,
      isCountBadge: true,
      isFavBadge: true,
    },
    {
      icon: HiOutlineShoppingBag,
      href: "/cart",
      isCountBadge: true,
      badgeData: totalQuantity,
      message: "Cart",
    },
    {
      icon: FaBars,
      menuIcon: true,
    }
  ];

  const closeNavMenuDrawer = () => setIsOpen(false);

  const toggleNavMenuDrawer = () => setIsOpen(!isOpen);

  return (
    <nav>
      <Drawer align="right" isDisableCloseBtn={true} className={styles.nav_menu_drawer} open={isOpen} onClose={closeNavMenuDrawer}>
        <NavMenuDrawer onClose={closeNavMenuDrawer} />
      </Drawer>
      <ul className={styles.header_right_links}>
        {links.map(({ icon: Icon, href, isCountBadge, menuIcon, badgeData, isFavBadge, message, isCustomItem, render }, i) => (
          <li key={"header_links_" + i}>
            {menuIcon ? (
              <>
                <Icon
                  onClick={toggleNavMenuDrawer}
                  className={styles.toggle_menu_icon}
                  size={25}
                />
              </>
            ) :
              isCustomItem ? render : (
                href && (
                  <Tooltip message={message}>
                    <Link to={{ pathname: href }}>
                      <Icon size={25} />
                      {isCountBadge && (
                        <Badge
                          className={styles.header_right_link_badge}
                          size="xs"
                          loading={isFavBadge ? isLoading : false}
                          variant={isFavBadge ? "danger" : "primary"}
                        >
                          {badgeData}
                        </Badge>
                      )}
                    </Link>
                  </Tooltip>
                )
              )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HeaderRight;
