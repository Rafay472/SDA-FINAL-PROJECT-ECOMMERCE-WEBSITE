import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {


  const { products, search, showSearch } = useContext(ShopContext);

 
  const [showFilter, setShowFilter] = useState(false); 
  const [filterProducts, setFilterProducts] = useState([]); 
  const [category, setCategory] = useState([]); 
  const [subCategory, setSubCategory] = useState([]); 
  const [sortType, setSortType] = useState('relavent'); // Stores the current sorting type

  // category selection (add or remove categories) - left
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      // Remove the category if it was already selected
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      // category add kar dy ga + agar woh selected nhi hai tou
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  // subcategory selection (add or remove subcategories)
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      // Remove the subcategory if it was already selected
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      // Add the subcategory if not already selected
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  // Apply filters to the product list
  const applyFilter = () => {
    let productsCopy = products.slice(); // Create a copy of the products array to avoid mutating the original

    // Filter by search query if search is enabled
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by selected categories
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    // Filter by selected subcategories
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Update the filtered products state
    setFilterProducts(productsCopy);
  };

  // Sort the filtered products
  const sortProduct = () => {
    let fpCopy = filterProducts.slice(); // Create a copy of the filtered products array

    switch (sortType) {
      case 'low-high':
        // Sort products by price (low to high)
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;

      case 'high-low':
        // Sort products by price (high to low)
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        // Default sorting (reapply filters)
        applyFilter();
        break;
    }
  };

  // Reapply filters when filters, search query, or products change
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  // Reapply sorting whenever the sorting type changes
  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      
      {/* Filter Options Section */}
      <div className='min-w-60'>
        <p
          onClick={() => setShowFilter(!showFilter)}
          className='my-2 text-xl flex items-center cursor-pointer gap-2'
        >
          FILTERS
          {/* Dropdown toggle for small screens */}
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory} /> Men
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory} /> Women
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory} /> Kids
            </p>
          </div>
        </div>
        {/* Subcategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory} /> Topwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory} /> Bottomwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory} /> Winterwear
            </p>
          </div>
        </div>
      </div>

      {/* Products Display Section */}
      <div className='flex-1'>

        {/* Title and Sort Options */}
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} /> {/* Title component */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className='border-2 border-gray-300 text-sm px-2'
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Display Filtered Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Collection;