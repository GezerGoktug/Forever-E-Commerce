import styles from './AiAdviseProductsBlock.module.scss'
import { IoIosStar, IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'
import { memo, useEffect, useId, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useIsProductsInFavQuery } from '@/services/hooks/queries/product.query'
import { useIsAccess } from '@/store/auth/hooks'
import { useHandleFavouriteMutation } from '@/services/hooks/mutations/product.mutations'
import getSize from '@/helper/getSize'
import { type AgentMessageType } from '@/types/ai.type'
import TshirtIcon from '@/icons/TshirtIcon'

const AiAdviseProductItem = ({ product }: { product: NonNullable<(AgentMessageType["products"])>[number] & { isFav: boolean } }) => {
    const isAccess = useIsAccess();
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        setIsFav(product.isFav);
    }, [product.isFav])

    useEffect(() => {
        if (!isAccess) {
            setIsFav(false)
        }
    }, [isAccess])

    const { mutate } = useHandleFavouriteMutation({
        onSuccess: async (data) => {
            toast.success(data.data.message);
            setIsFav(!isFav);
        },
        onError: (error) => {
            setIsFav(!isFav);
            const apiError = error?.response?.data?.error.errorMessage;
            if (typeof apiError === "string") toast.error(apiError);
        }
    });

    const toggleFavourite = () => isAccess ? mutate({ isFav, productId: product._id }) : toast.error('Please you login for add product to your favourites');
    return (
        <Link to={`/product/${product._id}`}>
            <div className={styles.agent_panel_chat_block_product_wrapper}>
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
                                    <div>{getSize(size)}</div>
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

const AiAdviseProductsBlock = memo(({ products, isLoading = false }: { products: AgentMessageType["products"], isLoading?: boolean }) => {

    const { data } = useIsProductsInFavQuery(products ? products?.map(p => p._id) : [], ["ai-agent-fav-product"], {
        enabled: useIsAccess() && !!products?.length
    })

    const isFavProduct = (id: string) => data?.data.find(dt => dt._id === id)?.isFav;
    const id = useId();

    if (isLoading) {
        return [0, 1, 2, 3, 4].map(dt => <AiAdviseProductSkeletonItem key={`ai-product-skeleton-${id}-${dt}`} />)
    }

    return products && products.map((product) => <AiAdviseProductItem product={{ ...product, isFav: isFavProduct(product._id) || false }} key={`ai-product-${product._id}`} />)

})

export default AiAdviseProductsBlock;