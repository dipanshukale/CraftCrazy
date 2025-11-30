// src/ProductDetails/KeyChainDetailPage.tsx
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../AuthContext/CartContext";
import { useAuth } from "../AuthContext/AuthContext";
import CustomerReview from "../Components/CustomerReview";
import FloatingReviewChat from "../Components/FloatingCustomerReview";

/* ---------------------- TYPES (same as BirthdayHamper) ---------------------- */

type Params = { id: string };

export type KeyChainVariant = {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  description?: string;
  inStock: boolean;
  contents?: string[];
  customization?: { available: boolean; options?: string[] };
  specifications?: Record<string, string>;
  material?: string;
  dimensions?: string;
  weight?: string;
  careInstructions?: string;
};

export type KeyChainProduct = {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  description?: string;
  imageUrl: string;
  inStock: boolean;
  warranty?: string;
  tags?: string[];
  variants?: KeyChainVariant[];
  contents?: string[];
  customization?: { available: boolean; options?: string[] };
  specifications?: Record<string, string>;
  material?: string;
  dimensions?: string;
  weight?: string;
  careInstructions?: string;
};

/* --------------------------- Loader Component --------------------------- */

function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C45A36] rounded-full animate-spin"></div>
    </div>
  );
}

/* --------------------------- Reviews Hook --------------------------- */

function useProductReviews(productId?: string) {
  const [backendRating, setBackendRating] = useState(0);
  const [backendReviewsCount, setBackendReviewsCount] = useState(0);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}api/reviews/product/${productId}?limit=8`
        );
        const data = await res.json();
        setBackendRating(data.averageRating ?? 0);
        setBackendReviewsCount(data.reviewCount ?? 0);
      } catch (err) {
        console.error("Review Fetch Error", err);
      }
    };

    fetchReviews();
  }, [productId]);

  return { backendRating, backendReviewsCount, setBackendRating, setBackendReviewsCount };
}

/* ----------------------------- MAIN PAGE ----------------------------- */

export default function KeyChainDetailPage() {
  const { id } = useParams<Params>();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [currentProduct, setCurrentProduct] = useState<KeyChainProduct | null>(null);
  const [currentVariant, setCurrentVariant] = useState<KeyChainVariant | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* --------------------- FETCH PRODUCT FROM BACKEND --------------------- */

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/products/${id}`);
        const data: KeyChainProduct = res.data?.product;

        if (!data) throw new Error("No product found");

        setCurrentProduct(data);

        // default variant = first or parent product
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

  /* -------------------- FETCH REVIEWS -------------------- */

  const { backendRating, backendReviewsCount, setBackendRating, setBackendReviewsCount } =
    useProductReviews(currentProduct?._id);

  /* ------------------------ ADD TO CART ------------------------ */

  const handleAddToCart = () => {
    if (!currentProduct || !currentVariant || !currentProduct.inStock) return;

    addToCart({
      id: currentProduct._id,
      name: currentProduct.name,
      price: currentVariant.price,
      quantity,
      image: currentVariant.image,
    });

    if (isAuthenticated) {
      setToast(`${currentProduct.name} added to cart`);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  /* --------------------------- RENDER --------------------------- */

  if (loading) return <Loader />;
  if (!currentProduct) return <p className="text-center mt-20 text-lg text-gray-400">Product not found</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* ---------------------- LEFT SIDE IMAGE ---------------------- */}
        <div className="flex-1 relative">
          {!imgLoaded && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-100 rounded-3xl">
              <div className="w-10 h-10 border-4 border-t-[#C45A36] border-gray-200 rounded-full animate-spin"></div>
            </div>
          )}

          {currentVariant?.image && (
            <motion.img
              src={currentVariant.image}
              alt={currentProduct.name}
               loading="lazy" 
              className={`w-full rounded-3xl shadow-xl object-cover transition-opacity duration-500 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImgLoaded(true)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Discount Tag */}
          {currentVariant?.discount && (
            <span className="absolute top-3 right-3 bg-[#C45A36] text-white font-semibold px-2 py-1 rounded-md text-sm shadow-md">
              {currentVariant.discount}% OFF
            </span>
          )}

          {/* Thumbnails */}
          {currentProduct.variants && currentProduct.variants.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto py-1 snap-x snap-mandatory">
              {currentProduct.variants.map((v, i) => (
                <motion.div
                  key={v.id || i}
                  onClick={() => setCurrentVariant(v)}
                  className={`relative cursor-pointer border-2 rounded-lg overflow-hidden flex-shrink-0 snap-start ${
                    currentVariant?.image === v.image
                      ? "border-[#C45A36] ring-2 ring-[#C45A36]"
                      : "border-gray-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={v.image} className="h-20 w-20 object-cover rounded-lg" />

                  {v.discount && (
                    <span className="absolute top-1 left-1 bg-[#C45A36] text-white text-xs font-semibold px-1 py-0.5 rounded-md">
                      {v.discount}% OFF
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ---------------------- RIGHT SIDE INFO ---------------------- */}
        <div className="flex-1 flex flex-col gap-4 sm:gap-5">
          <h1 className="text-3xl sm:text-4xl font-serif text-gray-900">{currentProduct.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-semibold text-[#C45A36]">
              ₹{currentVariant?.price}
            </span>
            {currentVariant?.discount && (
              <span className="line-through text-gray-400 text-lg">₹{currentProduct.price}</span>
            )}
          </div>

          {/* Description */}
          {currentProduct.description && (
            <p className="text-gray-700 leading-relaxed">{currentProduct.description}</p>
          )}

          {/* Structured Fields */}
          <div className="mt-2 space-y-2 text-gray-700">
            {currentProduct.material && (
              <p>
                <span className="font-semibold">Material:</span> {currentProduct.material}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              📌We provide <strong>custom dimensions based on your need</strong> Just mention your preferred size in the checkout customization note — our team will reach out to finalize the details.
            </p>
            {currentProduct.dimensions && (
              <p>
                <span className="font-semibold">Dimensions:</span> {currentProduct.dimensions}
              </p>
            )}
            {currentProduct.weight && (
              <p>
                <span className="font-semibold">Weight:</span> {currentProduct.weight}
              </p>
            )}
            {currentProduct.careInstructions && (
              <p>
                <span className="font-semibold">Care Instructions:</span> {currentProduct.careInstructions}
              </p>
            )}
          </div>

          {/* Tags + Stock */}
          <div className="flex flex-wrap gap-3 text-gray-500 text-sm sm:text-base mt-2">
            {currentProduct.tags?.map((tag, idx) => (
              <span key={idx} className="bg-gray-100 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            <span
              className={`px-2 py-1 rounded ${
                currentProduct.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {currentProduct.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-4 mt-4 items-center">
            <button
              onClick={handleAddToCart}
              disabled={!currentProduct.inStock}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium shadow-lg ${
                currentProduct.inStock
                  ? "bg-[#C45A36] hover:bg-[#8c4a20] text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
          </div>

          {/* Contents */}
          <div className="mt-6 flex flex-col gap-4">
            {currentProduct.contents && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-semibold text-gray-800">Contents</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {currentProduct.contents.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentProduct.customization?.available && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-semibold text-gray-800">Customization Options</h3>
                <p className="text-gray-600">
                  {currentProduct.customization.options?.join(", ")}
                </p>
              </div>
            )}

            {currentProduct.specifications && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-semibold text-gray-800">Specifications</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {Object.entries(currentProduct.specifications).map(([k, v], idx) => (
                    <li key={idx}>
                      <span className="font-medium">{k}:</span> {String(v)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      {currentProduct && currentVariant && (
        <>
          <CustomerReview
            productId={currentProduct._id}
            variantId={currentVariant.id}
            setBackendRating={setBackendRating}
            setBackendReviewsCount={setBackendReviewsCount}
          />


          {isAuthenticated && <FloatingReviewChat productId={currentProduct._id} variantId={currentVariant.id} />}
        </>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#E8D4B7] text-black px-6 py-3 rounded-lg shadow-lg text-sm sm:text-base z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
