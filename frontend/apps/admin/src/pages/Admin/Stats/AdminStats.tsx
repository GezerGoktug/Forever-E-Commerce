import { Helmet } from "react-helmet";
import Stats from "@/components/Admin/Stats/Stats";

const AdminStats = () => {
  return (
    <>
      <Helmet>
        <title>Stats - Admin Forever</title>
      </Helmet>
      <Stats />
    </>
  );
};

export default AdminStats;
