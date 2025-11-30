import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Bell } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Static fallback data
  const staticData = [
    {
      _id: 1,
      name: "Emperio",
      message:
        "Project assigned by the manager — all files and folders were included",
      tag: "files",
      timeAgo: "12 mins ago",
      date: "24 Oct 2022",
      image: "https://i.pravatar.cc/100?img=1",
    },
    {
      _id: 2,
      name: "Dwayne Bero",
      message: "Admin and other team accepted your work request",
      tag: "request",
      timeAgo: "17 mins ago",
      date: "30 Sep 2022",
      image: "https://i.pravatar.cc/100?img=2",
    },
    {
      _id: 3,
      name: "Alister Chuk",
      message: "Temporary data will be deleted once dedicated time completed",
      tag: "deleted",
      timeAgo: "4 hrs ago",
      date: "11 Sep 2021",
      image: "https://i.pravatar.cc/100?img=3",
    },
    {
      _id: 4,
      name: "Melissa Blue",
      message: "Approved date for sanction of loan is verified",
      tag: "verified",
      timeAgo: "5 hrs ago",
      date: "18 Sep 2021",
      image: "https://i.pravatar.cc/100?img=4",
    },
    {
      _id: 5,
      name: "Zack Slayer",
      message:
        "Social network accounts are at risk — check your login details",
      tag: "login",
      timeAgo: "9 hrs ago",
      date: "15 Sep 2021",
      image: "",
    },
  ];

  // Fetch API data (if available)
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/notifications")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setNotifications(res.data);
        } else {
          setNotifications(staticData);
        }
      })
      .catch(() => setNotifications(staticData));
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f6fa] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Elegant Heading */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              🔔 Notifications
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Stay updated with all recent activities and alerts
            </p>
          </div>
          <Bell className="w-8 h-8 text-[#7E3AF2] bg-purple-100 p-2 rounded-full shadow-sm" />
        </div>

        <motion.hr
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
          className="border-t border-gray-200 mb-6"
        />

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-sm p-5 flex items-start justify-between border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{item.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.tag === "deleted"
                          ? "bg-red-100 text-red-600"
                          : item.tag === "verified"
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      {item.tag}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.timeAgo}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">
                {item.date}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
