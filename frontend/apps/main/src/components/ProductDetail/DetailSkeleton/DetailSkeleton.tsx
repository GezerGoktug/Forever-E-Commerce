import TshirtIcon from '@/icons/TshirtIcon'
import styles from './DetailSkeleton.module.scss'

const DetailSkeleton = () => {
    return (
        <>
            <div className={styles.skeleton_detail_pictures_section}>
                <div className={styles.skeleton_detail_pictures_section_left}>
                    <div>
                        <TshirtIcon/>
                    </div>
                    <div>
                        <TshirtIcon/>
                    </div>
                    <div>
                        <TshirtIcon/>
                    </div>
                    <div>
                        <TshirtIcon/>
                    </div>
                </div>
                <div className={styles.skeleton_detail_pictures_section_right} >
                    <TshirtIcon/>
                </div>
            </div>
            <div className={styles.skeleton_product_detail}>
                <div className={styles.skeleton_product_detail_title} />
                <div className={styles.skeleton_product_detail_rating} />
                <div className={styles.skeleton_product_detail_price} />
                <div className={styles.skeleton_product_detail_desc} />
                <div className={styles.skeleton_product_detail_select_size}>
                    <div
                        className={styles.skeleton_product_detail_select_size_title}
                    />
                    <div className={styles.skeleton_product_detail_sizes}>
                        {[0, 1, 2, 3, 4].map((item) => (
                            <div key={"skeleton_product_detail_size_" + item} />
                        ))}
                    </div>
                </div>
                <div className={styles.skeleton_product_detail_cart_btn} />
                <div className={styles.skeleton_product_detail_short_features}>
                    <div />
                    <div />
                    <div />
                </div>
            </div>
        </>
    )
}

export default DetailSkeleton