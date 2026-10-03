import { Helmet } from 'react-helmet'
import FavouritesHeader from '@/components/Favourites/FavouritesHeader/FavouritesHeader'
import Filter from '@/components/Favourites/Filter/Filter'
import Products from '@/components/Favourites/Products/Products'

const Favourites = () => {
    return (
        <div>
            <Helmet>
                <title>My Favourites - Forever</title>
                <meta
                    name="description"
                    content="Learn more about Forever, your go-to fashion destination. We offer stylish and affordable clothing for men and women."
                />
            </Helmet>
            <FavouritesHeader/>
            <Filter/>
            <Products/>
        </div>
    )
}

export default Favourites