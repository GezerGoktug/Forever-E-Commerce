import { Helmet } from "react-helmet";
import Login from "@/components/Admin/Login/Login";

const AdminLogin = () => {
  return (
    <>
      <Helmet>
        <title>Login - Admin Forever</title>
      </Helmet>
      <Login />
    </>
  );
};

export default AdminLogin;
