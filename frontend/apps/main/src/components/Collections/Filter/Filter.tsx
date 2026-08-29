import { type ChangeEvent, useEffect, useState } from "react";
import styles from "./Filter.module.scss";
import { IoIosArrowUp } from "react-icons/io";
import clsx from "clsx";
import { useDebounce, useMediaQuery } from "@forever/hook-kit"
import { useMaxPrice } from "@/store/product/hooks";
import { useQueryParams } from "@forever/query-kit";
import type { CategoriesType, ProductSearchQueryType, SubCategoriesType } from "@/types/product.type";
import { Button, Input } from "@forever/ui-kit";
import { FaXmark } from "react-icons/fa6";

const Filter = () => {
  const [openFilterOptions, setOpenFilterOptions] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 640 });

  const { querySetters, queryState } = useQueryParams<Pick<ProductSearchQueryType, 'categories' | 'subCategories' | 'minPrice' | 'searchQuery'>>({
    categories: [],
    subCategories: [],
    minPrice: 0,
    searchQuery: ""
  });

  const { setCategories, setMinPrice, setSubCategories, setSearchQuery } = querySetters;
  const { categories, minPrice, subCategories, searchQuery } = queryState;

  const [debouncedText, setText, text] = useDebounce<string>(searchQuery, 700);
  const maxPrice = useMaxPrice();
  const [lowerPrice, setLowerPrice] = useState(0);

  const handleCategoryChance = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setCategories([...categories, e.target.value as CategoriesType])
    } else {
      setCategories(categories.filter(item => item !== e.target.value));
    }
  };

  const handleSubCategoryChance = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSubCategories([...subCategories, e.target.value as SubCategoriesType])
    } else {
      setSubCategories(subCategories.filter(item => item !== e.target.value));
    }
  };

  const handleMinPriceChance = () => setMinPrice(lowerPrice);

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

  return (
    <div className={styles.filter}>
      <div
        onClick={() =>
          setOpenFilterOptions(isMobile ? !openFilterOptions : true)
        }
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
            rightIconOnClick={() => setText('')}
            type="text"
            placeholder="Search"
          />
          <div className={styles.filter_box}>
            <h6>CATEGORIES</h6>
            <div className={styles.filter_option}>
              <input
                onChange={handleCategoryChance}
                value="Men"
                checked={categories.includes('Men')}
                type="checkbox"
              />
              <span>Men</span>
            </div>
            <div className={styles.filter_option}>
              <input
                onChange={handleCategoryChance}
                value="Women"
                checked={categories.includes('Women')}
                type="checkbox"
              />
              <span>Women</span>
            </div>
            <div className={styles.filter_option}>
              <input
                onChange={handleCategoryChance}
                value="Kids"
                checked={categories.includes('Kids')}
                type="checkbox"
              />
              <span>Kids</span>
            </div>
          </div>

          <div className={styles.filter_box}>
            <h6>TYPE</h6>
            <div className={styles.filter_option}>
              <input
                onChange={handleSubCategoryChance}
                value="Topwear"
                checked={subCategories.includes('Topwear')}
                type="checkbox"
              />
              <span>Topwear</span>
            </div>
            <div className={styles.filter_option}>
              <input
                onChange={handleSubCategoryChance}
                value="Bottomwear"
                checked={subCategories.includes('Bottomwear')}
                type="checkbox"
              />
              <span>Bottomwear</span>
            </div>
            <div className={styles.filter_option}>
              <input
                onChange={handleSubCategoryChance}
                value="Winterwear"
                checked={subCategories.includes('Winterwear')}
                type="checkbox"
              />
              <span>Winterwear</span>
            </div>
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
              onClick={() => handleMinPriceChance()}
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
