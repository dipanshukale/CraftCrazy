// src/pages/ProductDetails.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Share2,
  Truck,
  Package,
  Shield,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link as LinkIcon,
  X as Close,
  MessageCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { getApiUrl } from "../config/api";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  rating: string;
  reviews: string;
  discount: string;
  highlight: string;
  category: string;
  tags: string;
  brand: string;
  seller: string;
  inStock: boolean;
  warranty: string;
  returnPolicy: string;
  imageUrl: string | null;
  occasion: string;
  material: string;
  dimensions: string;
  weight: string;
  careInstructions: string;
  maxOrderQuantity: string;
  deliveryType: string;
  deliveryAvailability: string;
  deliveryEstimated: string;
  customizationAvailable: boolean;
  customizationOptions: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(getApiUrl(`api/products/${id}`));
        console.log(res);
        setProduct(res.data?.product);
      } catch (error) {
        console.error("❌ Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ Close share popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Share Function
  const handleShareClick = (platform: string) => {
    if (!product) return;
    const shareUrl = window.location.href;
    const shareText = `Check out this ${product.name} on CraftiCrazy!`;

    const openShareWindow = (url: string) => {
      const newWindow = window.open(url, "_blank");
      if (!newWindow) alert("Please allow pop-ups to share this product.");
    };

    switch (platform) {
      case "whatsapp":
        openShareWindow(
          `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`
        );
        break;
      case "facebook":
        openShareWindow(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        );
        break;
      case "twitter":
        openShareWindow(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        );
        break;
      case "linkedin":
        openShareWindow(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`
        );
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(
          shareText
        )}&body=${encodeURIComponent(shareUrl)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        alert("🔗 Product link copied to clipboard!");
        break;
    }

    setShowShareMenu(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(getApiUrl(`api/products/${product?._id}`));
        alert("🗑️ Product deleted successfully!");
        navigate("/admin/products");
      } catch (error) {
        alert("❌ Error deleting product");
      }
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await axios.post(getApiUrl("api/cart"), {
        productId: product._id,
        quantity,
      });
      alert("🛒 Product added to cart successfully!");
    } catch (error) {
      alert("❌ Failed to add product to cart");
    }
  };

  if (!product)
    return (
      <div className="text-center py-20 text-gray-500">
        Loading product details...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#2a0a4b]">🪄 Product Details</h1>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Section */}
        <div className="flex flex-col items-center" ref={shareRef}>
          <img
            src={product.imageUrl || ""}
            alt={product.name}
            className="rounded-2xl w-full object-cover shadow-md"
          />
        </div>

        {/* Right Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

          {/* Ratings */}
          <div className="flex items-center gap-3 mb-4 text-sm">
            <div className="flex items-center text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(Number(product.rating)) ? "#FBBF24" : "none"}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
            <span className="text-green-600 font-medium">
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-purple-700">₹{product.price}</span>
            {product.discount && (
              <span className="text-sm text-red-500 font-semibold">
                {product.discount} OFF
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

          {/* Highlights */}
          <div className="mb-5">
            <h3 className="font-semibold text-gray-800 mb-2">Highlights:</h3>
            <p className="text-gray-600">{product.highlight}</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-700 mb-6">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Seller:</strong> {product.seller}</p>
            <p><strong>Material:</strong> {product.material}</p>
            <p><strong>Dimensions:</strong> {product.dimensions}</p>
            <p><strong>Weight:</strong> {product.weight}</p>
            <p><strong>Occasion:</strong> {product.occasion}</p>
            <p><strong>Warranty:</strong> {product.warranty}</p>
            <p><strong>Return Policy:</strong> {product.returnPolicy}</p>
          </div>

          {/* Add to Cart & Share */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              {showShareMenu && (
                <div className="absolute top-12 right-0 bg-white shadow-lg rounded-xl p-3 w-52 z-50 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">Share via</span>
                    <button onClick={() => setShowShareMenu(false)}>
                      <Close size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-gray-700 text-center">
                    {[
                      { name: "whatsapp", icon: MessageCircle, color: "#25D366" },
                      { name: "facebook", icon: Facebook, color: "#1877F2" },
                      { name: "twitter", icon: Twitter, color: "#1DA1F2" },
                      { name: "linkedin", icon: Linkedin, color: "#0A66C2" },
                      { name: "email", icon: Mail, color: "#C45A36" },
                      { name: "copy", icon: LinkIcon, color: "#555" },
                    ].map(({ name, icon: Icon, color }) => (
                      <button
                        key={name}
                        onClick={() => handleShareClick(name)}
                        className="hover:opacity-80"
                        title={name}
                      >
                        <Icon size={20} style={{ color }} />
                        <p className="text-[10px] mt-1 capitalize">{name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Icons Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md border">
              <Truck size={18} className="text-purple-600" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md border">
              <Package size={18} className="text-purple-600" />
              <span>Secure Packaging</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md border">
              <Shield size={18} className="text-purple-600" />
              <span>Warranty Included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
