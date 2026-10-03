import { Helmet } from "react-helmet";
import AboutUs from "@/components/About/AboutUs/AboutUs";
import WhyChooseUs from "@/components/About/WhyChooseUs/WhyChooseUs";
import Subscribe from "@/components/Home/Subscribe/Subscribe";

const About = () => {
  return (
    <div>
      <Helmet>
        <title>About - Forever</title>
        <meta
          name="description"
          content="Learn more about Forever, your go-to fashion destination. We offer stylish and affordable clothing for men and women."
        />
      </Helmet>
      <AboutUs />
      <WhyChooseUs />
      <Subscribe />
    </div>
  );
};

export default About;
