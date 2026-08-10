export const createRatingArray = (rating: number): number[] => {
    return [0, 0, 0, 0, 0].map((item, i) => {
        if (i + 1 <= rating) {
            return 1;
        }
        return item;
    });
};
