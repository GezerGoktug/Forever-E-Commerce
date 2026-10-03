import BestSellers from "@/components/Home/BestSellers/BestSellers";
import Features from "@/components/Home/Features/Features";
import Hero from "@/components/Home/Hero/Hero";
import LatestCollections from "@/components/Home/LatestCollections/LatestCollections";
import Subscribe from "@/components/Home/Subscribe/Subscribe";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Home - Forever</title>
        <meta
          name="description"
          content="Forever - Discover the latest fashion trends with high-quality clothing for men and women. Shop now for the best deals!"
        />
      </Helmet>
      <Hero />
      <LatestCollections />
      <BestSellers />
      <Features />
      <Subscribe />
    </div>
  );
};

export default Home;
