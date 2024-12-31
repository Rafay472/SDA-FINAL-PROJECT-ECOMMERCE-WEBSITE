import React from 'react';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';

const Contact = ({ contact }) => {
    return (
        <div>
            {/* Title Section */}
            <div className="text-center text-2xl pt-10 border-t">
                <Title text1={contact.title.text1} text2={contact.title.text2} />
            </div>

            {/* Store Info Section */}
            <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
                <img className="w-full md:max-w-[480px]" src={contact.imageSrc} alt="Contact" />
                <div className="flex flex-col justify-center items-start gap-6">
                    <p className="font-semibold text-xl text-gray-600">Our Store</p>
                    <p className="text-gray-500">{contact.storeInfo.address}</p>
                    <p className="text-gray-500">
                        Tel: {contact.storeInfo.phone} <br /> Email: {contact.storeInfo.email}
                    </p>
                    <p className="font-semibold text-xl text-gray-600">Careers at Forever</p>
                    <p className="text-gray-500">{contact.careerInfo.text}</p>
                    <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
                        {contact.careerInfo.buttonText}
                    </button>
                </div>
            </div>

            {/* Newsletter Box */}
            <NewsletterBox />
        </div>
    );
};

export default Contact;
