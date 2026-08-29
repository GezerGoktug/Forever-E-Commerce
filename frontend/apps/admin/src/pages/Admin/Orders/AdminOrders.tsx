import { Helmet } from "react-helmet";
import Orders from "@/components/Admin/Orders/Orders";

const AdminOrders = () => {
  return (
    <>
      <Helmet>
        <title>Orders - Admin Forever</title>
      </Helmet>
      <Orders />
    </>
  );
};

export default AdminOrders;
