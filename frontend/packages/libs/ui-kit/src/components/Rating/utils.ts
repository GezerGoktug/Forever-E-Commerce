export const createRatingArray = (rating: number, starCount: number = 5): number[] => {
    return Array.from({ length: starCount }, (_, i) => (i + 1 <= rating ? 1 : 0));
};
