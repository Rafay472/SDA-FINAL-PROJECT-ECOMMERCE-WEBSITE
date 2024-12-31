import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext' 
import Title from '../components/Title'; 
import axios from 'axios'; 

const Orders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext);

  
  const [orderData, setorderData] = useState([]);

  // Function to fetch order data from the backend
  const loadOrderData = async () => {
    try {
      
      if (!token) {
        return null; 
      }

      
      const response = await axios.post(
        backendUrl + '/api/order/userorders', 
        {}, 
        { headers: { token } } 
      );

      
      if (response.data.success) {
        let allOrdersItem = []; 
        response.data.orders.map((order) => {
          // Loop through each order and add extra details to each item
          order.items.map((item) => {
            item['status'] = order.status; 
            item['payment'] = order.payment; 
            item['paymentMethod'] = order.paymentMethod; 
            item['date'] = order.date; 
            allOrdersItem.push(item); 
          });
        });
        // Reverse the order to show the latest items first and update state
        setorderData(allOrdersItem.reverse());
      }
    } catch (error) {
     
    }
  };

  
  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className='border-t pt-16'>
        {/* Page title */}
        <div className='text-2xl'>
            <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        {/* Display the order data */}
        <div>
            {
              orderData.map((item, index) => (
                <div 
                  key={index} 
                  className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'
                >
                    
                    <div className='flex items-start gap-6 text-sm'>
                        {/* Product image */}
                        <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                        
                        {/* Product details */}
                        <div>
                          <p className='sm:text-base font-medium'>{item.name}</p>
                          <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                            {/* Display price, quantity, and size */}
                            <p>{currency}{item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Size: {item.size}</p>
                          </div>
                          {/* Display order date */}
                          <p className='mt-1'>
                            Date: <span className=' text-gray-400'>
                              {new Date(item.date).toDateString()}
                            </span>
                          </p>
                          {/* Display payment method */}
                          <p className='mt-1'>
                            Payment: <span className=' text-gray-400'>
                              {item.paymentMethod}
                            </span>
                          </p>
                        </div>
                    </div>

                    {/* Right section: Status and Track Order button */}
                    <div className='md:w-1/2 flex justify-between'>
                        {/* Order status */}
                        <div className='flex items-center gap-2'>
                            <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                            <p className='text-sm md:text-base'>{item.status}</p>
                        </div>
                        {/* Button to refresh or track order (reloads the order data) */}
                        <button 
                          onClick={loadOrderData} 
                          className='border px-4 py-2 text-sm font-medium rounded-sm'
                        >
                          Track Order
                        </button>
                    </div>
                </div>
              ))
            }
        </div>
    </div>
  );
};

export default Orders; 
