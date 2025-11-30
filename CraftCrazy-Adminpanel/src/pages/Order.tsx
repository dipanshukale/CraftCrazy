import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2"; 
import "sweetalert2/dist/sweetalert2.min.css";
import { getApiUrl } from "../config/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
}

interface Order {
  _id: string;
  totalAmount: number;
  createdAt: string;
  orderStatus: string;
  transactionStatus: string;
  items: OrderItem[];
  customer: CustomerInfo;
}

const Order: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(getApiUrl("api/order/getOrder"), {
        withCredentials: true,
      });

      const { data } = res.data;
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Deleting an order is permanent and cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      background: "#fff",
      buttonsStyling: true
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(getApiUrl(`api/order/${orderId}`), {
          withCredentials: true,
        });

        setOrders(prev => prev.filter(order => order._id !== orderId));

        Swal.fire({
          title: "Deleted!",
          text: "Order has been removed successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Failed",
          text: "Something went wrong.",
          icon: "error",
        });
      }
    }
  };


  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.patch(
        getApiUrl(`api/order/order/${orderId}`),
        { status: newStatus },
        { withCredentials: true }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: newStatus } : o
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const chartData = orders.map((order) => ({
    date: new Date(order.createdAt).toLocaleDateString(),
    totalAmount: order.totalAmount,
  }));

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-800">📦 Orders Dashboard</h2>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold text-lg mb-3">Revenue Overview</h3>
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalAmount" fill="#4CAF50" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
        <h3 className="font-semibold text-lg mb-4">All Orders</h3>

        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">{index + 1}</td>

                <td className="px-4 py-3 font-medium">
                  <p>{order.customer?.name || "NA"}</p>
                  <p className="text-blue-500 text-xs">
                    {order.customer?.phone || "—"}
                  </p>
                </td>

                <td className="px-4 py-3">{order._id}</td>
                <td className="px-4 py-3 text-green-600 font-bold">
                  ₹{order.totalAmount.toFixed(2)}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs ${order.orderStatus === "Processing"
                        ? "bg-yellow-500"
                        : order.orderStatus === "Shipped"
                          ? "bg-blue-500"
                          : "bg-green-600"
                      }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${order.transactionStatus === "Payment Succeed"
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-600"
                      }`}
                  >
                    {order.transactionStatus}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {order.items.map((item, i) => (
                    <p key={i}>
                      {item.name} x {item.quantity}
                    </p>
                  ))}
                </td>

                <td className="px-4 py-3 flex gap-2">
                  <button
                    className="px-3 py-1 cursor-pointer rounded bg-yellow-500 text-white text-xs"
                    onClick={() => updateOrderStatus(order._id, "Processing")}
                  >
                    Processing
                  </button>

                  <button
                    className="px-3 py-1 cursor-pointer rounded bg-blue-500 text-white text-xs"
                    onClick={() => updateOrderStatus(order._id, "Shipped")}
                  >
                    Shipped
                  </button>

                  <button
                    className="px-3 py-1 cursor-pointer rounded bg-green-600 text-white text-xs"
                    onClick={() => updateOrderStatus(order._id, "Delivered")}
                  >
                    Delivered
                  </button>

                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="px-3 py-1 cursor-pointer rounded text-red-600 text-xs flex items-center gap-1 border border-red-500 hover:bg-red-600 hover:text-white transition"
                    title="Delete order"
                  >
                    <FaTrashAlt className="text-sm" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
