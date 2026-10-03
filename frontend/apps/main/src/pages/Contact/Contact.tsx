import { Helmet } from "react-helmet";
import ContactUs from "@/components/Contact/ContactUs";
import Subscribe from "@/components/Home/Subscribe/Subscribe";

const Contact = () => {
  return (
    <div>
      <Helmet>
        <title>Contact - Forever</title>
        <meta
          name="description"
          content="Contact Forever for any inquiries regarding your orders, returns, or fashion advice. We're here to help!"
        />
      </Helmet>
      <ContactUs />
      <Subscribe />
    </div>
  );
};

export default Contact;
