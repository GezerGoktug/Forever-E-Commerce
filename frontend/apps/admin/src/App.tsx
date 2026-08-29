import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Error from "./pages/Error/Error";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import { Toaster } from "react-hot-toast";
import { useIsAdmin } from "./store/auth/hooks";
import AdminStats from "./pages/Admin/Stats/AdminStats";
import AdminAddProduct from "./pages/Admin/AddProduct/AdminAddProduct";
import AdminProducts from "./pages/Admin/Products/AdminProducts";
import AdminOrders from "./pages/Admin/Orders/AdminOrders";
import ErrorBoundary from "./ErrorBoundary";
import AuthGuard from "./guards/AuthGuard";
import AdminLogin from "./components/Admin/AdminLogin/AdminLogin";

const AdminPrivateRoute = () => {
  return useIsAdmin() ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" reverseOrder={false} />
      <AuthGuard>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route element={<AdminPrivateRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/stats" />} />
              <Route path="stats" element={<AdminStats />} />
              <Route path="add-product" element={<AdminAddProduct />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="*" element={<Error />} />
            </Route>
          </Route>
        </Routes>
      </AuthGuard>
    </ErrorBoundary>
  );
}

export default App;
