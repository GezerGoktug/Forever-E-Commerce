import { IoChevronBackCircle } from "react-icons/io5";
import styles from "./Error.module.scss";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@forever/ui-kit"

const Error = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.error}>
      <Helmet>
        <title>Error - Forever</title>
      </Helmet>
      <h5>404</h5>
      <h6>Error</h6>
      <p>Page not founded</p>
      <Button onClick={() => navigate("/stats")}>
        <IoChevronBackCircle size={20} />
        Return admin main page
      </Button>
    </div>
  );
};

export default Error;
