import { type FC } from "react";
import clsx from "clsx";
import styles from "./RatingStars.module.scss";
import { IoIosStar } from "react-icons/io";
import { createRatingArray } from "./utils";

interface RatingStarsProps {
    rating: number;
    size?: number;
    className?: string;
    ratingItemClassName?: string;
}

const RatingStars: FC<RatingStarsProps> = ({
    rating,
    size = 18,
    className,
    ratingItemClassName
}) => {
    return (
        <div className={clsx(styles.rating_stars, className)}>
            {createRatingArray(rating).map((rate, i) => (
                <IoIosStar
                    key={"rating_star_" + i}
                    size={size}
                    className={clsx(
                        styles.rating_star_icon,
                        { [styles.starred]: rate },
                        ratingItemClassName
                    )}
                />
            ))}
        </div>
    );
};

export default RatingStars;
