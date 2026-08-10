import styles from "./Drawer.module.scss";
import Backdrop from "../Backdrop/Backdrop";
import Overlay from "../Overlay/Overlay";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { OutsideClickHandler } from "@forever/common-utils";
import { FC, type ReactNode, useRef, useState } from "react";
import clsx from "clsx";
import { MdOutlineClose } from "react-icons/md";

interface DrawerProps {
    children: ReactNode;
    open: boolean;
    onClose: () => void;
    isDisableCloseBtn?: boolean;
    className?: string;
    wrapperClassName?: string;
    isDisableDrag?: boolean;
    align?: AlignType;
}

type AlignType = "right" | "left" | "bottom" | "top";

const getAnimationProperties = (align: AlignType) => {
    switch (align) {
        case "right":
            return { x: "100%" };
        case "left":
            return { x: "-100%" };
        case "bottom":
            return { y: "100%" };
        case "top":
            return { y: "-100%" };
    }
};

const animationVariants = {
    animate: (align: AlignType) => {
        return align === "right" || align === "left" ? { x: 0 } : { y: 0 };
    },
    exit: (align: AlignType) => getAnimationProperties(align),
    initial: (align: AlignType) => getAnimationProperties(align),
};

const getDragConfig = (align: AlignType) => {
    switch (align) {
        case "right":
            return { axis: "x" as const, constraints: { left: 0 } };
        case "left":
            return { axis: "x" as const, constraints: { right: 0 } };
        case "bottom":
            return { axis: "y" as const, constraints: { top: 0 } };
        case "top":
            return { axis: "y" as const, constraints: { bottom: 0 } };
    }
};

const Drawer: FC<DrawerProps> = ({
    children,
    open,
    onClose,
    className,
    wrapperClassName,
    isDisableCloseBtn = false,
    isDisableDrag = true,
    align = "bottom",
}) => {
    const [canDrag, setCanDrag] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dragControls = useDragControls();

    const handlePointerDown = (event: React.PointerEvent) => {
        const target = event.currentTarget as HTMLElement;
        if (target && target.setPointerCapture) {
            try {
                target.setPointerCapture(event.pointerId);
            } catch (e) {
            }
        }
        timerRef.current = setTimeout(() => {
            setCanDrag(true);
            dragControls.start(event);
        }, 10);
    };

    const clearTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    const dragConfig = getDragConfig(align);

    return (
        <AnimatePresence>
            {open && (
                <Overlay>
                    <Backdrop>
                        <div className={clsx(styles.drawer_wrapper, wrapperClassName)}>
                            <OutsideClickHandler onOutsideClick={() => onClose()}>
                                <motion.div
                                    custom={align}
                                    variants={animationVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.2 }}
                                    drag={!isDisableDrag && canDrag ? dragConfig.axis : false}
                                    dragControls={dragControls}
                                    dragConstraints={dragConfig.constraints}
                                    dragElastic={0}
                                    dragSnapToOrigin={false}
                                    onDragEnd={(_, info) => {
                                        clearTimer();
                                        setCanDrag(false);

                                        if (isDisableDrag) return;

                                        const isRightClose = align === "right" && (info.offset.x > 100 || info.velocity.x > 300);
                                        const isLeftClose = align === "left" && (info.offset.x < -100 || info.velocity.x < -300);
                                        const isBottomClose = align === "bottom" && (info.offset.y > 100 || info.velocity.y > 300);
                                        const isTopClose = align === "top" && (info.offset.y < -100 || info.velocity.y < -300);

                                        if (isRightClose || isLeftClose || isBottomClose || isTopClose) {
                                            onClose();
                                        }
                                    }}
                                    className={clsx(styles.drawer_content, styles[align], className)}
                                >
                                    {!isDisableCloseBtn && (
                                        <MdOutlineClose
                                            size={25}
                                            className={styles.drawer_close_btn}
                                            onClick={() => onClose()}
                                        />
                                    )}
                                    {!isDisableDrag && <div
                                        className={clsx(
                                            styles.drawer_drag_drop_handler,
                                            styles[align],
                                            { [styles.isActive]: canDrag }
                                        )}
                                        onPointerDown={handlePointerDown}
                                        onPointerUp={clearTimer}
                                        onPointerLeave={clearTimer}
                                    >
                                        <div className={clsx(styles.drawer_drag_drop_handler_element)} />
                                    </div>}
                                    {children}
                                </motion.div>
                            </OutsideClickHandler>
                        </div>
                    </Backdrop>
                </Overlay>
            )
            }
        </AnimatePresence >
    );
};

export default Drawer;