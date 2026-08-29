import { Helmet } from 'react-helmet'
import TopSection from '@/components/Favourites/TopSection/TopSection'
import Filter from '@/components/Favourites/Filter/Filter'
import Products from '@/components/Favourites/Products/Products'
import Pagination from '@/components/Favourites/Pagination/Pagination'

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
            <TopSection/>
            <Filter/>
            <Products/>
            <Pagination/>
        </div>
    )
}

export default Favourites