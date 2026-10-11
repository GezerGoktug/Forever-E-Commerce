import { Helmet } from "react-helmet";
import CollectionsWrapper from "@/components/Collections/CollectionsWrapper/CollectionsWrapper";

const Collections = () => {
  return (
    <>
      <Helmet>
        <title>Collections - Forever</title>
        <meta
          name="description"
          content="Browse our latest collection of stylish clothing. Find the perfect outfit for every occasion at Forever!"
        />
      </Helmet>
      <CollectionsWrapper />
    </>
  );
};

export default Collections;
