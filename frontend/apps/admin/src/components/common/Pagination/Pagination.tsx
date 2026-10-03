import styles from "./Pagination.module.scss";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
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
}

const Pagination = ({ page, onPageChange, pageSize, totalPage, totalItems }: PaginationProps) => {
  return (
    <PaginationRoot
      page={page}
      onPageChange={onPageChange}
      pageSize={pageSize}
      totalPage={totalPage}
      totalItems={totalItems}
      className={styles.pagination}
    >
      <PaginationPrev className={styles.pagination_item}>
        <IoIosArrowDropleftCircle fill="white" size={25} />
      </PaginationPrev>
      <PaginationInfo className={styles.pagination_item}>
        {({ page }) => page + 1}
      </PaginationInfo>
      <PaginationNext className={styles.pagination_item}>
        <IoIosArrowDroprightCircle fill="white" size={25} />
      </PaginationNext>
    </PaginationRoot>
  );
};

export default Pagination;
