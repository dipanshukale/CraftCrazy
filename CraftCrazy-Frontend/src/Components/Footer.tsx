// src/Components/Footer.tsx
import { Instagram, Facebook, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#fff8f2] text-black py-12 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:justify-between gap-8">
        {/* About */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <h3 className="text-2xl font-bold text-[#432818]">CraftiCrazy</h3>
          <p className="text-gray-900 italic leading-relaxed text-sm sm:text-base">
            Handcrafted gifts that celebrate your moments. Elegance, thoughtfulness, and uniqueness in every creation.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <h3 className="text-xl font-semibold text-[#432818]">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-yellow-400 transition-colors duration-300">Home</a>
            </li>
            <li>
              <a href="/aboutus" className="hover:text-yellow-400 transition-colors duration-300">About Us</a>
            </li>
            <li>
              <a href="/newarrivals" className="hover:text-yellow-400 transition-colors duration-300">Gift Collections</a>
            </li>
            <li>
              <a href="/contactus" className="hover:text-yellow-400 transition-colors duration-300">Contact</a>
            </li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <h3 className="text-xl font-semibold text-[#432818]">Connect With Us</h3>
          <div className="flex justify-center sm:justify-start gap-6">
            <a
              href="https://www.instagram.com/crafticrazy_710"
              className="hover:text-pink-400 hover:scale-110 transition-transform duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://www.facebook.com/share/1Kb89Kyub2/"
              className="hover:text-blue-500 hover:scale-110 transition-transform duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://wa.me/919876543210"
              className="hover:text-green-500 hover:scale-110 transition-transform duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={24} />
            </a>
          </div>
          <p className="flex justify-center sm:justify-start items-center gap-2 text-sm">
            <Mail size={18} />
            <a href="mailto:crafticrazy@gmail.com" className="hover:underline">
              crafticrazy@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 border-t border-gray-300 pt-6 text-center text-[#432818] text-sm">
        &copy; {new Date().getFullYear()} CraftiCrazy. Crafted with ❤️ and creativity.
      </div>
    </footer>
  );
};

export default Footer;
