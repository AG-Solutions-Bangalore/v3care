import React, { useEffect, useState } from "react";
import { FaHourglassHalf, FaCheckCircle, FaCalendarDay, FaCalendarWeek, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import {BASE_URL} from "../../../base/BaseUrl";
import { toast } from "react-toastify";

const DashboardCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white rounded-lg overflow-hidden">
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-50">
          <Icon className="w-6 h-6 text-red-600" />
        </div>
      </div>
    </div>
    {/* <div className="px-6 py-3 bg-gray-50">
      <div className="flex items-center text-sm">
        <span className="text-gray-600">Updated just now</span>
      </div>
    </div> */}
  </div>
);

const Cards = () => {
  const dateyear = ["2024-25"];
  const [data, setData] = useState({
    booking_pending_count: 0,
    booking_Confirmed_count: 0,
    booking_current_count: 0,
    booking_tomm_count: 0
  });

  const cardConfig = [
    {
      title: "Pending Bookings",
      value: data.booking_pending_count,
      icon: FaHourglassHalf,
    },
    {
      title: "Confirmed Bookings",
      value: data.booking_Confirmed_count,
      icon: FaCheckCircle,
    },
    {
      title: "Today's Bookings",
      value: data.booking_current_count,
      icon: FaCalendarDay,
    },
    {
      title: "Tomorrow's Bookings",
      value: data.booking_tomm_count,
      icon: FaCalendarWeek,
    }
  ];

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-dashboard-data/${dateyear}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
        toast.error("Failed to fetch dashboard data");
      }
    };

    fetchData();
  }, []);

  return (
    <div >
     
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <FaCalendarAlt className="text-red-600 text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardConfig.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default Cards;