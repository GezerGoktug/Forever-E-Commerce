import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ErrorBoundary from "./ErrorBoundary";
import AuthGuard from "./guards/AuthGuard";
import { Toaster } from "react-hot-toast";
import { useIsAccess } from "./store/auth/hooks";
import { lazy, Suspense } from "react";
import { Loading } from "@forever/ui-kit";

const Home = lazy(() => import("./pages/Home"));
const Error = lazy(() => import("./pages/Error/Error"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Auth = lazy(() => import("./pages/Auth"));
const Collections = lazy(() => import("./pages/Collections/Collections"));
const ProductDetail = lazy(() => import("./pages/ProductDetail/ProductDetail"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder"));
const Profile = lazy(() => import("./pages/Profile"));
const PaymentResult = lazy(() => import("./pages/PaymentResult/PaymentResult"));
const Favourites = lazy(() => import("./pages/Favourites"));


const PrivateRoute = () => {
  return useIsAccess() ? <Outlet /> : <Navigate to="/auth" />;
};

function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" reverseOrder={false} />
      <Suspense fallback={<Loading />}>
        <AuthGuard>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/collection" element={<Collections />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/cart" element={<Cart />} />
              <Route element={<PrivateRoute />}>
                <Route path="/favourite" element={<Favourites />} />
                <Route path="/payment/result" element={<PaymentResult />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="/*" element={<Error />} />
            </Route>
          </Routes>
        </AuthGuard>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
