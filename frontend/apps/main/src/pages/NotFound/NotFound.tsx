import { Helmet } from "react-helmet";
import NotFoundContent from "@/components/NotFound/NotFoundContent/NotFoundContent";

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Error - Forever</title>
      </Helmet>
      <NotFoundContent />
    </>
  );
};

export default NotFoundPage;
