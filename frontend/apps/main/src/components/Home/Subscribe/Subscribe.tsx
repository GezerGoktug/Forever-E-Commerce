import { Button, Input } from "@forever/ui-kit";
import styles from "./Subscribe.module.scss";

const Subscribe = () => {
  return (
    <div className={styles.subscribe}>
      <h6>Subscribe now & get 20% off</h6>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>
      <div className={styles.subscribe_input_wrapper}>
        <Input
          placeholder="Enter your email"
          type="email"
          size="lg"
        />
        <Button className={styles.subscribe_input_btn} variant="primary">
          SUBSCRIBE
        </Button>
      </div>
    </div>
  );
};

export default Subscribe;
