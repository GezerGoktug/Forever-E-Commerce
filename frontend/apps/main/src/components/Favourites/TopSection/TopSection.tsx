import { type SortType } from '@/helper/generateSortingType';
import { useQueryParams } from '@forever/query-kit';
import type { ProductSearchQueryType } from '@/types/product.type';
import styles from './TopSection.module.scss';
import { motion } from 'framer-motion'

const TopSection = () => {
    const {
        queryState: { sorting },
        querySetters: { setSorting }
    } = useQueryParams<Pick<ProductSearchQueryType, 'sorting'>>({
        sorting: 'DEFAULT'
    })


    return (
        <div className={styles.top_section}>
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
                <option value="DEFAULT">Sort by: Relavent</option>
                <option value="LOW_TO_HIGH">Sort by: Low to High</option>
                <option value="HIGH_TO_LOW">Sort by: High to Low</option>
            </select>
        </div>
    )
}

export default TopSection