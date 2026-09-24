import styles from './AiAdviseProductsBlock.module.scss'
import { IoIosStar, IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'
import { memo, useEffect, useId, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useIsProductsInFavQuery } from '@/services/hooks/queries/product.query'
import { useIsAccess } from '@/store/auth/hooks'
import { useHandleFavouriteMutation } from '@/services/hooks/mutations/product.mutations'
import { type AgentMessage } from '@/types/ai.type'
import TshirtIcon from '@/icons/TshirtIcon'
import { getSize } from '@/utils/product.utils'
import { handleShowApiErrorWithToastMessages } from '@/utils/common.utils'

const AiAdviseProductItem = ({ product }: { product: NonNullable<(AgentMessage["products"])>[number] & { isFav: boolean } }) => {
    const isAccess = useIsAccess();

    const [isFav, setIsFav] = useState(false);

    const { mutate } = useHandleFavouriteMutation({
        onSuccess: async (data) => {
            toast.success(data.data.message);
            setIsFav(!isFav);
        },
        onError: (error) => {
            setIsFav(!isFav);
            handleShowApiErrorWithToastMessages(error)
        }
    });

    useEffect(() => {
        setIsFav(product.isFav);
    }, [product.isFav])

    useEffect(() => {
        if (!isAccess) {
            setIsFav(false)
        }
    }, [isAccess])

    const toggleFavourite = () => isAccess ? mutate({ isFav, productId: product._id }) : toast.error('Please log in to add favourites');
    return (
        <Link className={styles.agent_panel_chat_block_product_wrapper} to={`/product/${product._id}`}>
            <div className={styles.agent_panel_chat_block_product}>
                <img src={product.image} alt={product.name} />
                <div className={styles.agent_panel_chat_block_product_info}>
                    <h6>{product.name}</h6>
                    <div className={styles.agent_panel_chat_block_product_price_and_rating}>
                        <span>${product.price}</span>
                        <div className={styles.agent_panel_chat_block_product_avg_rating}>
                            <IoIosStar />
                            {product.averageRating}
                        </div>

                    </div>
                    <div className={styles.agent_panel_chat_block_product_sizes}>
                        {
                            product.sizes.map((size) => (
                                <div key={size}>{getSize(size)}</div>
                            ))
                        }
                    </div>
                </div>
                <div className={styles.agent_panel_chat_block_product_actions}>
                    <div onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavourite()
                    }}>
                        {isFav ? <IoMdHeart fill="red" size={20} /> : <IoMdHeartEmpty size={20} />}
                    </div>
                </div>
            </div>
        </Link>
    )
}

const AiAdviseProductSkeletonItem = () => (
    <div className={styles.agent_panel_chat_block_product_skeleton_wrapper}>
        <div className={styles.agent_panel_chat_block_product_skeleton}>
            <div className={styles.agent_panel_chat_block_product_skeleton_image}>
                <TshirtIcon />
            </div>
            <div className={styles.agent_panel_chat_block_product_skeleton_info}>
                <div className={styles.agent_panel_chat_block_product_skeleton_title} />
                <div className={styles.agent_panel_chat_block_product_skeleton_price_and_rating}>
                    <div className={styles.agent_panel_chat_block_product_skeleton_price} />
                    <div className={styles.agent_panel_chat_block_product_skeleton_avg_rating}>
                        <IoIosStar />
                        <div />
                    </div>
                </div>
                <div className={styles.agent_panel_chat_block_product_skeleton_sizes}>
                    <div />
                    <div />
                    <div />
                </div>
            </div>
            <div className={styles.agent_panel_chat_block_product_skeleton_actions}>
                <div>
                    <IoMdHeartEmpty size={20} />
                </div>
            </div>
        </div>
    </div>
)

const AiAdviseProductsBlock = memo(({ products, isLoading = false }: { products: AgentMessage["products"], isLoading?: boolean }) => {
    const isAccess = useIsAccess();

    const skeletonId = useId();

    const { data } = useIsProductsInFavQuery(products ? products.map(product => product._id) : [], ["ai-agent-fav-product"], {
        enabled: isAccess && !!products?.length
    })

    const isFavProduct = (productId: string) => data?.data.find(favInfo => favInfo._id === productId)?.isFav;

    if (isLoading) {
        return Array.from({ length: 5 }, (_, index) => <AiAdviseProductSkeletonItem key={`ai-product-skeleton-${skeletonId}-${index}`} />)
    }

    return products && products.map((product) => <AiAdviseProductItem product={{ ...product, isFav: isFavProduct(product._id) || false }} key={`ai-product-${product._id}`} />)

})

export default AiAdviseProductsBlock;
