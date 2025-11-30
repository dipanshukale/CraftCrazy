// src/Components/NewArrival.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../AuthContext/CartContext";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import axios from "axios";
import { getApiUrl } from "../utils/apiConfig";

// Full Product type definition
interface Product {
  id: number | string;
  name?: string;
  heading?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  type?: string;
  category?: string;
  image: string;
  rating?: number;
  popularity?: number;
  date?: string;
  description?: string;
  link?: string;
  tags?: string[];
  brand?: string;
  seller?: string;
  inStock?: boolean;
  warranty?: string;
  returnPolicy?: string;
  contents?: string[];
  variants?: { id: number | string; name: string; price?: number; image?: string }[];
}

const NewArrivals: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [highlight, setHighlight] = useState("All Products");
  const [sortOption, setSortOption] = useState("Default sorting");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cartQuantities, setCartQuantities] = useState<{ [key: string]: number }>({});

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setTimeout(() => setLoaded(true), 800);
  }, []);

  const routeMap: Record<string, string> = {
    keychain: "/keydetail/:id",
    bracelets: "/braceletdetail/:id",
    totebag: "/totebagdetail/:id",
    wallet: "/walletdetail/:id",
    accessory: "/accessorydetail/:id",
    birthday: "/birthdaydetail/:id",
    corporate: "/corporatedetail/:id",
    wedding: "/weddingDetail/:id",
    glass: "/Glassdetail/:id",
    frame: "/Framedetail/:id",
    wooden: "/woodendetail/:id",
    clock: "/clockdetail/:id",
    coaster: "/caosterdetail/:id",
    jewelry: "/jewelarydetail/:id",
    resinkeychain: "/keychaindetail/:id",
    resinnameplate: "/Nameplatedetail/:id",
    photoframe: "/photoframedetail/:id",
    pujathale: "/pujathale/:id",
    engagementtray: "/Tray/:id",
    varmala: "/varmaladetail/:id",
    haldi: "/HaldiDetail/:id",
    diwali: "/DiwaliDetail/:id",
    christmas: "/ChristmasDetail/:id",
    holi: "/HoliDetail/:id",
    rakhi: "/RakhiDetail/:id",
  };

  // Fetch products from API only
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await axios.get(getApiUrl('api/products/newarrivals'));
        const apiData = res.data?.allProudcts || [];
        console.log(apiData)
        const mapped: Product[] = apiData.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          heading: item.heading,
          price: item.price,
          oldPrice: item.oldPrice,
          discount: item.discount,
          type: item.type,
          category: item.category,
          image: item.imageUrl,
          rating: item.rating,
          popularity: item.popularity,
          date: item.date,
          description: item.description,
          link: item.link,
          tags: item.tags,
          brand: item.brand,
          seller: item.seller,
          inStock: item.inStock,
          warranty: item.warranty,
          returnPolicy: item.returnPolicy,
          contents: item.contents,
          variants: item.variants,
        }));
        setProducts(mapped);
      } catch (err) {
        console.error("API ERROR:", err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const handleAddToCart = (item: Product) => {
    const currentQty = cartQuantities[item.id] || 0;
    const newQty = currentQty + 1;

    setCartQuantities((prev) => ({ ...prev, [item.id]: newQty }));

    addToCart({
      id: String(item.id),
      name: item.name || item.heading || "Product",
      image: item.image,
      price: item.price,
      quantity: 1,
    });

    setToast(isAuthenticated ? `${item.name || item.heading} added to cart` : "Please login first!");
    setTimeout(() => setToast(null), 2000);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredProducts = products.filter((item) => {
    const categoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(item.type || "Others");

    let highlightMatch = true;
    switch (highlight) {
      case "Sale":
        highlightMatch = (item.discount || 0) > 15;
        break;
      case "Best Seller":
        highlightMatch = (item.price || 0) > 800;
        break;
      case "Hot Items":
        highlightMatch = (item.price || 0) < 500;
        break;
      default:
        highlightMatch = true;
    }
    return categoryMatch && highlightMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "Sort by popularity":
        return (b.popularity || 0) - (a.popularity || 0);
      case "Sort by average rating":
        return (b.rating || 0) - (a.rating || 0);
      case "Sort by latest":
        return new Date(b.date || "").getTime() - new Date(a.date || "").getTime();
      case "Sort by price: low to high":
        return (a.price || 0) - (b.price || 0);
      case "Sort by price: high to low":
        return (b.price || 0) - (a.price || 0);
      default:
        return 0;
    }
  });

    const SidebarContent = () => {
    const highlightOptions = ["All Products", "Best Seller", "Sale", "Hot Items"];

     return (
         <div>
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-3">Highlight</h3>
            <ul className="space-y-2">
              {highlightOptions.map(opt => (
                <li
                  key={opt}
                  onClick={() => setHighlight(opt)}
                  className={`text-sm cursor-pointer ${highlight === opt ? "text-[#b46029] font-semibold" : "text-gray-700"}`}
                >
                  {opt}
                </li>
              ))}
            </ul>
            </div>
          );
        };

  return (
    <section className="mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-[Playfair_Display] font-bold text-gray-900">
          Best Sellers
        </h2>
        <p className="mt-2 text-gray-600 text-lg italic">Discover our most-loved creations</p>
      </div>
      <section className="py-12 px-6 sm:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {[
            { id: 1, type: "image", image: "/vp1-1.jpg" },
            {
              id: 2,
              type: "text",
              title: "Elegant Table Essentials",
              heading: "HANDCRAFTED COASTER",
              button: "Shop Now",
              link: "/resincoasters",
            },
            { id: 3, type: "image", image: "/bouquet.jpg" },
            {
              id: 4,
              type: "text",
              title: "Preservation of Memories",
              heading: "VARMALA PRESERVATION",
              button: "Shop Now",
              link: "/varmala",
            },
            { id: 5, type: "image", image: "/coaster2.jpg" },
            {
              id: 6,
              type: "text",
              title: "Handcrafted Flower Bouquet",
              heading: "ARTIFICIAL FLOWER BOUQUET",
              button: "Shop Now",
              link: "/BirthdayHamper",
            },
          ].map((item) =>
            item.type === "image" ? (
              <div key={item.id} className="overflow-hidden shadow-md aspect-[1/1.1]">
                <img src={item.image} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div
                key={item.id}
                className="flex flex-col justify-center items-center bg-white p-6 shadow-md text-center aspect-[1/1.1]"
              >
                <p className="text-gray-600 italic">{item.title}</p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
                  {item.heading}
                </h3>

                <Link
                  to={item.link || "/"}
                  className="mt-4 px-5 py-2 bg-[#C45A36] hover:bg-[#8c341f] text-white rounded-md"
                >
                  {item.button}
                </Link>
              </div>
            )
          )}
        </div>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
         <aside className="md:col-span-1 bg-white p-4 rounded-lg h-fit shadow mb-6 md:mb-0">
          <SidebarContent />
        </aside>

        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-6 ml-4">
            <p className="text-sm text-gray-600">Showing {sortedProducts.length} results</p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Sort:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:ring-[#C45A36]"
              >
                <option>Default sorting</option>
                <option>Sort by popularity</option>
                <option>Sort by average rating</option>
                <option>Sort by latest</option>
                <option>Sort by price: low to high</option>
                <option>Sort by price: high to low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 ml-5 mb-8">
            <AnimatePresence>
              {loaded && !loadingProducts
                ? sortedProducts.map((item) => {
                    const rawCat = item.category || item.type || "others";
                    const normalizedCategory = rawCat.toLowerCase().replace(/[^a-z0-9]/g, "");
                    const routePath = routeMap[normalizedCategory] || "/product/:id";

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md overflow-hidden cursor-pointer"
                      >
                        <Link to={routePath.replace(":id", String(item.id))}>
                          <div className="relative w-full aspect-[1/1.2] bg-gray-100 overflow-hidden group">
                            {item.discount && (
                              <span className="absolute top-2 left-2 text-black bg-white text-xs px-2 py-1 rounded-xl">
                                SALE
                              </span>
                            )}
                            <img
                              src={item.image}
                              alt={item.name || item.heading}
                               loading="lazy" 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <h3 className="mt-3 text-sm md:text-base text-gray-800 font-semibold px-2 line-clamp-2">
                            {item.name || item.heading}
                          </h3>
                          {item.description && (
                            <p className="mt-1 text-xs md:text-sm text-gray-600 px-2 line-clamp-3 italic">
                              {item.description}
                            </p>
                          )}
                          <div className="mt-1 flex items-center gap-2 px-2">
                            <span className="text-lg font-semibold text-black">₹{item.price}</span>
                            {item.oldPrice && item.oldPrice > item.price && (
                              <span className="text-sm text-gray-500 line-through italic">
                                ₹{item.oldPrice}
                              </span>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })
                : Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="relative w-full aspect-[1/1.2] bg-gray-200">
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
                        </div>
                        <div className="p-4">
                          <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse w-5/6"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#E8D4B7] text-black px-6 py-3 rounded-lg shadow-lg text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NewArrivals;
