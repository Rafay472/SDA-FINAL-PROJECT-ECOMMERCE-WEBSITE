import React, { useContext, useState } from 'react';
import Title from '../components/Title'; 
import CartTotal from '../components/CartTotal'; 
import { assets } from '../assets/assets'; 
import { ShopContext } from '../context/ShopContext'; 
import axios from 'axios'; 
import { toast } from 'react-toastify'; 

const PlaceOrder = () => {
    // payment method ki state hai
    const [method, setMethod] = useState('cod');

    
    const { 
        navigate, 
        backendUrl, // Backend server URL
        token, 
        cartItems, 
        setCartItems, 
        getCartAmount, 
        delivery_fee, 
        products 
    } = useContext(ShopContext);

    // State hai delivery form data ko store kar ny ky liya 
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    // Handler to update form data when input values change
    const onChangeHandler = (event) => {
        const name = event.target.name; 
        const value = event.target.value; 
        setFormData(data => ({ ...data, [name]: value })); // Update state with new value
    };

    // Function to initialize Razorpay payment
    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Razorpay key
            amount: order.amount, // Payment amount
            currency: order.currency, // Payment currency
            name: 'Order Payment', // Payment description
            description: 'Order Payment',
            order_id: order.id, // Razorpay order ID
            receipt: order.receipt, // Order receipt ID
            handler: async (response) => {
                // Handle payment success
                console.log(response);
                try {
                    // Verify the payment with the backend
                    const { data } = await axios.post(
                        backendUrl + '/api/order/verifyRazorpay',
                        response,
                        { headers: { token } }
                    );
                    if (data.success) {
                        navigate('/orders'); // Navigate to orders page
                        setCartItems({}); // Clear the cart
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error); // Show error message
                }
            }
        };
        const rzp = new window.Razorpay(options); // Initialize Razorpay
        rzp.open(); // Open the Razorpay payment popup
    };

    // order jab place kary gain 
    const onSubmitHandler = async (event) => {
        event.preventDefault(); // page reload na ho
        try {
            
            let orderItems = [];
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        
                        const itemInfo = structuredClone(products.find(product => product._id === items));
                        if (itemInfo) {
                            itemInfo.size = item;
                            itemInfo.quantity = cartItems[items][item];
                            orderItems.push(itemInfo); 
                        }
                    }
                }
            }

            // Prepare the full order data
            let orderData = {
                address: formData, // Delivery address
                items: orderItems, // Order items
                amount: getCartAmount() + delivery_fee 
            };

            // Handle different payment methods
            switch (method) {
                case 'cod': // Cash on Delivery
                    const response = await axios.post(
                        backendUrl + '/api/order/place',
                        orderData,
                        { headers: { token } }
                    );
                    if (response.data.success) {
                        setCartItems({}); 
                        navigate('/orders'); 
                    } else {
                        toast.error(response.data.message); // Show error message
                    }
                    break;

                case 'stripe': // Stripe payment
                    const responseStripe = await axios.post(
                        backendUrl + '/api/order/stripe',
                        orderData,
                        { headers: { token } }
                    );
                    if (responseStripe.data.success) {
                        const { session_url } = responseStripe.data;
                        window.location.replace(session_url); // Redirect to Stripe session
                    } else {
                        toast.error(responseStripe.data.message); // Show error message
                    }
                    break;

                case 'razorpay': // Razorpay payment
                    const responseRazorpay = await axios.post(
                        backendUrl + '/api/order/razorpay',
                        orderData,
                        { headers: { token } }
                    );
                    if (responseRazorpay.data.success) {
                        initPay(responseRazorpay.data.order); // Start Razorpay payment
                    }
                    break;

                default:
                    break;
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message); // Show error message
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* Left side: Delivery Information */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>

                {/* Input fields for delivery information */}
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
                    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
                </div>
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                    <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                </div>
                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
            </div>

            {/* Right side: Cart Total and Payment Method */}
            <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal /> {/* Component to display total cart value */}
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />

                    {/* Payment method selection */}
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder; 
