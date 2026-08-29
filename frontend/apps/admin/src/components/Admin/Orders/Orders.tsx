import styles from "./Orders.module.scss";
import OrderItem from "@/components/common/OrderItem/OrderItem";
import { useAdminOrdersQuery } from "@/services/hooks/queries/order.query";

const Orders = () => {
  const { data } = useAdminOrdersQuery();
  return (
    <div className={styles.orders}>
      {data?.data.map((order) => (
        <OrderItem isAdminOrder key={order._id} order={order} />
      ))}
    </div>
  );
};

export default Orders;
