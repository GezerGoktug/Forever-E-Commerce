import { useEffect, useState } from "react";
import styles from "./Stats.module.scss";
import { RiShoppingBagLine } from "react-icons/ri";
import millify from "millify";
import { FaMoneyBillTrendUp, FaRegCircleUser } from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { GoStarFill } from "react-icons/go";
import { type IconType } from "react-icons";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  CartesianGrid,
  Area,
} from "recharts";
import { Chart } from "react-google-charts";
import { useThemeStore } from "@forever/theme-kit";
import { useGetAdminStatisticsQuery } from "@/services/hooks/queries/admin.query";
import { useIsAdmin } from "@/store/auth/hooks";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const statsCardDefaultData = [
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

interface StatCardType {
  icon: IconType;
  key: string;
  header: string;
  desc: string;
  dt: number | null;
  isMoneyUnit?: boolean;
}

interface CategoryDistribution {
  _id: {
    subCategory: string;
  };
  orderCount: number;
}
interface GeographyOrderDistribution {
  _id: string;
  orderCount: number;
  totalIncome: number;
}

const options = {
  default: {
    colorAxis: { colors: ["#d4e4ff", "#08306b"] },
    backgroundColor: "#f8f9fa",
    datalessRegionColor: "#eeeeee",
    defaultColor: "#f5f5f5",
  },
  darkMode: {
    colorAxis: { colors: ["#93bbff", "#031530"] },
    backgroundColor: "#0e0e0e",
    datalessRegionColor: "#9c9c9c",
    defaultColor: "#f5f5f5",
  },
};

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className={styles.admin_stats_tooltip_container}>
        <img src={item.image} alt={item.name} className={styles.admin_stats_tooltip_image} />
        <div className={styles.admin_stats_tooltip_text}>
          <h6>{item.name}</h6>
          <p>
            Total Income: <span>{item.totalIncome}₺</span>
          </p>
          <p>
            Order count: <span> {item.totalQuantitySold}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const Stats = () => {
  const [statsCard, setStatsCard] =
    useState<StatCardType[]>(statsCardDefaultData);

  const { theme } = useThemeStore();

  const { data } = useGetAdminStatisticsQuery({ enabled: useIsAdmin() });


  useEffect(() => {
    setStatsCard(
      statsCard.map((item) => ({
        ...item,
        dt: data?.data.stats_card.find(
          (stat) => stat.key === item.key
        )?.dt || null,
      }))
    );
  }, [data]);

  const editedGeoOrderDistributionData =
    data?.data.geographicDistribution.map(
      (item: GeographyOrderDistribution) => [
        item._id,
        item.totalIncome,
        item.orderCount,
      ]
    ) || [];

  const geoChartData = [
    ["Country", "Total Income", "Order Count"],
    ...editedGeoOrderDistributionData,
  ];

  const COLORS = ["#1b1d89", "#9000c4", "#177439"];

  return (
    <div className={styles.admin_stats_wrapper}>
      <div className={styles.admin_stats_cards}>
        {statsCard.map(({ icon: Icon, ...item }, i) => (
          <motion.div
            key={"stats_card_" + i}
            initial={{ y: 40, opacity: 0.0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.3, delay: (i + 1) * 0.05 }}
            className={styles.admin_stats_card}
          >
            <div className={styles.admin_stats_card_top}>
              <div className={styles.admin_stats_header}>
                <motion.h6
                  initial={{ x: -20, opacity: 0.0, filter: "blur(8px)" }}
                  animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.3, delay: (i + 1) * 0.2 }}
                >
                  {item.header}
                </motion.h6>
                <motion.span
                  initial={{ y: 20, opacity: 0.0, filter: "blur(8px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.3, delay: (i + 1) * 0.2 }}
                >
                  <CountUp
                    end={item.dt || 0}
                    duration={3}
                    formattingFn={(value) => millify(value)}
                  />

                  {item.isMoneyUnit ? "$" : ""}
                </motion.span>
              </div>
              <motion.div
                initial={{ y: 20, opacity: 0.0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.3, delay: (i + 1) * 0.2 }}
                className={styles.admin_stats_icon_container}
              >
                <Icon className={styles.admin_stats_icon} />
              </motion.div>
            </div>
            <motion.div
              initial={{ x: -20, opacity: 0.0, filter: "blur(8px)" }}
              animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.3, delay: (i + 1) * 0.2 }}
              className={styles.admin_stats_card_bottom}
            >
              <span>&#9672;</span>
              <div className={styles.admin_stats_desc}>{item.desc}</div>
            </motion.div>
          </motion.div>
        ))}
      </div>
      <div className={styles.admin_stats_charts}>
        <div className={styles.admin_stats_chart_group}>
          <div className={styles.admin_stats_chart}>
            <h6 className={styles.admin_stats_chart_header}>
              Best selling products
            </h6>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data?.data.bestSellingProducts}>
                <XAxis
                  angle={-60}
                  textAnchor="end"
                  height={100}
                  tickFormatter={(value) =>
                    value.length > 10 ? value.slice(0, 10) + "..." : value
                  }
                  fontSize={13}
                  dataKey="name"
                  stroke="#000000"
                />
                <YAxis yAxisId="left" orientation="left" stroke="#191389" />
                <YAxis yAxisId="right" orientation="right" stroke="#0d6949" />
                <Tooltip content={<CustomTooltip />} />
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
                  name="Solded Quantity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.admin_stats_chart}>
            <h6 className={styles.admin_stats_chart_header}>
              Order Sub Category Distribution{" "}
            </h6>

            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data?.data.categoryOrderDistribution.map(
                    (item: CategoryDistribution) => ({
                      name: item._id.subCategory,
                      orderCount: item.orderCount,
                    })
                  )}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={120}
                  dataKey="orderCount"
                >
                  {data?.data.categoryOrderDistribution.map(
                    (_: unknown, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip wrapperClassName={styles.admin_stats_chart_default_tooltip} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={styles.admin_stats_chart_group}>
          <div className={styles.admin_stats_chart}>
            <h6 className={styles.admin_stats_chart_header}>
              Sub Category Distribution
            </h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={
                  data?.data.productCountsByQueries.productCountsBySubCategory
                }
              >
                <XAxis
                  tickFormatter={(value) =>
                    value.length > 10 ? value.slice(0, 10) + "..." : value
                  }
                  dataKey="_id"
                  stroke="#000000"
                />
                <YAxis stroke="#1a8595" />

                <Tooltip wrapperClassName={styles.admin_stats_chart_default_tooltip} />
                <Bar
                  barSize={50}
                  dataKey="counts"
                  fill="#1a8595"
                  radius={[5, 5, 0, 0]}
                  name="Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.admin_stats_chart}>
            <h6 className={styles.admin_stats_chart_header}>
              Category Distribution{" "}
            </h6>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data?.data.productCountsByQueries.productCountsByCategory}
              >
                <XAxis
                  tickFormatter={(value) =>
                    value.length > 10 ? value.slice(0, 10) + "..." : value
                  }
                  fontSize={16}
                  dataKey="_id"
                  stroke="#000000"
                />
                <YAxis stroke="#681389" />

                <Tooltip wrapperClassName={styles.admin_stats_chart_default_tooltip} />
                <Bar
                  barSize={50}
                  dataKey="counts"
                  fill="#681389"
                  radius={[5, 5, 0, 0]}
                  name="Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={styles.admin_stats_chart_group}>
          <div className={styles.admin_stats_chart}>
            <h6 className={styles.admin_stats_chart_header}>
              Yearly Sales Graphic
            </h6>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data?.data.sales.yearlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip wrapperClassName={styles.admin_stats_chart_default_tooltip} />
                <Area
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#d500bc"
                  fill="#d500bc"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.admin_stats_chart}>
            <h6 className={styles.admin_stats_chart_header}>
              Monthly Sales Graphic
            </h6>

            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data?.data.sales.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip wrapperClassName={styles.admin_stats_chart_default_tooltip} />
                <Area
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#002ed5"
                  fill="#002ed5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={styles.admin_stats_chart_group}>
          <div className={styles.admin_stats_chart}>
            <h6 className={styles.admin_stats_chart_header}>
              Daily Sales Graphic
            </h6>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data?.data.sales.dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  angle={-45}
                  height={100}
                  textAnchor="end"
                  dataKey="_id"
                />
                <YAxis />
                <Tooltip wrapperClassName={styles.admin_stats_chart_default_tooltip} />
                <Area
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#ff1010"
                  fill="#ff1010"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.admin_stats_chart}>
            <h6 className={styles.admin_stats_chart_header}>
              Geographic Order Distrbution
            </h6>
            <Chart
              chartType="GeoChart"
              width="100%"
              height="400px"
              options={theme === "dark" ? options.darkMode : options.default}
              data={geoChartData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
