import { RiCustomerServiceFill } from "react-icons/ri";
import styles from "./Features.module.scss";
import { AiOutlineRise } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";

const features = [
  {
    icon: AiOutlineRise,
    title: "Easy Exchange Policy",
    desc: "We offer hassle free exchange policy",
  },
  {
    icon: BsCheckCircle,
    title: "7 Days Return Policy",
    desc: "We provide 7 days free return policy",
  },
  {
    icon: RiCustomerServiceFill,
    title: "Best customer support",
    desc: "We provide 24/7 customer support",
  },
];

const Features = () => {
  return (
    <div className={styles.features}>
      {features.map(({ icon: Icon, ...item },i) => (
        <div key={"features_" + i} className={styles.features_item}>
          <Icon className="icon" size={65} />
          <h6>{item.title}</h6>
          <p>{item.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;
