import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingFilter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = (path) => {
    navigate(path);
    localStorage.removeItem("page-no");
  };
  const buttons = [
    { label: "Today", path: "/today", color: "from-pink-500 to-orange-400" },

    {
      label: "Tomorrow",
      path: "/tomorrow",
      color: "from-blue-500 to-cyan-400",
    },
    { label: "All", path: "/all-booking", color: "from-teal-500 to-green-400" },

    {
      label: "RNR",
      path: "/rnr",
      color: "from-blue-500 to-cyan-400",
    },
    { label: "Pending", path: "/pending", color: "from-green-500 to-teal-400" },
    {
      label: "Inspection",
      path: "/inspection",
      color: "from-purple-500 to-indigo-400",
    },
    {
      label: "Confirmed",
      path: "/confirmed",
      color: "from-yellow-500 to-orange-300",
    },
    {
      label: "Vendor",
      path: "/vendor-job",
      color: "from-red-500 to-pink-400",
    },
    { label: "Cancel", path: "/cancel", color: "from-gray-500 to-gray-400" },
    {
      label: "Completed",
      path: "/completed",
      color: "from-lime-500 to-green-400",
    },
  ];

  return (
    <div className="flex flex-wrap justify-between mt-6 gap-4">
      {buttons.map((button, index) => (
        <button
          key={index}
          className={`w-full md:w-auto h-10 flex-1 py-2 px-4 text-white rounded-lg transition-all ${
            location.pathname === button.path
              ? `bg-gradient-to-r ${button.color} shadow-lg transform -translate-y-1`
              : "bg-blue-200"
          }`}
          onClick={() => handleButtonClick(button.path)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default BookingFilter;
