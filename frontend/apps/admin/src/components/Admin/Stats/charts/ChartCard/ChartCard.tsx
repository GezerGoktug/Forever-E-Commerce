import { type ReactNode } from "react";
import styles from "./ChartCard.module.scss";

export const chartTooltipClassName = styles.chart_default_tooltip;

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

const ChartCard = ({ title, children }: ChartCardProps) => {
  return (
    <div className={styles.chart_card}>
      <h6 className={styles.chart_card_header}>{title}</h6>
      {children}
    </div>
  );
};

export default ChartCard;
