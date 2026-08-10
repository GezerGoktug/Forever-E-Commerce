import { type FC, type ReactNode, useRef, useState } from "react";
import styles from "./Dropdown.module.scss";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "@forever/hook-kit";

type ListItemType = {
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
};

interface DropdownProps {
  trigger?: ReactNode;
  listItems?: ListItemType[];
  isClickClose?: boolean;
  className?: string;
  children?: ReactNode;
}

const Dropdown: FC<DropdownProps> = ({
  className,
  children,
  trigger,
  listItems = [],
  isClickClose = true,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(contentRef,() => setOpen(false),!open);

  const handleClickListItem = (item: ListItemType) => {
    if (isClickClose) setOpen(false);

    if (item.onClick) item.onClick();
  };
  return (
    <div className={clsx(styles.dropdown_wrapper, className)}>
      <div onClick={() => setOpen(!open)} className={styles.dropdown_trigger}>
        {trigger}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={contentRef}
            initial={{ scale: 0.8, opacity: 0, x: "-50%" }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.1, ease: "linear" }}
            className={styles.dropdown_content}
          >
            {listItems.map((item, i) => (
              <div
                key={`dropdown_list_${i}`}
                onClick={() => handleClickListItem(item)}
                className={styles.dropdown_item}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
