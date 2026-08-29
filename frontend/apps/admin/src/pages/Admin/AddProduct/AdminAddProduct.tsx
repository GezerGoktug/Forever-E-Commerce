import { Helmet } from "react-helmet";
import AddProduct from "@/components/Admin/AddProducts/AddProduct";

const AdminAddProduct = () => {
  return (
    <>
      <Helmet>
        <title>Add Product - Admin Forever</title>
      </Helmet>
      <AddProduct />
    </>
  );
};

export default AdminAddProduct;
