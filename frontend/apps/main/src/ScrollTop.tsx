import { type ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollTop = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollY = 0;
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollTop;
