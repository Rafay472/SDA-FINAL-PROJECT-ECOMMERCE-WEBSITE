import { createContext, useEffect, useState } from "react"; 
import { toast } from "react-toastify"; // Library to show pop-up messages for success or errors
import { useNavigate } from "react-router-dom"; // For navigating to different pages in the app
import axios from 'axios'; 


export const ShopContext = createContext();

// main component_e-commerce logic
const ShopContextProvider = (props) => {

    
    const currency = '$'; 
    const delivery_fee = 10; 

    // Backend server URL (stored in environment variables for flexibility)
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    
    const [search, setSearch] = useState(''); 
    const [showSearch, setShowSearch] = useState(false); 
    const [cartItems, setCartItems] = useState({}); // Items in the cart (organized by item ID and size)
    const [products, setProducts] = useState([]); // List of all products available in the shop
    const [token, setToken] = useState(''); // User's login token for accessing protected API routes

    const navigate = useNavigate(); // Helps us redirect users to other pages

    /**
     * Add an item to the cart.
     * - If the user hasn't selected a size, show an error message.
     * - If the item already exists in the cart, increase the quantity.
     * - Otherwise, add the item to the cart.
     * - If the user is logged in, also save the cart change to the backend.
     */
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select Product Size'); 
            return;
        }

        // Make a copy of the current cart (so we don't directly change it)
        let updatedCart = structuredClone(cartItems);

        // Check if the item is already in the cart
        if (updatedCart[itemId]) {
            if (updatedCart[itemId][size]) {
                // item hai cart mein same size
                updatedCart[itemId][size] += 1;
            } else {
                // agar same size ka item nhi hai cart mein
                updatedCart[itemId][size] = 1;
            }
        } else {
            // item hai hee nhi hai cart mein 
            updatedCart[itemId] = { [size]: 1 };
        }

        // Update the cart state
        setCartItems(updatedCart);

        // If the user is logged in, save the cart change to the backend
        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
            } catch (error) {
                console.error(error);
                toast.error("Failed to add item to cart.");
            }
        }
    };

    
     // cart item count kar ny ky liya
     // for in loop each object
    
    const getCartCount = () => {
        let totalItems = 0;
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                totalItems += cartItems[itemId][size]; // Add up the quantities
            }
        }
        return totalItems; 
    };

    /**
     *  Quantity Update specific item cart mein kar ny ky liya.
     * - If the user is logged in, sync the change with the backend.
     */
    const updateQuantity = async (itemId, size, quantity) => {
        // Make a copy of the cart
        let updatedCart = structuredClone(cartItems);

        // quantity update hore specific item with size
        updatedCart[itemId][size] = quantity;

        // Update the state with the new cart
        setCartItems(updatedCart);

        // Save the change to the backend if the user is logged in
        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                console.error(error);
                toast.error("Failed to update quantity.");
            }
        }
    };

    /**
     * cart ky items ki total price count kar ry hum.
     * - Finds each item's price from the product list.
     * - Multiplies price by quantity and adds it to the total.
     */
    const getCartAmount = () => {
        let totalPrice = 0;

        // Loop through the cart items
        for (const itemId in cartItems) {
            const product = products.find(p => p._id === itemId); // Find the product details by ID
            if (product) {
                for (const size in cartItems[itemId]) {
                    totalPrice += product.price * cartItems[itemId][size]; // Multiply price by quantity
                }
            }
        }

        return totalPrice; // Return the total price
    };

    /**
     * Fetch the list of products from the backend and save them in the state.
     */
    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products.reverse()); // Save the products in state
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load products.");
        }
    };

    /**
     * Fetch the user's cart data from the backend.
     * - This happens when the user logs in or reloads the page.
     */
    const getUserCart = async (token) => {
        try {
            const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData); // Save the cart data in state
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load cart.");
        }
    };

    // Fetch products when the component first loads
    useEffect(() => {
        getProductsData();
    }, []);

    // If a token exists (in state or local storage), fetch the user's cart
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!token && storedToken) {
            setToken(storedToken); // Update token state
            getUserCart(storedToken); // Fetch the cart
        } else if (token) {
            getUserCart(token); // Fetch the cart when token changes
        }
    }, [token]);

    // Provide all shared data and functions to other components
    const value = {
        products, currency, delivery_fee, // Shop info
        search, setSearch, showSearch, setShowSearch, // Search functionality
        cartItems, addToCart, setCartItems, // Cart management
        getCartCount, updateQuantity, getCartAmount, // Cart helpers
        navigate, backendUrl, setToken, token // Misc utilities
    };

    // Wrap children components with the ShopContext provider
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
