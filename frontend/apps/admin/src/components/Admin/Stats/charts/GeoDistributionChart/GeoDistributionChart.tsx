import { Chart } from "react-google-charts";
import { useThemeStore } from "@forever/theme-kit";
import ChartCard from "../ChartCard/ChartCard";
import type { GeographicDistribution } from "@/types/admin.type";

const GEO_CHART_OPTIONS = {
  light: {
    colorAxis: { colors: ["#d4e4ff", "#08306b"] },
    backgroundColor: "#f8f9fa",
    datalessRegionColor: "#eeeeee",
    defaultColor: "#f5f5f5",
  },
  dark: {
    colorAxis: { colors: ["#93bbff", "#031530"] },
    backgroundColor: "#0e0e0e",
    datalessRegionColor: "#9c9c9c",
    defaultColor: "#f5f5f5",
  },
};

interface GeoDistributionChartProps {
  title: string;
  data: GeographicDistribution[] | undefined;
}

const GeoDistributionChart = ({ title, data }: GeoDistributionChartProps) => {
  const { theme } = useThemeStore();

  const geoDistributionRows = (data ?? []).map(
    ({ _id, totalIncome, orderCount }) => [_id, totalIncome, orderCount]
  );

  const geoChartData = [
    ["Country", "Total Income", "Order Count"],
    ...geoDistributionRows,
  ];

  return (
    <ChartCard title={title}>
      <Chart
        chartType="GeoChart"
        width="100%"
        height="400px"
        options={GEO_CHART_OPTIONS[theme === "dark" ? "dark" : "light"]}
        data={geoChartData}
      />
    </ChartCard>
  );
};

export default GeoDistributionChart;
