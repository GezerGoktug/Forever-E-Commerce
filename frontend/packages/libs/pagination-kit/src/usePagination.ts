import { useEffect } from "react";

interface UsePaginationOptions {
  page: number;
  onPageChange: (page: number) => void;
  totalPage: number;
  totalItems: number;
  pageSize: number;
}

interface PaginationRange {
  start: number;
  end: number;
}

interface UsePaginationReturn {
  page: number;
  totalPage: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  range: PaginationRange;
  goTo: (page: number) => void;
  next: () => void;
  prev: () => void;
}

const usePagination = ({
  page,
  onPageChange,
  totalPage,
  totalItems,
  pageSize,
}: UsePaginationOptions): UsePaginationReturn => {
  const clamp = (value: number) => {
    const safe = Number.isFinite(value) ? Math.trunc(value) : 0;
    return Math.max(0, totalPage > 0 ? Math.min(safe, totalPage - 1) : safe);
  };

  const currentPage = clamp(page);

  useEffect(() => {
    if (currentPage !== page) onPageChange(currentPage);
  }, [currentPage, page, onPageChange]);

  const goTo = (target: number) => {
    const nextPage = clamp(target);
    if (nextPage !== currentPage) onPageChange(nextPage);
  };

  const range = {
    start: totalItems === 0 ? 0 : currentPage * pageSize + 1,
    end: Math.min((currentPage + 1) * pageSize, totalItems),
  };

  return {
    page: currentPage,
    totalPage,
    totalItems,
    hasNext: currentPage < totalPage - 1,
    hasPrev: currentPage > 0,
    range,
    goTo,
    next: () => goTo(currentPage + 1),
    prev: () => goTo(currentPage - 1),
  };
};

export { usePagination };
export type { UsePaginationOptions, UsePaginationReturn, PaginationRange };
