import React, { useEffect, useState } from "react";
import {
  FaSearchLocation,
  FaCheckCircle,
  FaTools,
  FaTruck,
  FaSpinner,
  FaFlag,
  FaCalendarAlt,
} from "react-icons/fa";
import axios from "axios";
import {BASE_URL} from "../../../base/BaseUrl";
import { toast } from "react-toastify";

const JobCard = ({ title, value, icon: Icon, status }) => {
  // Helper function to determine status colors
  const getStatusColor = (status) => {
    const colors = {
      inspection: "text-blue-600 bg-blue-50",
      confirmed: "text-green-600 bg-green-50",
      vendor: "text-yellow-600 bg-yellow-50",
      onway: "text-orange-600 bg-orange-50",
      progress: "text-purple-600 bg-purple-50",
      completed: "text-red-600 bg-red-50",
    };
    return colors[status] || "text-gray-600 bg-gray-50";
  };

  const statusColor = getStatusColor(status);

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
      <div className="p-4">
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 rounded-full ${statusColor} flex items-center justify-center mb-3`}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
          <p className="text-sm font-medium text-gray-600">{title}</p>
        </div>
      </div>
      {/* <div className="px-4 py-2 bg-gray-50 text-center">
        <span className="text-xs font-medium text-gray-500">Today</span>
      </div> */}
    </div>
  );
};

const Jobs = () => {
  const dateyear = ["2024-25"];
  const [data, setData] = useState({
    booking_Inspection_today: 0,
    booking_Confirmed_today: 0,
    booking_Vendor_today: 0,
    booking_way_today: 0,
    booking_Progress_today: 0,
    booking_Completed_today: 0,
  });

  const jobCards = [
    {
      title: "Inspection",
      value: data.booking_Inspection_today,
      icon: FaSearchLocation,
      status: "inspection"
    },
    {
      title: "Confirmed",
      value: data.booking_Confirmed_today,
      icon: FaCheckCircle,
      status: "confirmed"
    },
    {
      title: "Vendor",
      value: data.booking_Vendor_today,
      icon: FaTools,
      status: "vendor"
    },
    {
      title: "On the Way",
      value: data.booking_way_today,
      icon: FaTruck,
      status: "onway"
    },
    {
      title: "In Progress",
      value: data.booking_Progress_today,
      icon: FaSpinner,
      status: "progress"
    },
    {
      title: "Completed",
      value: data.booking_Completed_today,
      icon: FaFlag,
      status: "completed"
    },
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
        toast.error("Failed to fetch jobs data");
      }
    };

    fetchData();
  }, []);

  return (
    <div >
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <FaCalendarAlt className="text-red-600 text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Today's Jobs </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {jobCards.map((card, index) => (
          <JobCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            status={card.status}
          />
        ))}
      </div>
    </div>
  );
};

export default Jobs;