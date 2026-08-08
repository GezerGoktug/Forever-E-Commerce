import { useEffect, useState } from 'react'
import Select from 'react-select';
import styles from './Filter.module.scss';
import { FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';
import { useQueryParams } from '@forever/query-kit';
import type { CategoriesType, ProductSearchQueryType, SubCategoriesType } from '@/types/product.type';
import { useDebounce } from '@forever/hook-kit';
import FilterModal from './FilterModal/FilterModal';
import { AiFillFilter } from 'react-icons/ai';
import { type SortType } from '@/helper/generateSortingType';
import { Input, Modal } from '@forever/ui-kit';

export type OptionsType<T> = { value: T, label: T }[]

const categoriesOptions: OptionsType<CategoriesType> = [
    { value: 'Men', label: 'Men' },
    { value: 'Women', label: 'Women' },
    { value: 'Kids', label: 'Kids' }
]

const subCategoriesOptions: OptionsType<SubCategoriesType> = [
    { value: 'Topwear', label: 'Topwear' },
    { value: 'Bottomwear', label: 'Bottomwear' },
    { value: 'Winterwear', label: 'Winterwear' }
]

const Filter = () => {
    const { queryState, querySetters } = useQueryParams<Pick<ProductSearchQueryType, 'categories' | 'sorting' | 'searchQuery' | 'subCategories'>>({
        categories: [],
        subCategories: [],
        searchQuery: '',
        sorting: 'DEFAULT'
    })

    const { categories, subCategories, sorting, searchQuery } = queryState;
    const { setCategories, setSubCategories, setSearchQuery, setSorting } = querySetters;

    const [debouncedVal, setText, text] = useDebounce<string>(searchQuery, 700);

    useEffect(() => {
        setSearchQuery(debouncedVal)
    }, [debouncedVal])

    const [modal, setModal] = useState(false)

    return (
        <div className={styles.filter}>
            <Modal wrapperClassName={styles.filter_modal_wrapper} className={styles.filter_modal} open={modal} closeModal={() => setModal(false)}>
                <FilterModal closeModal={() => setModal(false)} />
            </Modal>
            <div className={styles.filter_left}>
                <Select
                    defaultValue={categories.map((dt) => ({ value: dt, label: dt }))}
                    placeholder='Category'
                    onChange={(dt) => setCategories(dt.map(item => item.value))}
                    isMulti
                    className={styles.form_select}
                    options={categoriesOptions}
                    classNamePrefix="react-select"
                />
                <Select
                    defaultValue={subCategories.map((dt) => ({ value: dt, label: dt }))}
                    placeholder='Type'
                    isMulti
                    className={styles.form_select}
                    onChange={(dt) => setSubCategories(dt.map(item => item.value))}
                    options={subCategoriesOptions}
                    classNamePrefix="react-select"
                />
                <Input
                    placeholder='Enter a search'
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    rightIcon={text.trim().length > 0 ? FaXmark : FaMagnifyingGlass}
                    rightIconOnClick={() => {
                        if (text.trim().length > 0)
                            setText('')
                    }}
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
                    <option value="DEFAULT">Sort by: Relavent</option>
                    <option value="LOW_TO_HIGH">Sort by: Low to High</option>
                    <option value="HIGH_TO_LOW">Sort by: High to Low</option>
                </select>
                <AiFillFilter onClick={() => setModal(true)} size={25} className={styles.filter_modal_icon} />

            </div>
        </div>
    )
}

export default Filter