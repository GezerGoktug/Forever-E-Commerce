import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import styles from "./Pagination.module.scss";
import {
  Pagination as PaginationRoot,
  PaginationInfo,
  PaginationNext,
  PaginationPrev,
} from "@forever/pagination-kit";

interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalPage: number;
  totalItems: number;
  title?: string;
}

const Pagination = ({ page, onPageChange, pageSize, totalPage, totalItems, title }: PaginationProps) => {
  return (
    <div className={styles.pagination_wrapper}>
      <PaginationRoot
        page={page}
        onPageChange={onPageChange}
        totalPage={totalPage}
        totalItems={totalItems}
        pageSize={pageSize}
        className={styles.pagination}
      >
        <PaginationPrev className={styles.pagination_arrow_icon_wrapper}>
          <FaArrowLeft className={styles.pagination_arrow_icon} size={20} />
        </PaginationPrev>

        <PaginationInfo className={styles.pagination_title}>
          {({ range }) => (
            <>
              {title || "Showing items"}{" "}
              <span className={styles.pagination_range}>
                {range.start} - {range.end}
              </span>
            </>
          )}
        </PaginationInfo>

        <PaginationNext className={styles.pagination_arrow_icon_wrapper}>
          <FaArrowRight className={styles.pagination_arrow_icon} size={20} />
        </PaginationNext>
      </PaginationRoot>
    </div>
  );
};

export default Pagination;
