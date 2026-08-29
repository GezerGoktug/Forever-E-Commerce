import { BsInstagram } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";
import Logo from "@/components/common/Logo/Logo";

const Footer = () => {
  const links = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About us",
      href: "/about",
    },
    {
      label: "Delivery",
      href: "",
    },
    {
      label: "Privacy Policy",
      href: "",
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_top}>
        <div className={styles.footer_top_left}>
          <Logo/>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
        <div className={styles.footer_top_center}>
          <h5>COMPANY</h5>
          <ul>
            {links.map((link, i) => (
              <li key={"footer_link_" + i}>
                <Link to={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.footer_top_right}>
          <h5>GET IN TOUCH</h5>
          <div>+1-000-000-0000</div>
          <div className={styles.email}>forever@example.com</div>
          <div className={styles.social_media_icons}>
            <a href="#" target="_blank">
              <BsInstagram />
            </a>
            <a href="#" target="_blank">
              <FaXTwitter />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footer_bottom}>
        <p>Copyright 2024@ greatstack.dev - All Right Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
