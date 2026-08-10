import { type FC, useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./Rating.module.scss";
import { IoIosStar } from "react-icons/io";
import { createRatingArray } from "./utils";

const findIndex = (arr: number[]): number => {
    let index = -1;
    arr.forEach((item, i) => {
        if (item === 1) index = i;
    });
    return index;
};

interface RatingProps {
    rateAction: (rate: number) => void;
    clearRating?: boolean;
    defaultRating?: number;
    className?: string;
}

const Rating: FC<RatingProps> = ({
    rateAction,
    clearRating,
    defaultRating = 0,
    className
}) => {
    const [rating, setRating] = useState<number[]>(
        createRatingArray(defaultRating)
    );
    const [hoverRating, setHoverRating] = useState<number[]>(
        createRatingArray(defaultRating)
    );

    useEffect(() => {
        if (clearRating) {
            setRating([0, 0, 0, 0, 0]);
            setHoverRating([0, 0, 0, 0, 0]);
        }
    }, [clearRating]);

    useEffect(() => {
        rateAction(findIndex(rating) + 1);
    }, [rating, rateAction]);

    const hoverStar = (index: number) => {
        setHoverRating(
            hoverRating.map((_, i) => {
                if (i <= index) {
                    return 1;
                }
                return 0;
            })
        );
    };
    const handleStar = (index: number) => {
        if (findIndex(rating) === index) {
            setRating([0, 0, 0, 0, 0]);
            return;
        }
        setRating(
            rating.map((_, i) => {
                if (i <= index) {
                    return 1;
                }
                return 0;
            })
        );
    };

    return (
        <div className={clsx(styles.rating, className)}>
            {hoverRating.map((rate, index) => (
                <IoIosStar
                    key={"rating_" + index}
                    onClick={() => handleStar(index)}
                    size={18}
                    onMouseEnter={() => hoverStar(index)}
                    onMouseLeave={() => setHoverRating(rating)}
                    className={clsx(styles.star_icon, {
                        [styles.starred]: rate,
                    })}
                />
            ))}
        </div>
    );
};

export default Rating;
