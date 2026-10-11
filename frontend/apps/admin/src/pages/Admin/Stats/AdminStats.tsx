import { Helmet } from "react-helmet";
import StatCards from "@/components/Admin/Stats/StatCards/StatCards";
import StatCharts from "@/components/Admin/Stats/StatCharts/StatCharts";

const AdminStats = () => {
  return (
    <>
      <Helmet>
        <title>Stats - Admin Forever</title>
      </Helmet>
      <StatCards />
      <StatCharts />
    </>
  );
};

export default AdminStats;
