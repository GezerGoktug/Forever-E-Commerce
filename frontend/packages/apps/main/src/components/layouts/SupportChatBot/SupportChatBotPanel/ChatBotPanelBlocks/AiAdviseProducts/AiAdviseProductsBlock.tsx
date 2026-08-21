import styles from './AiAdviseProductsBlock.module.scss'
import { IoIosStar, IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { type ExtendedProductType } from '@/types/product.type'
import { Link } from 'react-router-dom'
import { useIsProductsInFavQuery } from '@/services/hooks/queries/product.query'
import { useIsAccess } from '@/store/auth/hooks'
import { useHandleFavouriteMutation } from '@/services/hooks/mutations/product.mutations'
import getSize from '@/helper/getSize'
import { type MessageType } from '@/types/ai.type'

const AiAdviseProductItem = ({ product }: { product: ExtendedProductType & { averageRating: number, isFav: boolean } }) => {
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
            <div className={styles.support_chatbot_panel_product_wrapper}>
                <div className={styles.support_chatbot_panel_product}>
                    <img src={product.image} alt={product.name} />
                    <div className={styles.support_chatbot_panel_product_info}>
                        <h6>{product.name}</h6>
                        <div className={styles.support_chatbot_panel_product_price_and_rating}>
                            <span>${product.price}</span>
                            <div className={styles.support_chatbot_panel_product_avg_rating}>
                                <IoIosStar />
                                {product.averageRating}
                            </div>

                        </div>
                        <div className={styles.support_chatbot_panel_product_sizes}>
                            {
                                product.sizes.map((size) => (
                                    <div>{getSize(size)}</div>
                                ))
                            }
                        </div>
                    </div>
                    <div className={styles.support_chatbot_panel_product_actions}>
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
const AiAdviseProductsBlock = ({ msg }: { msg: MessageType & { isFirstMessage?: boolean } }) => {

    const { data } = useIsProductsInFavQuery(msg.type === "ai" ? msg.products?.map(p => p._id) : [], ["ai-chatbot-fav-product"], {
        enabled: useIsAccess() && msg.type === "ai" && !!msg.products?.length
    })

    console.log(msg);
    
    const isFavProduct = (id: string) => data?.data.find(dt => dt._id === id)?.isFav;

    return msg.type === "ai" && msg.products.map((product) => <AiAdviseProductItem product={{ ...product, isFav: isFavProduct(product._id) || false }} key={`ai-product-${product._id}`} />)

}

export default AiAdviseProductsBlock;