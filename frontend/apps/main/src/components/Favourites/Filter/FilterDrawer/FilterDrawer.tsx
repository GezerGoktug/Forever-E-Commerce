import { Drawer } from '@forever/ui-kit'
import { useEffect, useState } from 'react'
import Select from 'react-select';
import styles from './FilterDrawer.module.scss';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useQueryParams } from '@forever/query-kit';
import type { CategoriesType, ProductSearchQuery, SubCategoriesType } from '@/types/product.type';
import { type SelectOptions } from '@/components/Favourites/Filter/Filter';
import { Button, Input } from '@forever/ui-kit';
import { MdOutlineClose } from 'react-icons/md';
import { AiFillFilter } from 'react-icons/ai';

const categoriesOptions: SelectOptions<CategoriesType> = [
    { value: 'Men', label: 'Men' },
    { value: 'Women', label: 'Women' },
    { value: 'Kids', label: 'Kids' }
]

const subCategoriesOptions: SelectOptions<SubCategoriesType> = [
    { value: 'Topwear', label: 'Topwear' },
    { value: 'Bottomwear', label: 'Bottomwear' },
    { value: 'Winterwear', label: 'Winterwear' }
]

const FilterDrawer = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
    const { queryState, setQueries } = useQueryParams<Pick<ProductSearchQuery, 'categories' | 'searchQuery' | 'subCategories'>>({
        categories: [],
        subCategories: [],
        searchQuery: '',
    })

    const { categories, subCategories, searchQuery } = queryState;

    const [filterData, setFilterData] = useState<{
        text: string,
        categories: CategoriesType[],
        subCategories: SubCategoriesType[]
    }>({
        text: '',
        categories: [],
        subCategories: []
    })

    useEffect(() => {
        setFilterData({
            text: searchQuery,
            categories: categories,
            subCategories: subCategories
        })
    }, [])

    const applyFilter = () => {
        setQueries({
            categories: filterData.categories,
            subCategories: filterData.subCategories,
            searchQuery: filterData.text
        })
        onClose();
    }

    return (
        <Drawer className={styles.filter_drawer} align='bottom' isDisableCloseBtn={true} isDisableDrag={false} onClose={onClose} open={open}>
            <div className={styles.filter_drawer_content}>
                <h6>
                    Filter
                </h6>
                <Input
                    size='lg'
                    placeholder='Enter a search'
                    onChange={(e) => setFilterData({ ...filterData, text: e.target.value })}
                    rightIcon={FaMagnifyingGlass}
                    rightIconSize={15}
                    className={styles.search_input} />
                <Select
                    defaultValue={categories.map((category) => ({ value: category, label: category }))}
                    placeholder='Category'
                    onChange={(options) => setFilterData({ ...filterData, categories: options.map(option => option.value) })}
                    isMulti
                    className={styles.form_select}
                    options={categoriesOptions}
                    classNamePrefix="react-select"
                />
                <Select
                    defaultValue={subCategories.map((subCategory) => ({ value: subCategory, label: subCategory }))}
                    placeholder='Type'
                    isMulti
                    className={styles.form_select}
                    onChange={(options) => setFilterData({ ...filterData, subCategories: options.map(option => option.value) })}
                    options={subCategoriesOptions}
                    classNamePrefix="react-select"
                />
                <div className={styles.filter_drawer_btn_group}>
                    <Button onClick={onClose}>
                        CLOSE
                        <MdOutlineClose size={20} />
                    </Button>
                    <Button onClick={applyFilter}>
                        APPLY
                        <AiFillFilter size={20} />
                    </Button>
                </div>
            </div>
        </Drawer>
    )
}

export default FilterDrawer
