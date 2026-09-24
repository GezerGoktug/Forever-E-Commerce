import { type IconType } from "react-icons";
import { RiShoppingBagLine } from "react-icons/ri";
import { FaMoneyBillTrendUp, FaRegCircleUser } from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { GoStarFill } from "react-icons/go";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import millify from "millify";
import styles from "./StatCards.module.scss";
import type { StatKey } from "@/types/admin.type";

export interface StatCard {
  icon: IconType;
  key: StatKey;
  header: string;
  desc: string;
  dt: number | null;
  isMoneyUnit?: boolean;
}

export const STAT_CARDS: StatCard[] = [
  {
    icon: RiShoppingBagLine,
    key: "AVG_MONTHLY_ORDER_SALES",
    header: "SALES AVERAGE",
    desc: "Average of order fees this month",
    dt: null,
    isMoneyUnit: true,
  },
  {
    icon: FaRegCircleUser,
    key: "USER_COUNT",
    header: "USERS",
    desc: "Number of registered users on the platform",
    dt: null,
  },
  {
    icon: AiFillProduct,
    key: "PRODUCT_COUNT",
    header: "PRODUCTS",
    desc: "Total number of items available for purchase",
    dt: null,
  },
  {
    icon: BiSolidPurchaseTag,
    key: "TODAY_ORDERS",
    header: "ORDERS",
    desc: "Total number of orders today",
    dt: null,
  },
  {
    icon: FaMoneyBillTrendUp,
    key: "YEAR_INCOME",
    header: "YEAR INCOME",
    desc: "Total earnings earned this year",
    dt: null,
    isMoneyUnit: true,
  },
  {
    icon: GoStarFill,
    key: "PRODUCT_COMMENT_AVG_RATING",
    header: "RATING AVERAGE",
    desc: "Average rating of products",
    dt: null,
  },
];

interface StatCardsProps {
  cards: StatCard[];
}

const StatCards = ({ cards }: StatCardsProps) => {
  return (
    <div className={styles.stat_cards}>
      {cards.map(({ icon: Icon, ...card }, i) => (
        <motion.div
          key={card.key}
          initial={{ y: 40, opacity: 0.0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.3, delay: (i + 1) * 0.05 }}
          className={styles.stat_card}
        >
          <div className={styles.stat_card_top}>
            <div className={styles.stat_card_header}>
              <motion.h6
                initial={{ x: -20, opacity: 0.0, filter: "blur(8px)" }}
                animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.3, delay: (i + 1) * 0.2 }}
              >
                {card.header}
              </motion.h6>
              <motion.span
                initial={{ y: 20, opacity: 0.0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.3, delay: (i + 1) * 0.2 }}
              >
                <CountUp
                  end={card.dt || 0}
                  duration={3}
                  formattingFn={(value) => millify(value)}
                />

                {card.isMoneyUnit ? "$" : ""}
              </motion.span>
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0.0, filter: "blur(8px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.3, delay: (i + 1) * 0.2 }}
              className={styles.stat_card_icon_container}
            >
              <Icon className={styles.stat_card_icon} />
            </motion.div>
          </div>
          <motion.div
            initial={{ x: -20, opacity: 0.0, filter: "blur(8px)" }}
            animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3, delay: (i + 1) * 0.2 }}
            className={styles.stat_card_bottom}
          >
            <span>&#9672;</span>
            <div className={styles.stat_card_desc}>{card.desc}</div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatCards;
