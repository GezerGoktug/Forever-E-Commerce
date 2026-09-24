import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import ChartCard, { chartTooltipClassName } from "../ChartCard/ChartCard";
import type { CategoryOrderDistribution } from "@/types/admin.type";

const SLICE_COLORS = ["#1b1d89", "#9000c4", "#177439"];

interface OrderDistributionPieChartProps {
  title: string;
  data: CategoryOrderDistribution[] | undefined;
}

const OrderDistributionPieChart = ({
  title,
  data,
}: OrderDistributionPieChartProps) => {
  const slices = data?.map((item) => ({
    name: item._id.subCategory,
    orderCount: item.orderCount,
  }));

  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={slices}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            outerRadius={120}
            dataKey="orderCount"
          >
            {slices?.map((slice, index) => (
              <Cell
                key={slice.name}
                fill={SLICE_COLORS[index % SLICE_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip wrapperClassName={chartTooltipClassName} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default OrderDistributionPieChart;
