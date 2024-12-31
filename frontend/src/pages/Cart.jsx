import React, { useContext, useEffect, useState } from 'react'; 
import { ShopContext } from '../context/ShopContext'; 
import Title from '../components/Title'; 
import { assets } from '../assets/assets'; 
import CartTotal from '../components/CartTotal'; 

// view and manage items in their cart
const Cart = () => {


  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

   // yeh cart items process kary ga jab cartItems or products change hon gain
  useEffect(() => {
    if (products.length > 0) { // check kary ga products load hogaya hain before processing the cart
      const tempData = []; 

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) { // Only include items with a quantity greater than 0
            tempData.push({
              _id: items, // Product ID
              size: item, // Item size
              quantity: cartItems[items][item] // Quantity of the item
            });
          }
        }
      }

      setCartData(tempData); // Update the state with processed cart data
    }
  }, [cartItems, products]); // Re-run this logic whenever cartItems or products change

  
  return (
    <div className='border-t pt-14'>
    
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} /> 
      </div>

      {/* Cart Items Section */}
      <div>
        {cartData.map((item, index) => {
      
          const productData = products.find((product) => product._id === item._id);

          return (
            <div 
              key={index} 
              className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
            >
              {/* Product details */}
              <div className='flex items-start gap-6'>
                {/* Product image */}
                <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                <div>
                  {/* Product name */}
                  <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>

                  {/* Product price and size */}
                  <div className='flex items-center gap-5 mt-2'>
                    <p>{currency}{productData.price}</p> {/* Show price with currency */}
                    <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p> {/* Show size */}
                  </div>
                </div>
              </div>

              {/* Quantity input */}
              <input 
                onChange={(e) => e.target.value === '' || e.target.value === '0' 
                  ? null 
                  : updateQuantity(item._id, item.size, Number(e.target.value)) // Update quantity on change
                }
                className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' 
                type="number" 
                min={1} 
                defaultValue={item.quantity} 
              />

              {/* Delete button */}
              <img 
                onClick={() => updateQuantity(item._id, item.size, 0)} // Set quantity to 0 to remove the item
                className='w-4 mr-4 sm:w-5 cursor-pointer' 
                src={assets.bin_icon} 
                alt="Delete"
              />
            </div>
          );
        })}
      </div>

      {/* Cart Total and Checkout Section */}
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal /> {/* Show the total amount and delivery fee */}
          <div className='w-full text-end'>
            {/* Checkout button */}
            <button 
              onClick={() => navigate('/place-order')} // Navigate to the place-order page
              className='bg-black text-white text-sm my-8 px-8 py-3'
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
