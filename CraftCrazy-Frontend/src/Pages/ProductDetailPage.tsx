// src/ProductDetails/ProductDetailPage.tsx
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../AuthContext/CartContext";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../AuthContext/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

import CustomerReview from "../Components/CustomerReview";
import FloatingCustomerReview from "../Components/FloatingCustomerReview";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: string;
  oldPrice?: string;
  imageUrl?: string | string[];
  inStock: boolean;
  rating?: string;
  reviews?: string;
  tags?: string[];
  warranty?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  careInstructions?: string;
  deliveryType?: string;
  deliveryAvailability?: string;
  deliveryEstimated?: string;
  customizationAvailable: boolean;
  customizationOptions?: string;
  maxOrderQuantity?: string;
}

type Params = { id: string };

function Loader() {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="w-12 h-12 border-4 border-t-[#C45A36] border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<Params>();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [backendRating, setBackendRating] = useState<number>(0);
  const [backendReviewsCount, setBackendReviewsCount] = useState<number>(0);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}api/products/${id}`);
        if (!res.ok) throw new Error("Product fetch failed");
        const data: { product: Product } = await res.json();
        setProduct(data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;

    addToCart({
      id: product._id,
      name: product.name,
      price: Number(product.price),
      quantity,
      image: Array.isArray(product.imageUrl)
        ? product.imageUrl[0] || ""
        : product.imageUrl || "",
    });

    if (isAuthenticated) {
      setToast(`${product.name} added to cart`);
      if (toastRef.current) clearTimeout(toastRef.current);
      toastRef.current = setTimeout(() => setToast(null), 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (toastRef.current) clearTimeout(toastRef.current);
    };
  }, []);

  if (loading) return <Loader />;
  if (!product)
    return (
      <p className="text-center mt-20 text-lg text-gray-400">
        Product not found
      </p>
    );

  const imageSrc = Array.isArray(product.imageUrl)
    ? product.imageUrl[0] || "https://via.placeholder.com/400"
    : product.imageUrl && product.imageUrl.startsWith("http")
      ? product.imageUrl
      : `${import.meta.env.VITE_API_BASE_URL}/${product.imageUrl ?? "placeholder.png"}`;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 relative">
          {!imgLoaded && (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-100 rounded-3xl">
              <div className="w-10 h-10 border-4 border-t-[#C45A36] border-gray-200 rounded-full animate-spin"></div>
            </div>
          )}
          <motion.img
            src={imageSrc}
            alt={product.name}
            className={`w-full rounded-3xl shadow-xl object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex-1 flex flex-col gap-4 sm:gap-5">
          <h1 className="text-3xl sm:text-4xl font-serif text-gray-900">{product.name}</h1>

          <div className="flex items-center gap-3 sm:gap-4 mt-2">
            <span className="text-2xl sm:text-3xl font-semibold text-[#C45A36]">
              ₹{product.price}
            </span>
            {product.oldPrice && (
              <span className="line-through text-gray-400 text-lg ml-2">
                ₹{product.oldPrice}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          )}

          <div className="mt-4 space-y-2 text-gray-700">
            {product.material && <p><span className="font-semibold">Material:</span> {product.material}</p>}
            {product.dimensions && <p><span className="font-semibold">Dimensions:</span> {product.dimensions}</p>}
            {product.weight && <p><span className="font-semibold">Weight:</span> {product.weight}</p>}
            {product.careInstructions && <p><span className="font-semibold">Care Instructions:</span> {product.careInstructions}</p>}
            {product.deliveryType && (
              <p><span className="font-semibold">Delivery:</span> {product.deliveryType}, {product.deliveryAvailability}, Estimated {product.deliveryEstimated}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-gray-500 text-sm sm:text-base mt-2">
            {product.tags && product.tags.map((tag, idx) => (
              <span key={idx} className="bg-gray-100 px-2 py-1 rounded">{tag}</span>
            ))}

            <span className={`px-2 py-1 rounded ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
            {product.warranty && <span className="bg-gray-100 px-2 py-1 rounded">{product.warranty}</span>}
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 items-center">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium shadow-lg ${product.inStock ? "bg-[#b46029] hover:bg-[#8c4a20] text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            >
              <ShoppingCart className="w-5 h-5 cursor-pointer" /> Add to Cart
            </button>
          </div>

          {product.customizationAvailable && product.customizationOptions && (
            <div className="bg-gray-50 p-3 rounded-md mt-6">
              <h3 className="font-semibold text-gray-800">Customization Options</h3>
              <p className="text-gray-600">{product.customizationOptions}</p>
            </div>
          )}
        </div>
      </div>

      <CustomerReview
        productId={product._id}
        setBackendRating={setBackendRating}
        setBackendReviewsCount={setBackendReviewsCount}
      />
      <FloatingCustomerReview productId={product._id} />

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
