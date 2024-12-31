// This component is used to display an individual product item in the latest collection
import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext'; 
import { Link } from 'react-router-dom'; 


const ProductItem = ({ id, image, name, price }) => {
    
    const { currency } = useContext(ShopContext); 

    return (
        // Wrap the product item in a Link component for navigation to the product details page
        <Link 
            onClick={() => scrollTo(0, 0)} // Scroll to the top of the page when the product is clicked
            className='text-gray-700 cursor-pointer' 
            to={`/product/${id}`} 
        >
         
            <div className='overflow-hidden'>
                {/* Display the first product image, with a zoom-in effect on hover */}
                <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt="" />
            </div>
            {/* Display the product name */}
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            {/* Display the product price with the currency symbol */}
            <p className='text-sm font-medium'>{currency}{price}</p>
        </Link>
    );
};

export default ProductItem; 
