// src/Pages/WalletDetailPage.tsx
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useCart } from "../AuthContext/CartContext";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomerReview from "../Components/CustomerReview";
import FloatingCustomerReview from "../Components/FloatingCustomerReview";
import { useAuth } from "../AuthContext/AuthContext";

// ---------- TYPES ----------
type Params = { id: string };

export type WalletVariant = {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  inStock: boolean;
  description?: string;
  contents?: string[];
  customization?: {
    available: boolean;
    options?: string[];
    userInput?: string;
  };
  specifications?: Record<string, string>;
  warranty?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  careInstructions?: string;

};

export type Wallet = {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  imageUrl: string;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  variants?: WalletVariant[];
  brand?: string;
  seller?: string;
  warranty?: string;
  returnPolicy?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  careInstructions?: string;
  contents?: string[];
  customization?: {
    available: boolean;
    options?: string[];
    userInput?: string;
  };
  specifications?: Record<string, string>;
  description?: string; // <-- add this
};


// ---------- LOADER ----------
function Loader() {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="w-12 h-12 border-4 border-t-[#b46029] border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
}

// ---------- COMPONENT ----------
export default function WalletDetailPage() {
  const { id } = useParams<Params>();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [currentProduct, setCurrentProduct] = useState<Wallet | null>(null);
  const [currentVariant, setCurrentVariant] = useState<WalletVariant | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

  const [backendRating, setBackendRating] = useState<number>(0);
  const [backendReviewsCount, setBackendReviewsCount] = useState<number>(0);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------- FETCH PRODUCT ----------
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/products/${id}`);
        const data: Wallet = res.data?.product;
        if (!data) throw new Error("No product found");

        setCurrentProduct(data);

        // Default variant = first variant or main product
        setCurrentVariant(
          data.variants?.[0] || {
            id: data._id,
            name: data.name,
            price: data.price,
            discount: data.discount,
            image: data.imageUrl,
            inStock: data.inStock,
            description: data.description,
            contents: data.contents,
            customization: data.customization,
            specifications: data.specifications,
            material: data.material,
            dimensions: data.dimensions,
            weight: data.weight,
            careInstructions: data.careInstructions,
          }
        );
      } catch (err) {
        console.error("Product fetch error:", err);
        setCurrentProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ---------- FETCH REVIEWS ----------
  const fetchReviews = async () => {
    if (!currentProduct || !currentVariant) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}api/review/${currentProduct._id}?limit=8`
      );
      setBackendRating(res.data.averageRating ?? 0);
      setBackendReviewsCount(res.data.reviewCount ?? 0);
    } catch (err) {
      console.error("Review fetch error:", err);
      setBackendRating(0);
      setBackendReviewsCount(0);
    }
  };

  // ---------- ADD TO CART ----------
  const handleAddToCart = () => {
    if (!currentProduct || !currentVariant) return;

    addToCart({
      id: currentVariant.id,
      name: currentVariant.name || currentProduct.name,
      price: currentVariant.price,
      quantity,
      image: currentVariant.image,
    });

    if (isAuthenticated) {
      setToast(`${currentVariant.name || currentProduct.name} added to cart`);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
    }
  };

  // ---------- CLEANUP ----------
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  if (loading) return <Loader />;
  if (!currentProduct)
    return <p className="text-center mt-20 text-lg text-gray-400">Product not found</p>;

  const finalRating = backendRating || currentProduct.rating || 0;
  const finalReviewsCount = backendReviewsCount || currentProduct.reviews || 0;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* LEFT IMAGE */}
        <div className="flex-1 relative">
          {!imgLoaded && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-100 rounded-3xl">
              <div className="w-10 h-10 border-4 border-t-[#b46029] border-gray-200 rounded-full animate-spin"></div>
            </div>
          )}

          {currentVariant?.image && (
            <motion.img
              src={currentVariant.image}
              alt={currentVariant.name}
               loading="lazy" 
              className={`w-full rounded-3xl shadow-xl object-cover transition-opacity duration-500 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImgLoaded(true)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {currentVariant?.discount && (
            <span className="absolute top-3 right-3 bg-[#b46029] text-white font-semibold px-2 py-1 rounded-md text-sm shadow-md">
              {currentVariant.discount}% OFF
            </span>
          )}
        </div>

        {/* RIGHT INFO */}
        <div className="flex-1 flex flex-col gap-4 sm:gap-5">
          <h1 className="text-3xl sm:text-4xl font-serif text-gray-900">
            {currentVariant?.name || currentProduct.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl font-semibold text-[#b46029]">
              ₹{currentVariant?.price}
            </span>
            {currentVariant?.discount && (
              <span className="line-through text-gray-400 text-lg ml-2">
                ₹{currentProduct.price}
              </span>
            )}
          </div>

          {/* Variant Selector */}
          {currentProduct.variants && currentProduct.variants.length > 1 && (
            <select
              value={currentVariant?.id}
              onChange={(e) => {
                const selected = currentProduct.variants?.find((v) => v.id === e.target.value);
                if (selected) setCurrentVariant(selected);
                setQuantity(1);
              }}
              className="border px-2 py-1 rounded w-44 mt-2"
            >
              {currentProduct.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} - ₹{v.price}
                </option>
              ))}
            </select>
          )}

          {/* Description */}
          {currentVariant?.description && (
            <p className="text-gray-700 leading-relaxed">{currentVariant.description}</p>
          )}

          {/* Structured Info */}
          <div className="mt-2 space-y-2 text-gray-700">
            {currentVariant?.material && (
              <p>
                <span className="font-semibold">Material:</span> {currentVariant.material}
              </p>
            )}
              <p className="text-sm text-gray-600 mt-2">
              📌We provide <strong>custom dimensions based on your need</strong> Just mention your preferred size in the checkout customization note — our team will reach out to finalize the details.
            </p>
            {currentVariant?.dimensions && (
              <p>
                <span className="font-semibold">Dimensions:</span> {currentVariant.dimensions}
              </p>
            )}
            {currentVariant?.weight && (
              <p>
                <span className="font-semibold">Weight:</span> {currentVariant.weight}
              </p>
            )}
            {currentVariant?.careInstructions && (
              <p>
                <span className="font-semibold">Care Instructions:</span>{" "}
                {currentVariant.careInstructions}
              </p>
            )}
          </div>

          {/* Stock / Warranty */}
          <div className="flex flex-wrap gap-3 text-gray-500 text-sm sm:text-base mt-2">
            <span
              className={`px-2 py-1 rounded ${
                currentVariant?.inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {currentVariant?.inStock ? "In Stock" : "Out of Stock"}
            </span>

            {currentVariant?.warranty && (
              <span className="bg-gray-100 px-2 py-1 rounded">{currentVariant.warranty}</span>
            )}
          </div>

          {/* ADD TO CART */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 items-center">
            <button
              onClick={handleAddToCart}
              disabled={!currentVariant?.inStock}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium shadow-lg ${
                currentVariant?.inStock
                  ? "bg-[#b46029] hover:bg-[#8c4a20] text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
          </div>

          {/* Contents / Customization / Specifications */}
          <div className="mt-6 flex flex-col gap-4">
            {currentVariant?.contents && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-semibold text-gray-800">Contents</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {currentVariant.contents.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentVariant?.customization?.available && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-semibold text-gray-800">Customization Options</h3>
                <p className="text-gray-600">
                  {currentVariant.customization.options?.join(", ")}
                </p>
              </div>
            )}

            {currentVariant?.specifications && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-semibold text-gray-800">Specifications</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {Object.entries(currentVariant.specifications).map(([key, value], idx) => (
                    <li key={idx}>
                      <span className="font-medium">{key}:</span> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <CustomerReview
        productId={currentProduct._id}
        variantId={currentVariant?.id}
        setBackendRating={setBackendRating}
        setBackendReviewsCount={setBackendReviewsCount}
      />
    
      {isAuthenticated &&
        <FloatingCustomerReview
          productId={currentProduct._id}
          variantId={currentVariant?.id}
          onReviewSubmitted={fetchReviews}
        />
      }

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#E8D4B7] text-black px-6 py-3 rounded-lg shadow-lg text-sm sm:text-base"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
