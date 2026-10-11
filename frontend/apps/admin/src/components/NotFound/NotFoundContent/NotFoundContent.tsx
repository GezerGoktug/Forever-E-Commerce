import { IoChevronBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Button } from "@forever/ui-kit";
import { useIsAdmin } from "@/store/auth/hooks";
import styles from "./NotFoundContent.module.scss";

const NotFoundContent = () => {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();

  const goToMainPage = () => {
    if (isAdmin)
      navigate("/admin/stats");
    else
      window.location.href = "/";
  }

  return (
    <div className={styles.not_found}>
      <h5>404</h5>
      <h6>Error</h6>
      <p>Page not found</p>
      <Button onClick={goToMainPage}>
        <IoChevronBackCircle size={20} />
        Return main page
      </Button>
    </div>
  );
};

export default NotFoundContent;
