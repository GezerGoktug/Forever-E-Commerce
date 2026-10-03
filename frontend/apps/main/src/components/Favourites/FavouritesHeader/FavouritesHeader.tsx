import { useQueryParams } from '@forever/query-kit';
import type { ProductSearchQuery, SortType } from '@/types/product.type';
import styles from './FavouritesHeader.module.scss';
import { motion } from 'framer-motion'

const FavouritesHeader = () => {
    const {
        queryState: { sorting },
        querySetters: { setSorting }
    } = useQueryParams<Pick<ProductSearchQuery, 'sorting'>>({
        sorting: 'DEFAULT'
    })


    return (
        <div className={styles.favourites_header}>
            <motion.h5
                initial={{ x: 250, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                MY <span>FAVOURITES</span>
            </motion.h5>
            <select
                onChange={(e) => setSorting(e.target.value as SortType)}
                value={sorting}
                className={styles.sort_select}
                name="sorting_products"
            >
                <option value="DEFAULT">Sort by: Relevant</option>
                <option value="LOW_TO_HIGH">Sort by: Low to High</option>
                <option value="HIGH_TO_LOW">Sort by: High to Low</option>
            </select>
        </div>
    )
}

export default FavouritesHeader