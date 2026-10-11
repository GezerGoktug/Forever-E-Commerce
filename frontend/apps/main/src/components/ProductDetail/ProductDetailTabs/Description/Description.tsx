import styles from "./Description.module.scss";

const Description = () => {
  return (
    <div className={styles.description}>
      <p>
        An e-commerce website is an online platform that facilitates the buying
        and selling of products or services over the internet. It serves as a
        virtual marketplace where businesses and individuals can showcase their
        products, interact with customers, and conduct transactions without the
        need for a physical presence. E-commerce websites have gained immense
        popularity due to their convenience, accessibility, and the global reach
        they offer.
      </p>
      <br />

      <p>
        E-commerce websites typically display products or services along with
        detailed descriptions, images, prices, and any available variations
        (e.g., sizes, colors). Each product usually has its own dedicated page
        with relevant information.
      </p>
    </div>
  );
};

export default Description;
