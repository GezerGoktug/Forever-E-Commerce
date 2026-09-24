import { IoChevronBackCircle } from "react-icons/io5";
import styles from "./NotFound.module.scss";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@forever/ui-kit"

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goToStatsPage = () => navigate("/stats");

  return (
    <div className={styles.error}>
      <Helmet>
        <title>Error - Forever</title>
      </Helmet>
      <h5>404</h5>
      <h6>Error</h6>
      <p>Page not found</p>
      <Button onClick={goToStatsPage}>
        <IoChevronBackCircle size={20} />
        Return admin main page
      </Button>
    </div>
  );
};

export default NotFoundPage;
