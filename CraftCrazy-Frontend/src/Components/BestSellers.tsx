import { useEffect } from "react";
import { Star } from "lucide-react";

const bestSellers = [
  { id: 1, name: "Resin Photo Frame", image: "ResinFrame.jpeg", description: "A unique resin photo frame designed to preserve your special moments in style." },
  { id: 2, name: "Handmade Keychain", image: "keyChain.jpeg", description: "Custom resin keychains designed with love. Durable, stylish, and perfect for everyday use." },
  { id: 3, name: "Wedding Varmala Preservation", image: "Wedding.jpeg", description: "Eco-friendly wedding crafts created from waste materials. Unique, sustainable, and full of love for the planet." },
  { id: 4, name: "Engagement Ring Holder", image: "Engagement1.jpeg", description: "Elegant resin ring holder with floral details – perfect for weddings, proposals, or keepsakes." },
  { id: 5, name: "Photo Frame", image: "PhotoFrame.jpeg", description: "Where art meets memory – a handcrafted frame built to last a lifetime." },
  { id: 6, name: "Magical Gift Box", image: "GiftBox3.jpeg", description: "A surprise box filled with love & creativity." },
];

export default function BestSeller() {
  useEffect(() => {
    console.log("BestSeller component mounted");

    // Example: could trigger analytics or animations here
    return () => {
      console.log("BestSeller component unmounted");
    };
  }, []);

  return (
    <div className="relative min-h-screen py-12 sm:py-20 px-4 sm:px-6 overflow-hidden">
      {/* Floating Gradient Blobs */}
      <div className="absolute w-40 sm:w-72 md:w-96 h-40 sm:h-72 md:h-96 bg-[#AB420A] rounded-full blur-3xl opacity-20 top-10 left-5 sm:left-10 animate-pulse-slow"></div>
      <div className="absolute w-32 sm:w-60 md:w-80 h-32 sm:h-60 md:h-80 bg-[#CD500C] rounded-full blur-3xl opacity-25 bottom-10 right-5 sm:right-16 animate-pulse-slow"></div>
      <div className="absolute w-28 sm:w-48 md:w-60 h-28 sm:h-48 md:h-60 bg-[#FF7A00] rounded-full blur-2xl opacity-15 top-1/2 left-1/4 sm:left-1/3 animate-pulse-slower"></div>

      {/* Title */}
      <div className="relative text-center mb-10 sm:mb-16 z-10">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-serif text-[#AB420A] drop-shadow-lg">
          Best Sellers
        </h1>
        <p className="mt-3 sm:mt-5 text-base sm:text-lg md:text-xl text-[#8C5E3C] max-w-3xl mx-auto leading-relaxed px-2">
          Our bestsellers are more than products — they carry the essence of love, craft, and tradition in every detail.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
        {bestSellers.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl overflow-hidden border border-[#F0D6C2] shadow-lg hover:shadow-2xl hover:-translate-y-3 sm:hover:-translate-y-4 transition-all duration-500"
          >
            {/* Star Badge */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-[#AB420A] to-[#CD500C] p-1.5 sm:p-2 rounded-full shadow-lg text-white">
              <Star size={16} className="sm:w-5 sm:h-5" />
            </div>

            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="w-full h-56 sm:h-72 md:h-80 object-cover rounded-t-2xl sm:rounded-t-3xl transform group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 text-center">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#6B3E1A] group-hover:text-[#AB420A] transition-colors duration-300">
                {item.name}
              </h2>
              <p className="text-[#8C5E3C] text-sm sm:text-base mt-2 sm:mt-3 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
