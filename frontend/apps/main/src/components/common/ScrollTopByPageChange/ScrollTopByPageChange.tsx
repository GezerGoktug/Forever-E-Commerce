import { useEffect, useRef } from "react";
import { useQueryParams } from "@forever/query-kit";

const ScrollTopByPageChange = () => {
  const { queryState: { page } } = useQueryParams<{ page: number }>({
    page: 0
  })
  const prevPage = useRef(page);

  useEffect(() => {
    if (prevPage.current === page) return;

    prevPage.current = page;
    window.scrollTo({ top: 0 });
  }, [page]);

  return null;
};

export default ScrollTopByPageChange;
