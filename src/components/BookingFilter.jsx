import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingFilter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = (path) => {
    navigate(path);
    localStorage.removeItem("page-no");
  };

  const buttons = [
    {
      label: "Yesterday",
      path: "/yesterday",
      color: "from-pink-500 to-yellow-400",
      hoverColor: "hover:bg-pink-50",
      textColor: "text-pink-900",
    },
    {
      label: "Today",
      path: "/today",
      color: "from-pink-500 to-orange-400",
      hoverColor: "hover:bg-pink-50",
      textColor: "text-pink-900",
    },
    {
      label: "Tomorrow",
      path: "/tomorrow",
      color: "from-blue-500 to-cyan-400",
      hoverColor: "hover:bg-blue-50",
      textColor: "text-blue-900",
    },
    {
      label: "All",
      path: "/all-booking",
      color: "from-teal-500 to-green-400",
      hoverColor: "hover:bg-teal-50",
      textColor: "text-teal-900",
    },
    {
      label: "RNR",
      path: "/rnr",
      color: "from-blue-500 to-cyan-400",
      hoverColor: "hover:bg-blue-50",
      textColor: "text-blue-900",
    },
    {
      label: "Pending",
      path: "/pending",
      color: "from-green-500 to-teal-400",
      hoverColor: "hover:bg-green-50",
      textColor: "text-green-900",
    },
    {
      label: "Inspection",
      path: "/inspection",
      color: "from-purple-500 to-indigo-400",
      hoverColor: "hover:bg-purple-50",
      textColor: "text-purple-900",
    },
    {
      label: "Confirmed",
      path: "/confirmed",
      color: "from-yellow-500 to-orange-300",
      hoverColor: "hover:bg-yellow-50",
      textColor: "text-yellow-900",
    },
    {
      label: "Vendor",
      path: "/vendor-job",
      color: "from-red-500 to-pink-400",
      hoverColor: "hover:bg-red-50",
      textColor: "text-red-900",
    },
    {
      label: "Cancel",
      path: "/cancel",
      color: "from-gray-500 to-gray-400",
      hoverColor: "hover:bg-gray-50",
      textColor: "text-gray-900",
    },
    {
      label: "Completed",
      path: "/completed",
      color: "from-lime-500 to-green-400",
      hoverColor: "hover:bg-green-50",
      textColor: "text-green-900",
    },
    {
      label: "Website Booking",
      path: "/website",
      color: "from-pink-500 to-teal-400",
      hoverColor: "hover:bg-pink-50",
      textColor: "text-pink-900",
    },
  ];

  return (
    <div className="bg-white rounded-t-lg shadow-lg p-1 mt-4 mx-auto w-full">
      <div className="flex flex-wrap justify-center items-center gap-1">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`relative group px-4 py-2 m-1 rounded-lg transition-all duration-200 text-sm font-medium ${
              location.pathname === button.path
                ? `bg-gradient-to-r ${button.color} text-white`
                : `${button.hoverColor} ${button.textColor} bg-gray-100`
            }`}
            onClick={() => handleButtonClick(`${button.path}?page=1`)}
          >
            {button.label}
            {location.pathname !== button.path && (
              <span
                className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r ${button.color} group-hover:w-full transition-all duration-300`}
              ></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingFilter;
