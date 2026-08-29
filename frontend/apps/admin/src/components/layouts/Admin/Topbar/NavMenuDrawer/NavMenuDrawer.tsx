import Logo from '@/components/common/Logo/Logo';
import styles from './NavMenuDrawer.module.scss'
import clsx from 'clsx';
import { AiOutlineProduct } from 'react-icons/ai';
import { IoIosList, IoIosStats } from 'react-icons/io';
import { IoAddCircleOutline, IoSunny } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { useThemeStore } from '@forever/theme-kit';
import { FaMoon } from 'react-icons/fa6';

const NavMenuDrawer = () => {
    const { theme, setTheme } = useThemeStore()
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
        <div className={styles.nav_menu} >
            <Logo isAdminLogo={true} className={styles.nav_menu_logo} />
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
    )
}

export default NavMenuDrawer