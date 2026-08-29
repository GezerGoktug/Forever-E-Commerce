import { NavLink } from "react-router-dom";
import styles from "./HeaderCenter.module.scss";
import clsx from "clsx";

const HeaderCenter = () => {
  const links = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Collection",
      href: "/collection",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ];
  return (
    <nav>
      <ul className={styles.header_center_links}>
        {links.map((link, i) => (
          <li key={"header_links_" + i}>
            <NavLink
              className={({ isActive }) => clsx({ [styles.active]: isActive })}
              to={link.href}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default HeaderCenter;
