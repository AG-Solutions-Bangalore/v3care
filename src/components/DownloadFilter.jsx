import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DownloadFilter = () => {
  //   const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  //   const handleButtonClick = (index, path) => {
  //     setActiveButton(index);
  //     console.log("naviaget", path);
  //     navigate(path);
  //   };

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const buttons = [
    {
      label: "Download Booking",
      path: "/booking-download",
      color: "from-pink-500 to-orange-400",
    },
    {
      label: "Download All Booking",
      path: "/allBooking-download",
      color: "from-pink-500 to-orange-400",
    },
    {
      label: "Download Vendor",
      path: "/vendor-download",
      color: "from-blue-500 to-cyan-400",
    },
    {
      label: "Download Received Payment",
      path: "/received-download",
      color: "from-red-500 to-purple-400",
    },
    {
      label: "Download Pending Payment",
      path: "/pending-download",
      color: "from-blue-500 to-green-400",
    },
  ];
  return (
    <div className="flex flex-wrap justify-between mt-6 gap-4">
      {buttons.map((button, index) => (
        <button
          key={index}
          className={`w-full md:w-auto flex-1 py-2 px-4 text-white rounded-lg transition-all ${
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

export default DownloadFilter;
