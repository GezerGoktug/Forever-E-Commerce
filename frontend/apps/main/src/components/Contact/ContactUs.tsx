import { BaseImage, Button } from "@forever/ui-kit";
import styles from "./ContactUs.module.scss";

const ContactUs = () => {
  return (
    <div className={styles.contact_us_wrapper}>
      <h5>
        CONTACT <span>US</span>
      </h5>
      <div className={styles.contact_us}>
        <BaseImage   src="/contact_img.png" alt="" />
        <div className={styles.contact_us_right}>
          <h6>Our Store</h6>
          <div>
            54709 Willms Station <br />
            Suite 350, Washington, USA <br /><br />
            Tel: (415) 555-0132 <br />
            Email: admin@forever.com
          </div>
          <h6>Careers at Forever</h6>
          <p>Learn more about our teams and job openings.</p>
          <Button variant="secondary" size="lg">Explore Jobs</Button>  
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
