import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useAuth} from "../src/AuthContext/AuthContext.tsx"


import Navbar from "./Components/Navbar";
import HeroPage from "./Pages/HeroPage";
import AboutUs from "./Components/AboutUs";
import Footer from "./Components/Footer";
import CustomerDemand from "./Pages/CustomerDemand";
import NewArrivals from "./Components/NewArrival";
import BirthdayHamperPage from "./Pages/CustomizedHamper/BirthdayHamper";
import ContactUs from "./Pages/ContactUs";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import SuccessPage from "./Pages/SuccessPage.tsx";
import ScrollToTop from "./Components/ScroolToTop.tsx";

// Product Pages
import CartSidebar from "./Pages/Cart.tsx";
import WeddingHamper from "./Pages/CustomizedHamper/WeddingHamper";
import CorporateHamper from "./Pages/CustomizedHamper/CorporateHamper.js";
import WoodenPhotoFrames from "./Pages/PhotoFrames/WoodenFrame.js";
import GlassPhotoFrames from "./Pages/PhotoFrames/GlassFrame.js";
import WomenAccessories from "./Pages/Accessories/WomenAccessories.js";
import KeyChainPage from "./Pages/Accessories/KeyChain.js";
import WalletPage from "./Pages/Accessories/WalletPage.js";
import BraceletPage from "./Pages/Accessories/BraceletPage.js";
import ToteBagPage from "./Pages/Accessories/ToteBagPage.js";
import ResinJewelryPage from "./Pages/ResinArt/ResinJewelarypage.js";
import ResinKeychainPage from "./Pages/ResinArt/ResinKeychainPage.js";
import ResinClockPage from "./Pages/ResinArt/ResinClockpage.js";
import ResinNameplatePage from "./Pages/ResinArt/ResinNameplatePage.js";
import ResinPhotoFramesPage from "./Pages/ResinArt/ResinPhotoFramesPage.js";
import ResinCoasterSetPage from "./Pages/ResinArt/ResinCoasterSetPage.js";
import ResinPujaThalePage from "./Pages/ResinArt/ResinPujaThalePage.js";
import DiwaliHamperPage from "./Pages/Festivel/DiwaliHamperPage.js";



// Product Details
import KeyChainDetails from "./ProductDetails/KeyChainDetails.tsx";
import BraceletDetails from "./ProductDetails/BraceletDetails.tsx";
import ToteBagDetailPage from "./ProductDetails/ToteBagDetailPage.tsx";
import WalletDetailPage from "./ProductDetails/WalletDetailPage.tsx";
import WomenAccessoryDetailPage from "./ProductDetails/WomenAccessoryDetailPage.tsx";
import BirthdayHamperDetails from "./ProductDetails/BirthdayHamperDetails.tsx";
import CorporateHamperDetails from "./ProductDetails/CorporateHamperDetails.tsx";
import GlassFrameDetails from "./ProductDetails/GlassFrameDetails.tsx";
import ResinFrameDetailPage from "./ProductDetails/ResinFrameDetailPage.tsx";
import WoodenFrameDetailPage from "./ProductDetails/WoodenFrameDetailPage.tsx";
import ResinClockDetailPage from "./ProductDetails/ResinClockDetailPage.tsx";
import ResinCoasterDetailPage from "./ProductDetails/ResinCoasterDetailPage.tsx";
import ResinJewelryDetailPage from "./ProductDetails/ResinJewelryPageDetail.tsx";
import ResinKeychainDetailPage from "./ProductDetails/ResinKeychainDetailPage.tsx";
import ResinNameplateDetailPage from "./ProductDetails/ResinNameplateDetailPage.tsx";
import ResinPhotoFrameDetailPage from "./ProductDetails/ResinPhotoFrameDetailPage.tsx";
import ResinPujaThaleDetailPage from "./ProductDetails/ResinPujaThaleDetailPage.tsx";
import WeddingHamperDetailPage from "./ProductDetails/WeddingHamperDetailPage.tsx";
import EngagementTrayPage from "./Pages/WeddingSpecial/EngagementTrayPage.tsx";
import EngagementTrayDetailPage from "./ProductDetails/EngagementTrayDetail.tsx";
import VarmalaPreservationPage from "./Pages/WeddingSpecial/VarmalaPreservationPage.tsx";
import HaldiPlatterPage from "./Pages/WeddingSpecial/HaldiPlatterpage.tsx";
import HaldiPlatterDetail from "./ProductDetails/HaldiPlatterDetail.tsx";
import DiwaliHamperDetail from "./ProductDetails/DiwaliHamperDetail.tsx";
import HoliKitPage from "./Pages/Festivel/HoliKitPage.tsx"

// Other Components
import ParallaxSection from "./Components/ParallaxSection.js";
import LoginPromptModal from "./Components/LoginPromptModal"; 
import CheckoutPage from "./Pages/CheckoutPage.tsx";
import VarmalaPreservationDetail from "./ProductDetails/VarmalaPreservationDetail.tsx";
import ChristmasSpecialDetail from "./ProductDetails/ChristmasSpecialDetail.tsx";
import ChristmasSpecialPage from "./Pages/Festivel/ChristmasSpecialPage.tsx";
import HoliKitDetail from "./ProductDetails/HoliKitDetail.tsx";
import RakhiPage from "./Pages/Festivel/RakhiPage.tsx";
import RakhiDetailPage from "./ProductDetails/RakhiDetail.tsx";
import ProductDetailPage from "./Pages/ProductDetailPage.tsx";



function App() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [cartOpen, setCartOpen] = useState(false); // For Sidebar
  const {isAuthenticated} = useAuth();

  useEffect(() => {
    if (!isAuthenticated){
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <ScrollToTop />

      {/* Navbar with cart toggle */}
      <Navbar setCartOpen={setCartOpen} />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} setIsOpen={setCartOpen} />
      
      <Routes>
        {/* Home & Static Pages */}
        <Route path="/" element={<HeroPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/checkout" element={<CheckoutPage/>} />
        <Route path="/success" element={<SuccessPage/>} />

        

        {/* Product Pages */}
        <Route path="/customerdemand" element={<CustomerDemand />} />
        <Route path="/newarrivals" element={<NewArrivals />} />
        <Route path="/BirthdayHamper" element={<BirthdayHamperPage />}/>
        <Route path="/wedding" element={<WeddingHamper />} />
        <Route path="/corporate" element={<CorporateHamper />} />
        <Route path="/wooden" element={<WoodenPhotoFrames/>}/>
        <Route path="/glass" element={<GlassPhotoFrames/>} />
        <Route path="/resin" element={<ResinPhotoFramesPage/>} />
        <Route path="/womenAss" element={<WomenAccessories />}/>
        <Route path="/keychain" element={<KeyChainPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/bracelet" element={<BraceletPage />} />
        <Route path="/tote" element={<ToteBagPage />} />
        <Route path="/resinJwell" element ={<ResinJewelryPage/>}/>
        <Route path="/resinKeychain" element ={<ResinKeychainPage/>}/>
        <Route path="/resinclock" element={<ResinClockPage />}/>
        <Route path="/resinNameplate" element ={<ResinNameplatePage/>}/>
        <Route path="/resinframe" element={<ResinPhotoFramesPage/>} />
        <Route path="/resincoasters" element={<ResinCoasterSetPage/>} />
        <Route path="/resinthale" element={<ResinPujaThalePage/>} />
        <Route path="/diwali" element={<DiwaliHamperPage/>} />
        <Route path="/Tray" element={<EngagementTrayPage/>} />
        <Route path="/varmala" element={<VarmalaPreservationPage/>} />
        <Route path="/HaldiPlatter" element={<HaldiPlatterPage/>} />
        <Route path="/christmas" element={<ChristmasSpecialPage/>} />
        <Route path="/Holi" element={<HoliKitPage/>} />
        <Route path="/rakhi" element={<RakhiPage/>} />
    <Route path="/product/:id" element={<ProductDetailPage />} />




        {/* Product Details */}
        <Route path="/keydetail/:id" element={<KeyChainDetails/>}/>
        <Route path="/braceletdetail/:id" element={<BraceletDetails/>}/>
        <Route path="/totebagdetail/:id" element={<ToteBagDetailPage/>}/>
        <Route path="/walletdetail/:id" element={<WalletDetailPage/>}/>
        <Route path="/accessorydetail/:id" element={<WomenAccessoryDetailPage/>}/>
        <Route path="/birthdaydetail/:id" element={<BirthdayHamperDetails/>}/>
        <Route path="/corporatedetail/:id" element={<CorporateHamperDetails/>}/>
        <Route path="/weddingDetail/:id" element={<WeddingHamperDetailPage/>}/>
        <Route path="/Glassdetail/:id" element={<GlassFrameDetails/>}/>
        <Route path="/Framedetail/:id" element={<ResinFrameDetailPage/>}/>
        <Route path="/woodendetail/:id" element={<WoodenFrameDetailPage/>}/>
        <Route path="/clockdetail/:id" element={<ResinClockDetailPage/>}/>
        <Route path="/caosterdetail/:id" element={<ResinCoasterDetailPage/>}/>
        <Route path="/jewelarydetail/:id" element={<ResinJewelryDetailPage/>}/>
        <Route path="/keychaindetail/:id" element={<ResinKeychainDetailPage/>}/>
        <Route path="/Nameplatedetail/:id" element={<ResinNameplateDetailPage/>}/>
        <Route path="/photoframedetail/:id" element={<ResinPhotoFrameDetailPage/>}/>
        <Route path="/pujathale/:id" element={<ResinPujaThaleDetailPage/>}/>
        <Route path="/Tray/:id" element={<EngagementTrayDetailPage/>}/>
        <Route path="/varmaladetail/:id" element={<VarmalaPreservationDetail/>}/>
        <Route path="/HaldiDetail/:id" element={<HaldiPlatterDetail/>}/>
        <Route path="/DiwaliDetail/:id" element={<DiwaliHamperDetail/>}/>
        <Route path="/ChristmasDetail/:id" element={<ChristmasSpecialDetail/>}/>
        <Route path="/HoliDetail/:id" element={<HoliKitDetail/>}/>
        <Route path="/RakhiDetail/:id" element={<RakhiDetailPage/>}/>



      </Routes>

      <ParallaxSection />
      <Footer />

      {/* Login Prompt Modal */}
      {showPrompt && !isAuthenticated && (
        <LoginPromptModal onClose={() => setShowPrompt(false)} />
      )}
       <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </Router>
  );
}

export default App;
