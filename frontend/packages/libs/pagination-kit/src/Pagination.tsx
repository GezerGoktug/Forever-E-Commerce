import { createContext, useContext, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { usePagination, type UsePaginationOptions, type UsePaginationReturn } from "./usePagination";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

interface PaginationProps
  extends UsePaginationOptions,
  Omit<HTMLAttributes<HTMLElement>, "children"> {
  children: ReactNode;
}

const PaginationContext = createContext<UsePaginationReturn | null>(null);

const usePaginationContext = () => {
  const context = useContext(PaginationContext);
  if (!context) throw new Error("Pagination parts must be rendered inside <Pagination>");
  return context;
};

const Pagination = ({
  page,
  onPageChange,
  totalPage,
  totalItems,
  pageSize,
  children,
  ...props
}: PaginationProps) => {
  const pagination = usePagination({ page, onPageChange, totalPage, totalItems, pageSize });

  return (
    <PaginationContext.Provider value={pagination}>
      <nav {...props}>{children}</nav>
    </PaginationContext.Provider>
  );
};

const PaginationPrev = ({ onClick, disabled, ...props }: ButtonProps) => {
  const { hasPrev, prev } = usePaginationContext();

  return (
    <button
      type="button"
      disabled={disabled || !hasPrev}
      onClick={(e) => {
        onClick?.(e);
        prev();
      }}
      {...props}
    />
  );
};

const PaginationNext = ({ onClick, disabled, ...props }: ButtonProps) => {
  const { hasNext, next } = usePaginationContext();

  return (
    <button
      type="button"
      disabled={disabled || !hasNext}
      onClick={(e) => {
        onClick?.(e);
        next();
      }}
      {...props}
    />
  );
};

interface PaginationPageProps extends ButtonProps {
  page: number;
}

const PaginationPage = ({ page, onClick, children, ...props }: PaginationPageProps) => {
  const { page: currentPage, goTo } = usePaginationContext();
  const selected = page === currentPage;

  return (
    <button
      type="button"
      data-selected={selected || undefined}
      onClick={(e) => {
        onClick?.(e);
        goTo(page);
      }}
      {...props}
    >
      {children ?? page + 1}
    </button>
  );
};

interface PaginationInfoProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  children?: ReactNode | ((pagination: UsePaginationReturn) => ReactNode);
}

const PaginationInfo = ({ children, ...props }: PaginationInfoProps) => {
  const pagination = usePaginationContext();

  return (
    <span {...props}>
      {typeof children === "function" ? children(pagination) : children}
    </span>
  );
};

export { Pagination, PaginationPrev, PaginationNext, PaginationPage, PaginationInfo };
