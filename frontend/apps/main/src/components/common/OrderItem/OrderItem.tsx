import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BsBoxSeam, BsCheckCircleFill } from "react-icons/bs";
import styles from "./OrderItem.module.scss";
import dayjs from "dayjs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import clsx from "clsx";
import { motion } from "framer-motion";
import { type IOrder } from "@/types/order.type";
import getSize from "@/helper/getSize";
import { Link } from "react-router-dom";
import { BaseImage, Button } from "@forever/ui-kit";

const OrderItem = ({
  order,
  isAdminOrder = false,
}: {
  order: IOrder;
  isAdminOrder?: boolean;
}) => {
  const [accordionOpen, setAccordionOpen] = useState(false);

  return (
    <div className={styles.order_item}>
      <div className={styles.order_content}>
        <div className={styles.order_icon_wrapper}>
          <BsBoxSeam size={35} />
        </div>
        <div className={styles.order_info}>
          <h6>
            {" "}
            Buyer: {order.firstName} {order.lastName}{" "}
          </h6>
          <time>{dayjs(order.createdAt).format("DD MMMM YYYY HH:mm")}</time>
          <span className={styles.order_total_price}>
            Total price: {order.totalPrice}$
          </span>
          <span className={styles.order_summary}>
            Order summary: {order?.products.length} product{" "}
          </span>
        </div>
        <div className={styles.order_right}>
          <div className={styles.order_status}>
            <div className={styles.order_status_text}>Delivered</div>
            <BsCheckCircleFill className={styles.order_status_icon} />
          </div>
          <div
            onClick={() => setAccordionOpen(!accordionOpen)}
            className={styles.order_accordion_icon_wrapper}
          >
            <MdOutlineKeyboardArrowDown
              className={clsx(styles.order_accordion_icon, {
                [styles.open]: accordionOpen,
              })}
              fill="black"
              size={35}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {accordionOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              opacity: { duration: 0.1 },
              height: { duration: 0.3 },
              ease: "linear",
            }}
            className={styles.order_accordion_content}
          >
            <h5>Payment Method:</h5>
            <div>
              <div className={styles.payment_method_option}>
                {order.paymentMethod === "STRIPE" ? (
                  <BaseImage   src="/stripe.png" alt="" />
                ) : (
                  <span>CASH ON DELIVERY</span>
                )}
              </div>
            </div>
            <h5>User Contact Information:</h5>
            <div>
              <div>Phone number: {order.phoneNumber}</div>
              <div>Email: {order.emailAddress}</div>
            </div>
            <h5>Order Address Information:</h5>
            <address>
              <div>Street: {order.locationInfo.street}</div>
              <div>State: {order.locationInfo.state}</div>
              <div>City: {order.locationInfo.city}</div>
              <div>Country: {order.locationInfo.country}</div>
              <div>Zipcode: {order.locationInfo.zipCode}</div>
            </address>

            <div className={styles.order_change_delivered_status}>
              <span>Current Status :</span>
              <div className={styles.order_delivered_status}>Delivered</div>
            </div>
            {isAdminOrder && (
              <Button
                variant="secondary"
                size="sm"
                className={styles.order_change_delivered_status}
              >
                CHANGE ORDER DELIVERED STATUS
              </Button>
            )}
            <h5>Order Summary</h5>
            <div className={styles.order_product_list}>
              {order.products.map((product, i) => (
                <div
                  key={"order_item_" + i + "_" + product.product}
                  className={styles.order_product_item}
                >
                  <img src={product.image} alt="" />
                  <div className={styles.order_product_item_content}>
                    <h6>{product.name}</h6>
                    <div className={styles.order_product_price_and_size}>
                      <span>${product.price}</span>
                      <div>{getSize(product.size)}</div>
                    </div>
                    <div className={styles.order_product_item_quantity}>
                      Quantity : <span>{product.quantity}</span>
                    </div>
                    {!isAdminOrder && (
                      <Link to={"/product/" + product.product}>
                        <Button
                          className={styles.order_product_item_btn}
                          size="sm"
                        >
                          GO TO PRODUCT
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderItem;
