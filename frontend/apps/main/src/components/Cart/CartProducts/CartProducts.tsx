import { GrTrash } from "react-icons/gr";
import styles from "./CartProducts.module.scss";
import { useCart } from "@/store/cart/hooks";
import {
  applyQuantityToProduct,
  removeProductOfCart,
} from "@/store/cart/actions";
import getSize from "@/helper/getSize";
import { Image, Input } from "@forever/ui-kit";
import TshirtIcon from "@/icons/TshirtIcon";
import { cloudinaryImageOptimizer } from "@forever/common-utils";

const CartProducts = () => {
  const cart = useCart();

  return (
    <div className={styles.cart_wrapper}>
      <h5>
        YOUR <span>CART</span>
      </h5>
      <div className={styles.cart_product_list}>
        {cart.map((item) => (
          <div
            key={`${item._id}_${item.size}`}
            className={styles.cart_product_item}
          >
            <Image
              className={styles.cart_product_image}
              wrapperClassname={styles.cart_product_image_wrapper}
              src={cloudinaryImageOptimizer(item.image)}
              placeholder={
                <div className={styles.cart_product_image_placeholder}>
                  <TshirtIcon />
                </div>
              }
            />
            <div className={styles.cart_product_item_content}>
              <h6>{item.name}</h6>
              <div className={styles.cart_product_price_and_size}>
                <span>${item.price}</span>
                <div>{getSize(item.size)}</div>
              </div>
            </div>
            <div className={styles.cart_product_item_quantity}>
              <Input
                className={styles.cart_product_item_quantity_input}
                type="number"
                min={1}
                max={20}
                value={item.quantity}
                onBlur={(e) =>
                  applyQuantityToProduct(Math.min(20, Math.max(1, +e.target.value)), item._id, item.size)}
                onChange={(e) =>
                  applyQuantityToProduct(Math.min(20, +e.target.value), item._id, item.size)
                }
              />
            </div>
            <GrTrash
              onClick={() => removeProductOfCart(item._id, item.size)}
              className={styles.cart_product_item_trash_icon}
              size={25}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartProducts;
