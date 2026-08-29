import { Helmet } from "react-helmet";
import Products from "@/components/Admin/Products/Products";

const AdminProducts = () => {
  return (
    <>
      <Helmet>
        <title>Products - Admin Forever</title>
      </Helmet>
      <Products />
    </>
  );
};

export default AdminProducts;
