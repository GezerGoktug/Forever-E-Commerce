import { type FC, type ReactNode } from "react";
import styles from "./Tooltip.module.scss";
import { IoMdArrowDropup } from "react-icons/io";

interface TooltipProps {
  children: ReactNode;
  message: string;
}

const Tooltip: FC<TooltipProps> = ({
  children,
  message,
}) => {
  return (
    <div className={styles.tooltip_wrapper}>
      <div className={styles.tooltip_trigger}>{children}</div>
      <div className={styles.tooltip_content}>
        <IoMdArrowDropup className={styles.tooltip_arrow_icon} size={20} />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Tooltip;
