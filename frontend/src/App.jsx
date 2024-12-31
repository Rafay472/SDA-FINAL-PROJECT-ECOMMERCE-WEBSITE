import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Collection = React.lazy(() => import('./pages/Collection'));
const About = React.lazy(() => import('./pages/About'));
const Product = React.lazy(() => import('./pages/Product'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Login = React.lazy(() => import('./pages/Login'));
const PlaceOrder = React.lazy(() => import('./pages/PlaceOrder'));
const Orders = React.lazy(() => import('./pages/Orders'));
const Verify = React.lazy(() => import('./pages/Verify'));
const Contact = React.lazy(() => import('./pages/Contact'));

// Contact Builder import
import { assets } from './assets/assets';
import ContactBuilder from './builders/ContactBuilder';

const App = () => {
    // Build the contact page dynamically using the builder pattern
    const contact = new ContactBuilder()
        .setTitle('CONTACT', 'US')
        .setStoreInfo(
            '54709 Willms Station Suite 350, Washington, USA',
            '(415) 555-0132',
            'admin@forever.com'
        )
        .setCareerInfo('Learn more about our teams and job openings.', 'Explore Jobs')
        .setImage(assets.contact_img)
        .build();

    return (
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
            <ToastContainer />
            
            {/* Global components */}
            <Navbar />
            <SearchBar />

            {/* Lazy loading routes */}
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/collection' element={<Collection />} />
                    <Route path='/about' element={<About />} />
                    
                    {/* Pass the dynamically built contact content to the Contact page */}
                    <Route path='/contact' element={<Contact contact={contact} />} />
                    
                    <Route path='/product/:productId' element={<Product />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/place-order' element={<PlaceOrder />} />
                    <Route path='/orders' element={<Orders />} />
                    <Route path='/verify' element={<Verify />} />
                </Routes>
            </Suspense>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default App;
