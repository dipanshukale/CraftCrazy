// src/pages/AllProducts.tsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Link } from "react-router-dom";
import { Trash2, Plus, Star, Pencil } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  _id?: string;
  name: string;
  description?: string;
  price: string;
  rating?: string;
  reviews?: string;
  discount?: string;
  category: string;
  tags?: string;
  brand?: string;
  inStock: boolean;
  imageUrl: string;
  customizationAvailable: boolean;
}

const PAGE_SIZE = 12;
const fallbackImage = "/images/default-product.png";

const formatPrice = (p?: string) =>
  p ? `₹${p.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : "—";

const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [brandFilter, setBrandFilter] = useState<string>("All");
  const [stockFilter, setStockFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("https://node-test-1-34fs.onrender.com/api/products/newarrivals");
        const productsData = res.data?.allProudcts || [];
        setProducts(productsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

const handleEdit = async (product: Product) => {
  const { value: formValues } = await Swal.fire({
    title: `<h2 class="text-xl font-semibold text-gray-800">Edit Product</h2>`,
    html: `
      <style>
        .swal2-popup {
          width: 650px !important;
          padding: 20px !important;
          border-radius: 16px;
        }
        .swal-form-label {
          display: block;
          text-align: left;
          font-weight: 600;
          margin-bottom: 4px;
          color: #333;
        }
        .swal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
      </style>

      <div class="swal-grid">
        <div>
          <label class="swal-form-label">Product Name</label>
          <input id="name" class="swal2-input" value="${product.name}" />
        </div>
        <div>
          <label class="swal-form-label">Price</label>
          <input id="price" class="swal2-input" value="${product.price}" />
        </div>
        <div>
          <label class="swal-form-label">Stock Status</label>
          <select id="inStock" class="swal2-input">
            <option value="true" ${product.inStock ? "selected" : ""}>In Stock</option>
            <option value="false" ${!product.inStock ? "selected" : ""}>Out of Stock</option>
          </select>
        </div>
      </div>

      <label class="swal-form-label" style="margin-top: 12px;">Description</label>
      <textarea id="description" class="swal2-textarea" style="height: 80px;">${product.description || ""}</textarea>
    `,
    showCancelButton: true,
    confirmButtonText: "💾 Save Changes",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#6A4D3B",
    cancelButtonColor: "#888",
    focusConfirm: false,
    preConfirm: () => {
      const name = (document.getElementById("name") as HTMLInputElement).value.trim();
      const price = (document.getElementById("price") as HTMLInputElement).value;
      const description = (document.getElementById("description") as HTMLTextAreaElement).value.trim();
      const inStock = (document.getElementById("inStock") as HTMLSelectElement).value === "true";

      if (!name || !price) {
        Swal.showValidationMessage("Name and Price are required!");
        return false;
      }

      return { name, price, description, inStock };
    }
  });

  if (formValues) {
    try {
      await axios.patch(`https://craftcrazy-1.onrender.com//api/products/${product._id}`, formValues);

      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, ...formValues } : p))
      );

      Swal.fire({
        icon: "success",
        title: "Product Updated Successfully 🎉",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update product", "error");
    }
  }
};


  // Unique categories and brands for filters
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category || "Uncategorized"));
    return ["All", ...Array.from(set)];
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand || "Unknown"));
    return ["All", ...Array.from(set)];
  }, [products]);

  // Apply search, filters, and sorting
  const processed = useMemo(() => {
    let list = products.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.tags || "").toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") list = list.filter((p) => p.category === categoryFilter);
    if (brandFilter !== "All") list = list.filter((p) => p.brand === brandFilter);
    if (stockFilter === "InStock") list = list.filter((p) => p.inStock);
    if (stockFilter === "OutOfStock") list = list.filter((p) => !p.inStock);

    if (sortBy === "price-asc") list.sort((a, b) => parseFloat(a.price || "0") - parseFloat(b.price || "0"));
    else if (sortBy === "price-desc") list.sort((a, b) => parseFloat(b.price || "0") - parseFloat(a.price || "0"));
    else if (sortBy === "rating") list.sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));

    return list;
  }, [products, query, categoryFilter, brandFilter, stockFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const visible = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Delete product with SweetAlert2
  const handleDelete = async (id?: string) => {
    if (!id) return;

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Deleting this product is permanent and cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      background: "#fff",
      buttonsStyling: true,
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`https://node-test-1-34fs.onrender.com/api/products/${id}`, { withCredentials: true });
        setProducts((prev) => prev.filter((p) => p._id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Product has been removed successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Failed",
          text: "Something went wrong while deleting.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#2a0a4b] mb-2">🛍️ Product List</h1>
          <p className="text-sm text-gray-500">Manage all store products — edit, delete or view details.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            to="/addproducts"
            className="inline-flex items-center gap-2 bg-[#2a0a4b] hover:bg-[#1f0536] text-white px-4 py-2 rounded-lg text-sm"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Filters + sort */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100 flex flex-wrap gap-3 items-center">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="text-sm border rounded-md px-3 py-2 bg-white">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="text-sm border rounded-md px-3 py-2 bg-white">
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>

        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="text-sm border rounded-md px-3 py-2 bg-white">
          <option value="All">All stock</option>
          <option value="InStock">In stock</option>
          <option value="OutOfStock">Out of stock</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border rounded-md px-3 py-2 bg-white ml-auto">
          <option value="newest">Newest</option>
          <option value="price-asc">Price — Low to high</option>
          <option value="price-desc">Price — High to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="bg-white rounded-xl p-8 text-center">Loading products…</div>
      ) : error ? (
        <div className="bg-white rounded-xl p-8 text-center text-red-500">{error}</div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">No products found.</div>
      ) : (
        <>
          
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visible.map((p, i) => (
              <Link to={`/products/${p._id}`}>
              <motion.div
                key={p._id ?? i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={p.imageUrl || fallbackImage}
                    alt={p.name}
                    className="w-full h-44 object-cover"
                    onError={(e) => ((e.target as HTMLImageElement).src = fallbackImage)}
                  />
                  {p.discount && <span className="absolute left-3 top-3 bg-red-500 text-white text-xs px-2 py-1 rounded">{p.discount} OFF</span>}
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-semibold text-gray-800 truncate">{p.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{p.description || ""}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-semibold text-[#C45A36]">{formatPrice(p.price)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-yellow-500 gap-1">
                      <Star size={14} /> {p.rating || "N/A"} ({p.reviews || 0})
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        title="Edit product"
                      >
                        <Pencil size={16} />
                      </button>


                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              </Link>
            ))}
          </motion.div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{(page - 1) * PAGE_SIZE + 1}</span> -{" "}
              <span className="font-medium">{Math.min(page * PAGE_SIZE, processed.length)}</span> of{" "}
              <span className="font-medium">{processed.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded-md border disabled:opacity-50">
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded-md ${page === pageNum ? "bg-[#2a0a4b] text-white" : "border"}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded-md border disabled:opacity-50">
                &gt;
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AllProducts;
