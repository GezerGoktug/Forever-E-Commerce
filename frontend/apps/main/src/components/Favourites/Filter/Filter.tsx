import { useEffect, useState } from 'react'
import Select from 'react-select';
import styles from './Filter.module.scss';
import { FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';
import { useQueryParams } from '@forever/query-kit';
import type { CategoriesType, ProductSearchQuery, SortType, SubCategoriesType } from '@/types/product.type';
import { useDebounce } from '@forever/hook-kit';
import { AiFillFilter } from 'react-icons/ai';
import { Input } from '@forever/ui-kit';
import FilterDrawer from './FilterDrawer/FilterDrawer';

export type SelectOptions<T> = { value: T, label: T }[]

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

const Filter = () => {
    const { queryState, querySetters } = useQueryParams<Pick<ProductSearchQuery, 'categories' | 'sorting' | 'searchQuery' | 'subCategories'>>({
        categories: [],
        subCategories: [],
        searchQuery: '',
        sorting: 'DEFAULT'
    })

    const { categories, subCategories, sorting, searchQuery } = queryState;
    const { setCategories, setSubCategories, setSearchQuery, setSorting } = querySetters;

    const [isOpen, setIsOpen] = useState(false)

    const [debouncedSearchText, setText, text] = useDebounce<string>(searchQuery, 700);

    useEffect(() => {
        setSearchQuery(debouncedSearchText)
    }, [debouncedSearchText])

    const openFilterDrawer = () => setIsOpen(true);

    const closeFilterDrawer = () => setIsOpen(false);

    const clearSearchText = () => {
        if (text.trim().length > 0)
            setText('')
    };

    return (
        <div className={styles.filter}>
            <FilterDrawer open={isOpen} onClose={closeFilterDrawer} />
            <div className={styles.filter_left}>
                <Select
                    defaultValue={categories.map((category) => ({ value: category, label: category }))}
                    placeholder='Category'
                    onChange={(options) => setCategories(options.map(option => option.value))}
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
                    onChange={(options) => setSubCategories(options.map(option => option.value))}
                    options={subCategoriesOptions}
                    classNamePrefix="react-select"
                />
                <Input
                    placeholder='Enter a search'
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    rightIcon={text.trim().length > 0 ? FaXmark : FaMagnifyingGlass}
                    rightIconOnClick={clearSearchText}
                    rightIconSize={15}
                    className={styles.search_input}
                />
            </div>
            <div className={styles.filter_right}>
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
                <AiFillFilter onClick={openFilterDrawer} size={25} className={styles.filter_modal_icon} />

            </div>
        </div>
    )
}

export default Filter
