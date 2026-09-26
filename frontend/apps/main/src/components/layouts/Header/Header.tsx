import styles from "./Header.module.scss";
import HeaderLeft from "./HeaderLeft/HeaderLeft";
import HeaderCenter from "./HeaderCenter/HeaderCenter";
import HeaderRight from "./HeaderRight/HeaderRight";

const Header = () => {
  return (
    <header className={styles.header}>
        <HeaderLeft/>
        <HeaderCenter/>
        <HeaderRight/>
    </header>
  );
};

export default Header;
