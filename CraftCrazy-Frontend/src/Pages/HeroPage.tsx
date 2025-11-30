import BestSeller from "../Components/BestSellers.js";
import GiftCollections from "../Components/GiftCollections.js";
import HomePage from "../Components/HomePage.js";
import TestimonialsPage from "../Components/TestimonialPage.js";

import WatchShop from "../Components/WatchShop.js";
import AboutUs from "../Components/AboutUs.js";
const HeroPage = () => {
  return (
    <>
      <HomePage />
    
      <GiftCollections />
       <WatchShop />
      <TestimonialsPage />
      {/* <AboutUs/> */}
    </>
  );
};

export default HeroPage;
