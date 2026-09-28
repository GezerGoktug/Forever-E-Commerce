import {
  useState,
  useEffect,
  type FocusEvent,
  type KeyboardEvent,
  type ClipboardEvent,
  type ChangeEvent,
} from "react";
import { GrTrash } from "react-icons/gr";
import styles from "./CartProducts.module.scss";
import { useCart } from "@/store/cart/hooks";
import { removeProductFromCart, setProductQuantity } from "@/store/cart/actions";
import { Image, Input } from "@forever/ui-kit";
import TshirtIcon from "@/icons/TshirtIcon";
import { cloudinaryImageOptimizer } from "@forever/common-utils";
import { getSize } from "@/utils/product.utils";
import type { CartProduct } from "@/types/product.type";

const BLOCKED_KEYS = ["e", "E", "+", "-", ".", ","];

const CartProductItem = ({ product }: { product: CartProduct }) => {
  const [inputValue, setInputValue] = useState(String(product.quantity));

  useEffect(() => {
    setInputValue(String(product.quantity));
  }, [product.quantity]);

  const handleOnKeyDownQuantity = (e: KeyboardEvent<HTMLInputElement>) => {
    if (BLOCKED_KEYS.includes(e.key)) {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const handleOnPasteQuantity = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pasted)) {
      e.preventDefault();
    }
  };

  const handleOnChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "" || /^\d+$/.test(raw)) {
      setInputValue(raw);
    }
  };

  const handleOnBlurQuantity = (e: FocusEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    const clamped = Math.min(20, Math.max(1, isNaN(parsed) ? 1 : parsed));
    setInputValue(String(clamped));

    if (clamped !== product.quantity) {
      setProductQuantity(clamped, product._id, product.size);
    }
  };

  return (
    <div className={styles.cart_product_item}>
      <Image
        className={styles.cart_product_image}
        wrapperClassname={styles.cart_product_image_wrapper}
        src={cloudinaryImageOptimizer(product.image)}
        placeholder={
          <div className={styles.cart_product_image_placeholder}>
            <TshirtIcon />
          </div>
        }
      />
      <div className={styles.cart_product_item_content}>
        <h6>{product.name}</h6>
        <div className={styles.cart_product_price_and_size}>
          <span>${product.price}</span>
          <div>{getSize(product.size)}</div>
        </div>
      </div>
      <div className={styles.cart_product_item_quantity}>
        <Input
          className={styles.cart_product_item_quantity_input}
          type="number"
          min={1}
          max={20}
          value={inputValue}
          onKeyDown={handleOnKeyDownQuantity}
          onPaste={handleOnPasteQuantity}
          onChange={handleOnChangeQuantity}
          onBlur={handleOnBlurQuantity}
        />
      </div>
      <GrTrash
        onClick={() => removeProductFromCart(product._id, product.size)}
        className={styles.cart_product_item_trash_icon}
        size={25}
      />
    </div>
  );
};

const CartProducts = () => {
  const cart = useCart();

  return (
    <div className={styles.cart_wrapper}>
      <h5>
        YOUR <span>CART</span>
      </h5>
      <div className={styles.cart_product_list}>
        {cart.map((product) => (
          <CartProductItem
            key={`cart_${product._id}_${product.size}`}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default CartProducts;
