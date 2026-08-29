export interface IAdminStatResponse {
    stats_card: {
        dt: number;
        key:
        | "YEAR_INCOME"
        | "TODAY_ORDERS"
        | "PRODUCT_COUNT"
        | "USER_COUNT"
        | "PRODUCT_COMMENT_AVG_RATING"
        | "AVG_MONTHLY_ORDER_SALES";
    }[];

    bestSellingProducts: {
        _id: string;
        name: string;
        totalQuantitySold: number;
        totalIncome: number;
        image: string;
    }[];

    categoryOrderDistribution: {
        _id: {
            subCategory: string;
        };
        orderCount: number;
    }[];

    geographicDistribution: {
        _id: string;
        orderCount: number;
        totalIncome: number;
    }[];

    sales: {
        yearlySales: {
            _id: string;
            totalSales: number;
            orderCount: number;
        }[];
        monthlySales: {
            _id: string;
            totalSales: number;
            orderCount: number;
        }[];
        dailySales: {
            _id: string;
            totalSales: number;
            orderCount: number;
        }[];
    };

    productCountsByQueries: {
        productCountsByCategory: {
            _id: string;
            counts: number;
        }[];
        productCountsBySubCategory: {
            _id: string;
            counts: number;
        }[];
    };
}
