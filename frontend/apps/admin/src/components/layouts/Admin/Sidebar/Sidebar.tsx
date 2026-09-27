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
      href: "/admin/stats",
      label: "Stats",
    },
    {
      icon: AiOutlineProduct,
      href: "/admin/products",
      label: "Products",
    },
    {
      icon: IoAddCircleOutline,
      href: "/admin/add-product",
      label: "Add Product",
    },
    {
      icon: IoIosList,
      href: "/admin/orders",
      label: "Orders",
    },
  ];

  return (
    <div
      className={clsx(styles.sidebar)}
    >
      <nav>
        <ul>
          {links.map(({ icon: Icon, href, label }) => (
            <li key={href}>
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
