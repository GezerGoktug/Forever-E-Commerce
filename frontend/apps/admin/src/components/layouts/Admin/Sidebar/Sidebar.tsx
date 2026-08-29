import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import { IoAddCircleOutline } from "react-icons/io5";
import clsx from "clsx";
import { IoIosList, IoIosStats } from "react-icons/io";
import { AiOutlineProduct } from "react-icons/ai";

const Sidebar = () => {
  const links = [
    {
      icon: IoIosStats,
      href: "/stats",
      label: "Stats",
    },
    {
      icon: AiOutlineProduct,
      href: "/products",
      label: "Products",
    },
    {
      icon: IoAddCircleOutline,
      href: "/add-product",
      label: "Add Product",
    },
    {
      icon: IoIosList,
      href: "/orders",
      label: "Orders",
    },
  ];

  return (
    <div
      className={clsx(styles.sidebar)}
    >
      <nav>
        <ul>
          {links.map(({ icon: Icon, href, label }, i) => (
            <li key={"admin_link" + i}>
              <NavLink
                className={({ isActive }) =>
                  clsx(styles.nav_link, { [styles.active]: isActive })
                }
                to={href}
              >
                <Icon size={25} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
