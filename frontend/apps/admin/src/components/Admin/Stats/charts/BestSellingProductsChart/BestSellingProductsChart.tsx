import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import styles from "./BestSellingProductsChart.module.scss";
import ChartCard from "../ChartCard/ChartCard";
import type { BestSellingProduct } from "@/types/admin.type";

const truncateAxisLabel = (value: string) =>
  value.length > 10 ? value.slice(0, 10) + "..." : value;

const BestSellingTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || !payload.length)
    return null;

  const product = payload[0].payload as BestSellingProduct;

  return (
    <div className={styles.tooltip_container}>
      <img src={product.image} alt={product.name} className={styles.tooltip_image} />
      <div className={styles.tooltip_text}>
        <h6>{product.name}</h6>
        <p>
          Total Income: <span>${product.totalIncome}</span>
        </p>
        <p>
          Units sold: <span> {product.totalQuantitySold}</span>
        </p>
      </div>
    </div>
  );
};

interface BestSellingProductsChartProps {
  data: BestSellingProduct[] | undefined;
}

const BestSellingProductsChart = ({ data }: BestSellingProductsChartProps) => {
  return (
    <ChartCard title="Best selling products">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis
            angle={-60}
            textAnchor="end"
            height={100}
            tickFormatter={truncateAxisLabel}
            fontSize={13}
            dataKey="name"
            stroke="#000000"
          />
          <YAxis yAxisId="left" orientation="left" stroke="#191389" />
          <YAxis yAxisId="right" orientation="right" stroke="#0d6949" />
          <Tooltip content={<BestSellingTooltip />} />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="totalIncome"
            fill="#191389"
            radius={[0, 0, 0, 0]}
            name="Income"
          />
          <Bar
            yAxisId="right"
            dataKey="totalQuantitySold"
            fill="#0d6949"
            radius={[0, 0, 0, 0]}
            name="Units Sold"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default BestSellingProductsChart;
