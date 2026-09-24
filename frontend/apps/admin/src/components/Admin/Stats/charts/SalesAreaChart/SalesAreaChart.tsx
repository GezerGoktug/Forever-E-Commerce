import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard, { chartTooltipClassName } from "../ChartCard/ChartCard";
import type { SalesEntry } from "@/types/admin.type";

interface SalesAreaChartProps {
  title: string;
  data: SalesEntry[] | undefined;
  color: string;
  rotateLabels?: boolean;
}

const SalesAreaChart = ({
  title,
  data,
  color,
  rotateLabels = false,
}: SalesAreaChartProps) => {
  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="_id"
            {...(rotateLabels && { angle: -45, height: 100, textAnchor: "end" })}
          />
          <YAxis />
          <Tooltip wrapperClassName={chartTooltipClassName} />
          <Area type="monotone" dataKey="totalSales" stroke={color} fill={color} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default SalesAreaChart;
