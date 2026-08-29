import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import styles from "./Pagination.module.scss";
import { useHasNextPage, useHasPrevPage, usePageCount } from "@/store/product/hooks";
import { useQueryParams } from "@forever/query-kit";
import { useEffect } from "react";

const Pagination = () => {
  const pageCount = usePageCount();
  const hasNext = useHasNextPage();
  const hasPrev = useHasPrevPage()

  const { queryState: { page }, querySetters: { setPage } } = useQueryParams<{ page: number }>({
    page: 0
  })

  const nextPage = () => setPage(hasNext ? page + 1 : page);
  const prevPage = () => setPage(hasPrev ? page - 1 : page);

  useEffect(() => {
    if (page < 0)
      setPage(0);
    else if (pageCount !== null && (page > pageCount - 1) && pageCount !== 0)
      setPage(pageCount - 1);

  }, [page, pageCount])

  return (
    <div className={styles.pagination_wrapper}>
      <div className={styles.pagination}>
        <div
          onClick={() => prevPage()}
          className={styles.pagination_arrow_icon_wrapper}
        >
          <FaArrowLeft className={styles.pagination_arrow_icon} size={20} />
        </div>

        <div className={styles.pagination_title}>
          Showing products{" "}
          <span className={styles.pagination_range}>
            {page * 10 + 1} - {(page + 1) * 10}
          </span>
        </div>
        <div
          onClick={() => nextPage()}
          className={styles.pagination_arrow_icon_wrapper}
        >
          <FaArrowRight className={styles.pagination_arrow_icon} size={20} />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
