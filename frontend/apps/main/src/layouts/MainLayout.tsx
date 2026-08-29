import { Outlet } from "react-router-dom";
import Header from "@/components/layouts/Header/Header";
import Footer from "@/components/layouts/Footer/Footer";
import ReturnTop from "@/components/layouts/ReturnTopButton/ReturnTop";
import SupportAgent from "@/components/layouts/SupportAgent/SupportAgent/SupportAgent";

const MainLayout = () => {
  return (
    <>
      <ReturnTop />
      <SupportAgent />
      <div className="container">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
