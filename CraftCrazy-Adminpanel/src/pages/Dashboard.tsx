import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  DollarSign,
  ShoppingBag,
  Activity,
  Clock,
  CalendarDays,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { socket } from "../../src/socket";
import { getApiUrl } from "../config/api";

type Product = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: string;
};

interface Customer {
  _id: string;
  name: string;
  email?: string;
  contact?: string;
  address?: string;
}

type Order = {
  _id: string;
  customer: { name: string };
  items: Product[];
  totalAmount: number;
  orderStatus: string;
  transactionStatus: string;
  createdAt?: string; // <- made optional to fix TS error
};

type KPIs = { customers: number; revenue: number; sales: number };

const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KPIs>({ customers: 0, revenue: 0, sales: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [shippedOrders, setShippedOrders] = useState<Order[]>([]);
  const [successOrders, setSuccessOrders] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [processingOrders, setProcessingOrders] = useState<Order[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [nextReport, setNextReport] = useState("");

  const fetchDashboardData = async () => {
    try {
      const [
        productRes,
        customerRes,
        orderRes,
        pendingRes,
        successRes,
        activeRes,
        processingRes,
      ] = await Promise.all([
        axios.get(getApiUrl("api/order/products")),
        axios.get(getApiUrl("api/order/customers")),
        axios.get(getApiUrl("api/order/getOrder")),
        axios.get(getApiUrl("api/order/status/Shipped")),
        axios.get(getApiUrl("api/order/status/Delivered")),
        axios.get(getApiUrl("api/order/active")),
        axios.get(getApiUrl("api/order/status/Processing")),
      ]);

      const allProducts = productRes.data.data || [];
      const allCustomers = customerRes.data.data || [];
      const allOrders = orderRes.data.data || [];
      const shipped = pendingRes.data.data || [];
      const success = successRes.data.data || [];
      const active = activeRes.data.data || [];
      const processing = processingRes.data.data || [];

      setProducts(allProducts);
      setCustomers(allCustomers);
      setOrders(allOrders);
      setShippedOrders(shipped);
      setSuccessOrders(success);
      setActiveOrders(active);
      setProcessingOrders(processing);

      const totalRevenue = allOrders.reduce((sum: number, o: Order) => sum + (o.totalAmount || 0), 0);
      const totalSales = allProducts.reduce((sum: number, p: Product) => sum + (p.quantity || 0), 0);

      setKpis({
        customers: allCustomers.length,
        revenue: totalRevenue,
        sales: totalSales,
      });

      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weekly = days.map((day) => ({
        name: day,
        sales: 0,
        revenue: 0,
      }));

      // FIXED BLOCK
      allOrders.forEach((order: Order) => {
        if (!order.createdAt) return;
        const dayIndex = new Date(order.createdAt).getDay();
        weekly[dayIndex].sales += 1;
        weekly[dayIndex].revenue += order.totalAmount || 0;
      });

      setLineData(weekly);

      const now = new Date();
      setLastUpdated(`${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")} updated`);

      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      setNextReport(tomorrow.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchDashboardData();

    socket.on("order-updated", () => {
      console.log("⚡ Order Updated → Refresh Dashboard");
      fetchDashboardData();
    });

    socket.on("trend:update", () => {
      console.log("📊 Sales Trend Updated → Refresh Chart");
      fetchDashboardData();
    });

    return () => {
      socket.off("order-updated");
      socket.off("trend:update");
    };
  }, []);

  const colorClasses: Record<string, string> = {
    green: "bg-green-50 border-green-100",
    yellow: "bg-yellow-50 border-yellow-100",
    blue: "bg-blue-50 border-blue-100",
    purple: "bg-purple-50 border-purple-100",
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between mb-6"
      >
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Welcome back!</h2>
          <p className="text-sm text-gray-500 mt-1">
            Here’s what's happening with CraftiCrazy today.
          </p>
          <div className="mt-4 flex items-center text-xs text-gray-600 space-x-3">
            <div className="flex items-center gap-2">
              <Clock size={14} /> <span>{lastUpdated}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays size={14} /> <span>Next report: {nextReport}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <p className="text-sm text-gray-500">Revenue (this month)</p>
            <p className="text-xl font-semibold text-gray-800">
              ₹{kpis.revenue.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow">
            <Activity size={28} />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Customers", value: kpis.customers, icon: <Users />, link: "/AllCustomer" },
          { label: "Total Revenue", value: `₹${kpis.revenue.toLocaleString("en-IN")}`, icon: <DollarSign />, link: "/dashboard" },
          { label: "Total Sales", value: kpis.sales, icon: <ShoppingBag />, link: "/orders" },
          { label: "Active Orders", value: activeOrders.length, icon: <Activity />, link: "/orders" },
        ].map((kpi, idx) => (
          <Link key={idx} to={kpi.link}>
            <motion.div
              className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between h-[120px] border border-gray-100 hover:bg-gray-50 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  {kpi.label} <span className="ml-1 text-indigo-600 font-bold text-sm">→</span>
                </p>
                <p className="text-xl font-semibold text-gray-800">{kpi.value}</p>
              </div>
              <div className="p-3 rounded-md bg-indigo-50 text-indigo-600">{kpi.icon}</div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales & Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#4ade80" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="#60a5fa" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Ordered Products
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm text-gray-600">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Qty</th>
                    <th className="py-3 px-4 text-left">Customization</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.flatMap((order, orderIndex) =>
                    order.items.map((item, itemIndex) => {
                      const hasCustomization = item.customization && item.customization.trim() !== "";

                      return (
                        <tr key={`${orderIndex}-${itemIndex}`} className="hover:bg-gray-50">
                          <td className="py-3 px-4">{orderIndex + 1}</td>
                          <td className="py-3 px-4 font-medium">{item.name}</td>
                          <td className="py-3 px-4">₹{item.price}</td>
                          <td className="py-3 px-4">{item.quantity}</td>

                          {/* 🔥 If customization exists, show message professionally */}
                          <td className="py-3 px-4">
                            {hasCustomization ? (
                              <div className="flex flex-col text-sm text-gray-600">
                                <span className="font-semibold text-indigo-600">
                                  "{item.customization}"
                                </span>
                                <span className="text-xs text-gray-500">
                                  — Requested by: <strong>{order.customer?.name || "Unknown"}</strong>
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>

              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
              <p className="text-sm text-gray-500">{orders.length} total orders</p>
              <div className="flex items-center mt-1 text-green-600 text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>↑ based on real-time orders</span>
              </div>
            </div>

            {[
              {
                icon: <CheckCircle className="text-green-600 w-6 h-6" />,
                color: "green",
                label: "Delivered Orders",
                count: successOrders.length,
              },
              {
                icon: <Clock className="text-yellow-600 w-6 h-6" />,
                color: "yellow",
                label: "Shipped Orders",
                count: shippedOrders.length,
              },
              {
                icon: <Activity className="text-blue-600 w-6 h-6" />,
                color: "blue",
                label: "Active Orders",
                count: activeOrders.length,
              },
              {
                icon: <Clock className="text-purple-600 w-6 h-6" />,
                color: "purple",
                label: "Processing Orders",
                count: processingOrders.length,
              },
            ].map((d, i) => (
              <div
                key={i}
                className={`flex items-center justify-between border-l-4 p-3 rounded-lg shadow-sm ${colorClasses[d.color]}`}
              >
                <div className="flex items-center space-x-3">
                  {d.icon}
                  <div>
                    <p className="font-semibold text-gray-800">{d.label}</p>
                    <p className="text-sm text-gray-500">{d.count} orders</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customers</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {customers.map((cust, i) => (
                <li key={cust._id || i} className="border-b pb-2">
                  {i + 1}. {cust.name || "Unknown User"}
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>
       <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
    </motion.div>
    </div>
  );
};

export default Dashboard;
