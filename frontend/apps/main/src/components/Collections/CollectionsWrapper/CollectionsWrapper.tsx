import styles from "./CollectionsWrapper.module.scss";
import Filter from "@/components/Collections/Filter/Filter";
import Products from "@/components/Collections/Products/Products";

const CollectionsWrapper = () => {
  return (
    <div className={styles.collections_wrapper}>
      <Filter />
      <div>
        <Products />
      </div>
    </div>
  );
};

export default CollectionsWrapper;
