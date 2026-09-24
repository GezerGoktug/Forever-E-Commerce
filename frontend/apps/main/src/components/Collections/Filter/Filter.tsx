import { type ChangeEvent, useEffect, useState } from "react";
import styles from "./Filter.module.scss";
import { IoIosArrowUp } from "react-icons/io";
import clsx from "clsx";
import { useDebounce, useMediaQuery } from "@forever/hook-kit"
import { BREAKPOINTS } from "@forever/sass-utils/breakpoints";
import { useMaxPrice } from "@/store/product/hooks";
import { useQueryParams } from "@forever/query-kit";
import type { CategoriesType, ProductSearchQuery, SubCategoriesType } from "@/types/product.type";
import { Button, Input } from "@forever/ui-kit";
import { FaXmark } from "react-icons/fa6";

const CATEGORIES: CategoriesType[] = ["Men", "Women", "Kids"];

const SUB_CATEGORIES: SubCategoriesType[] = ["Topwear", "Bottomwear", "Winterwear"];

const Filter = () => {
  const { querySetters, queryState } = useQueryParams<Pick<ProductSearchQuery, 'categories' | 'subCategories' | 'minPrice' | 'searchQuery'>>({
    categories: [],
    subCategories: [],
    minPrice: 0,
    searchQuery: ""
  });

  const { setCategories, setMinPrice, setSubCategories, setSearchQuery } = querySetters;
  const { categories, minPrice, subCategories, searchQuery } = queryState;

  const maxPrice = useMaxPrice();

  const [openFilterOptions, setOpenFilterOptions] = useState(true);
  const [lowerPrice, setLowerPrice] = useState(0);

  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS.sm });
  const [debouncedText, setText, text] = useDebounce<string>(searchQuery, 700);

  useEffect(() => {
    setLowerPrice(minPrice);
  }, [])

  useEffect(() => {
    setSearchQuery(debouncedText)
  }, [debouncedText])

  useEffect(() => {
    if (minPrice === 0) {
      setLowerPrice(0)
    }
  }, [minPrice])

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setCategories([...categories, e.target.value as CategoriesType])
    } else {
      setCategories(categories.filter(item => item !== e.target.value));
    }
  };

  const handleSubCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSubCategories([...subCategories, e.target.value as SubCategoriesType])
    } else {
      setSubCategories(subCategories.filter(item => item !== e.target.value));
    }
  };

  const handleMinPriceChange = () => setMinPrice(lowerPrice);

  const toggleFilterOptions = () => setOpenFilterOptions(isMobile ? !openFilterOptions : true);

  const clearSearchText = () => setText('');

  return (
    <div className={styles.filter}>
      <div
        onClick={toggleFilterOptions}
        className={styles.filter_header}
      >
        <h5>FILTERS</h5>
        <IoIosArrowUp
          size={20}
          className={clsx(styles.filter_header_icon, {
            [styles.open_icon]: openFilterOptions,
          })}
        />
      </div>
      {openFilterOptions && (
        <>
          <Input
            onChange={(e) => setText(e.target.value)}
            value={text}
            rightIcon={text.trim().length > 0 ? FaXmark : undefined}
            rightIconSize={20}
            rightIconOnClick={clearSearchText}
            type="text"
            placeholder="Search"
          />
          <div className={styles.filter_box}>
            <h6>CATEGORIES</h6>
            {CATEGORIES.map((category) => (
              <label key={category} className={styles.filter_option}>
                <input
                  onChange={handleCategoryChange}
                  value={category}
                  checked={categories.includes(category)}
                  type="checkbox"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>

          <div className={styles.filter_box}>
            <h6>TYPE</h6>
            {SUB_CATEGORIES.map((subCategory) => (
              <label key={subCategory} className={styles.filter_option}>
                <input
                  onChange={handleSubCategoryChange}
                  value={subCategory}
                  checked={subCategories.includes(subCategory)}
                  type="checkbox"
                />
                <span>{subCategory}</span>
              </label>
            ))}
          </div>

          <div className={styles.filter_box}>
            <h6>PRICE</h6>
            <div className={styles.filter_range_prices}>
              <span>${lowerPrice}</span>
              <span>${maxPrice}</span>
            </div>
            <input
              onChange={(e) => setLowerPrice(+e.target.value)}
              className={styles.filter_range}
              defaultValue="0"
              value={lowerPrice}
              min="0"
              max={maxPrice}
              type="range"
            />
            <Button
              onClick={handleMinPriceChange}
              className={styles.filter_range_btn}
              size="sm"
            >
              APPLY
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Filter;
