import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, CalendarDays, MapPin, Phone, Mail, TrendingUp, UserPlus } from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

// Avatar generator
const randomAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true&size=128&font-size=0.45`;

const AllCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://node-test-1-34fs.onrender.com/api/order/customers");
        if (res.data?.data) {
          setCustomers(res.data.data);
        }
      } catch (err) {
        console.warn("Backend not connected  showing static data");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const thisMonth = new Date().getMonth();
  const newThisMonth = customers.filter((c) => new Date(c.createdAt).getMonth() === thisMonth).length;

  return (
    <motion.div className="p-6 text-gray-900" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2a0a4b]">👥 All Customers</h1>
        <p className="text-gray-500 mt-1">View and manage all customer profiles below.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-gradient-to-r from-[#845EF7] to-[#B197FC] p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Total Customers</h2>
            <p className="text-2xl font-bold mt-1">{customers.length}</p>
          </div>
          <Users size={38} className="opacity-70 text-white" />
        </div>

        <div className="bg-gradient-to-r from-[#5f3dc4] to-[#845EF7] p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">New This Month</h2>
            <p className="text-2xl font-bold mt-1">{newThisMonth}</p>
          </div>
          <UserPlus size={38} className="opacity-70 text-white" />
        </div>

        <div className="bg-gradient-to-r from-[#B197FC] to-[#9775fa] p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Top Region</h2>
            <p className="text-2xl font-bold mt-1">Maharashtra</p>
          </div>
          <MapPin size={38} className="opacity-70 text-white" />
        </div>

        <div className="bg-gradient-to-r from-[#9775fa] to-[#7048e8] p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Growth</h2>
            <p className="text-2xl font-bold mt-1">+12%</p>
          </div>
          <TrendingUp size={38} className="opacity-70 text-white" />
        </div>
      </div>

      {/* Customer Cards */}
      {loading ? (
        <p className="text-center py-10 text-black">Loading customers...</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {customers.map((cust, index) => (
            <motion.div
              key={cust._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-xl hover:border-[#845EF7]/60 transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <div className="flex flex-col items-center text-center">
                <img src={randomAvatar(cust.name)} alt={cust.name} className="w-20 h-20 rounded-full border-4 border-[#845EF7]/50 shadow-sm mb-4" />
                <h2 className="text-lg font-semibold text-gray-900">{cust.name}</h2>
                <p className="text-sm text-gray-600 mt-1 flex items-center justify-center gap-1">
                  <Mail size={14} /> {cust.email}
                </p>
                <div className="mt-4 space-y-2 text-sm text-gray-700 w-full text-left">
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-[#845EF7]" />
                    {cust.phone || "Not provided"}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#845EF7]" />
                    {cust.address || "Not provided"}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-[#845EF7]" />
                    Joined {new Date(cust.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AllCustomers;
