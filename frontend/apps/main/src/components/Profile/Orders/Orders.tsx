import { BsBorderWidth } from "react-icons/bs";
import styles from "./Orders.module.scss";
import OrderItem from "@/components/common/OrderItem/OrderItem";
import { useMyOrdersQuery } from "@/services/hooks/queries/order.query";

const Orders = () => {
  const { data } = useMyOrdersQuery();

  return (
    <div className={styles.orders_wrapper}>
      <div className={styles.orders_btn}>
        <BsBorderWidth className={styles.orders_btn_icon} size={30} />
        <span>Orders</span>
      </div>
      <hr />
      <div className={styles.orders}>
        {data?.data.map((order) => (
          <OrderItem key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;
