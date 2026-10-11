import styles from "./StatCharts.module.scss";
import { useGetAdminStatisticsQuery } from "@/services/hooks/queries/admin.query";
import { useIsAdmin } from "@/store/auth/hooks";
import BestSellingProductsChart from "../charts/BestSellingProductsChart/BestSellingProductsChart";
import OrderDistributionPieChart from "../charts/OrderDistributionPieChart/OrderDistributionPieChart";
import ProductCountBarChart from "../charts/ProductCountBarChart/ProductCountBarChart";
import SalesAreaChart from "../charts/SalesAreaChart/SalesAreaChart";
import GeoDistributionChart from "../charts/GeoDistributionChart/GeoDistributionChart";

const StatCharts = () => {
  const isAdmin = useIsAdmin();

  const { data } = useGetAdminStatisticsQuery({ enabled: isAdmin });

  return (
    <div className={styles.admin_stats_charts}>
      <div className={styles.admin_stats_chart_group}>
        <BestSellingProductsChart data={data?.data.bestSellingProducts} />
        <OrderDistributionPieChart
          title="Order Sub Category Distribution"
          data={data?.data.categoryOrderDistribution}
        />
      </div>
      <div className={styles.admin_stats_chart_group}>
        <ProductCountBarChart
          title="Sub Category Distribution"
          data={data?.data.productCountsByQueries.productCountsBySubCategory}
          color="#1a8595"
        />
        <ProductCountBarChart
          title="Category Distribution"
          data={data?.data.productCountsByQueries.productCountsByCategory}
          color="#681389"
          labelFontSize={16}
        />
      </div>
      <div className={styles.admin_stats_chart_group}>
        <SalesAreaChart
          title="Yearly Sales Graphic"
          data={data?.data.sales.yearlySales}
          color="#d500bc"
        />
        <SalesAreaChart
          title="Monthly Sales Graphic"
          data={data?.data.sales.monthlySales}
          color="#002ed5"
        />
      </div>
      <div className={styles.admin_stats_chart_group}>
        <SalesAreaChart
          title="Daily Sales Graphic"
          data={data?.data.sales.dailySales}
          color="#ff1010"
          rotateLabels
        />
        <GeoDistributionChart
          title="Geographic Order Distribution"
          data={data?.data.geographicDistribution}
        />
      </div>
    </div>
  );
};

export default StatCharts;
