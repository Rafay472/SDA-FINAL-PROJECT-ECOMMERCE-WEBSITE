import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'


const componentFactory = (componentName) => {
  const components = {
      Hero: <Hero />,
      LatestCollection: <LatestCollection />,
      BestSeller: <BestSeller />,
      OurPolicy: <OurPolicy />,
      NewsletterBox: <NewsletterBox />,
  };
  return components[componentName] || null;
};

const Home = () => {
  const componentOrder = ['Hero', 'LatestCollection', 'BestSeller', 'OurPolicy', 'NewsletterBox']; 
  return (
      <div>
          {componentOrder.map((name) => componentFactory(name))}
      </div>
  );
};

export default Home
























// const Home = () => {
//   return (
//     <div>
//       <Hero />
//       <LatestCollection/>
//       <BestSeller/>
//       <OurPolicy/>
//       <NewsletterBox/>
//     </div>
//   )
// }
