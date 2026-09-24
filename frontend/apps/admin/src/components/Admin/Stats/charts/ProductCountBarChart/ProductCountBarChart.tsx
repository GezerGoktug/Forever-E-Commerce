import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard, { chartTooltipClassName } from "../ChartCard/ChartCard";
import type { ProductCountEntry } from "@/types/admin.type";

const truncateAxisLabel = (value: string) =>
  value.length > 10 ? value.slice(0, 10) + "..." : value;

interface ProductCountBarChartProps {
  title: string;
  data: ProductCountEntry[] | undefined;
  color: string;
  labelFontSize?: number;
}

const ProductCountBarChart = ({
  title,
  data,
  color,
  labelFontSize,
}: ProductCountBarChartProps) => {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis
            tickFormatter={truncateAxisLabel}
            {...(labelFontSize && { fontSize: labelFontSize })}
            dataKey="_id"
            stroke="#000000"
          />
          <YAxis stroke={color} />

          <Tooltip wrapperClassName={chartTooltipClassName} />
          <Bar
            barSize={50}
            dataKey="counts"
            fill={color}
            radius={[5, 5, 0, 0]}
            name="Count"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default ProductCountBarChart;
