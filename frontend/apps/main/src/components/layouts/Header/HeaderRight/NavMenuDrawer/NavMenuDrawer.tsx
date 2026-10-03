import clsx from 'clsx'
import styles from './NavMenuDrawer.module.scss'
import { useTheme } from '@forever/theme-kit'
import { FaMoon } from 'react-icons/fa6'
import { IoSunny } from 'react-icons/io5'
import { MdArrowBackIos } from 'react-icons/md'
import { NavLink } from 'react-router-dom'

const NAV_MENU_LINKS = [
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

const NavMenuDrawer = ({
  onClose
}: {
  onClose: () => void
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <div className={styles.nav_menu_top}>
        <div onClick={onClose} className={styles.back_button}>
          <MdArrowBackIos />
          Back
        </div>
        <div className={styles.theme_button} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {
            theme === "dark" ?
              <>
                Dark
                <FaMoon size={25} />
              </>
              :
              <>
                Light
                <IoSunny size={25} />
              </>
          }
        </div>
      </div>
      <nav>
        <ul>
          {NAV_MENU_LINKS.map((link, i) => (
            <li key={"aside_link_" + i}>
              <NavLink
                onClick={onClose}
                to={link.href}
                className={({ isActive }) =>
                  clsx(styles.nav_menu_link, { [styles.active]: isActive })
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

export default NavMenuDrawer