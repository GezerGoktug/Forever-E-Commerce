import { IoChevronBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Button } from "@forever/ui-kit";
import styles from "./NotFoundContent.module.scss";

const NotFoundContent = () => {
  const navigate = useNavigate();

  const goToHomePage = () => navigate("/");

  return (
    <div className={styles.not_found}>
      <h5>404</h5>
      <h6>Error</h6>
      <p>Page not found</p>
      <Button onClick={goToHomePage}>
        <IoChevronBackCircle size={20} />
        Return home page
      </Button>
    </div>
  );
};

export default NotFoundContent;
