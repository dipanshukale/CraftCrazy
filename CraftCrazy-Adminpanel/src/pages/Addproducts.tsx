import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProductForm {
  name: string;
  description?: string;
  price: string;
  rating?: string;
  reviews?: string;
  discount?: string;
  highlight?: string;
  category: string;
  tags?: string;
  brand?: string;
  seller?: string;
  inStock: boolean;
  warranty?: string;
  returnPolicy?: string;
  occasion?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  careInstructions?: string;
  maxOrderQuantity?: string;
  deliveryType?: string;
  deliveryAvailability?: string;
  deliveryEstimated?: string;
  customizationAvailable: boolean;
  customizationOptions?: string;
  image: File | null;
}

const AddProducts = () => {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    rating: "",
    reviews: "",
    discount: "",
    highlight: "",
    category: "",
    tags: "",
    brand: "",
    seller: "",
    inStock: true,
    warranty: "",
    returnPolicy: "",
    occasion: "",
    material: "",
    dimensions: "",
    weight: "",
    careInstructions: "",
    maxOrderQuantity: "",
    deliveryType: "",
    deliveryAvailability: "",
    deliveryEstimated: "",
    customizationAvailable: false,
    customizationOptions: "",
    image: null,
  });

  const categoriesMap: Record<string, string> = {
    "keychain": "keychain",
    "tote bag": "totebag",
    "wallet": "wallet",
    "accessories": "accessories",
    "birthday hamper": "birthdayhamper",
    "Bracelets":"bracelets",
    "corporate": "corporate",
    "wedding": "wedding",
    "christmas": "christmas",
    "diwali": "diwali",
    "holi": "holi",
    "rakhi": "rakhi",
    "glass frame": "glassframe",
    "resin photo frame": "resinframe",
    "wooden frame": "woodenframe",
    "resin clock": "resinclock",
    "resin coaster": "resincoaster",
    "resin jewelry": "resinjewelry",
    "resin keychain": "resinkeychain",
    "resin name plate": "resinnameplate",
    "resin puja thale": "resinpujathale",
    "engagement tray": "engagementtray",
    "haldi platter": "haldiplatter",
    "varmala": "varmala",
  };

  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // image preview
  useEffect(() => {
    if (!form.image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(form.image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  // auto hide success
  useEffect(() => {
    if (successMsg) {
      setTimeout(() => setSuccessMsg(false), 2500);
    }
  }, [successMsg]);

  // Form handler
  const handleChange = (e: any) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: e.target.checked }));
    }
    else if (type === "file") {
      const file = e.target.files?.[0];
      setForm(prev => ({ ...prev, image: file || null }));
    }
    else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Submit Product
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (submitting) return;

    if (!form.image) {
      toast.error("Product image is required");
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "image") {
          if (value) fd.append("image", value);
        } else {
          fd.append(key, value as string);
        }
      });

      const res = await axios.post(
        "https://node-test-1-34fs.onrender.com/api/products/add",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 201) {
        toast.success("Product created successfully!");
        setSuccessMsg(true);

        setForm({
          name: "",
          description: "",
          price: "",
          rating: "",
          reviews: "",
          discount: "",
          highlight: "",
          category: "",
          tags: "",
          brand: "",
          seller: "",
          inStock: true,
          warranty: "",
          returnPolicy: "",
          occasion: "",
          material: "",
          dimensions: "",
          weight: "",
          careInstructions: "",
          maxOrderQuantity: "",
          deliveryType: "",
          deliveryAvailability: "",
          deliveryEstimated: "",
          customizationAvailable: false,
          customizationOptions: "",
          image: null,
        });
        setPreview(null);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to create product!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#FFFDF9] p-6 sm:p-10">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white p-6 sm:p-10 shadow-2xl rounded-3xl border border-gray-200"
      >
        <h1 className="text-3xl sm:text-4xl font-serif text-[#8b5e34] font-bold text-center mb-6">
          Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div className="col-span-2">
            <label className="block mb-1 font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
              className="p-3 rounded-xl border border-gray-300 w-full text-sm focus:ring-2 focus:ring-[#c9a26d]"
            >
              <option value="">Select Category</option>
              {Object.entries(categoriesMap).map(([label, value]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* TEXT FIELDS */}
          {[
            "name", "description", "price", "rating", "reviews", "discount", "highlight",
            "tags", "brand", "seller", "warranty", "returnPolicy",
            "occasion", "material", "dimensions", "weight", "careInstructions",
            "maxOrderQuantity", "deliveryType", "deliveryAvailability", "deliveryEstimated",
            "customizationOptions"
          ].map((field) => (
            <input
              key={field}
              name={field}
              type="text"
              value={form[field as keyof ProductForm] as string}
              onChange={handleChange}
              placeholder={field.replace(/([A-Z])/g, " $1").toUpperCase()}
              className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#c9a26d] text-sm"
            />
          ))}

          {/* STOCK */}
          <label className="flex items-center gap-3 col-span-1">
            <input
              type="checkbox"
              name="inStock"
              checked={form.inStock}
              onChange={handleChange}
            />
            In Stock
          </label>

          {/* CUSTOMIZATION AVAILABLE */}
          <label className="flex items-center gap-3 col-span-1">
            <input
              type="checkbox"
              name="customizationAvailable"
              checked={form.customizationAvailable}
              onChange={handleChange}
            />
            Customization Available
          </label>

          {/* IMAGE */}
          <div className="col-span-2">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="p-3 rounded-xl border border-gray-300 w-full"
            />

            {preview && (
              <div className="mt-3 w-32 h-32 rounded-xl overflow-hidden shadow">
                <img src={preview} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            disabled={submitting}
            className={`col-span-2 py-3 mt-4 bg-gradient-to-r from-[#c9a26d] to-[#8b5e34] text-white font-medium rounded-xl ${submitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
          >
            {submitting ? "Uploading..." : "Add Product"}
          </motion.button>
        </form>

        {/* SUCCESS MESSAGE */}
        <AnimatePresence>
          {successMsg && (
            <motion.p
              className="text-green-600 text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              ✅ Product added successfully!
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default AddProducts;
