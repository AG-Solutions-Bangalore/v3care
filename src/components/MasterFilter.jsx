import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ContextPanel } from "../utils/ContextPanel";

const MasterFilter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userType } = useContext(ContextPanel);
  const handleButtonClick = (path) => {
    navigate(path);
    localStorage.removeItem("page-no");
  };
  const buttons = [
    {
      label: "Refer By",
      path: "/refer-by",
      color: "from-blue-500 to-cyan-400",
    },
    ...(userType !== "5" && userType !== "7"
      ? [
          {
            label: "Branch",
            path: "/branch",
            color: "from-pink-500 to-orange-400",
          },
        ]
      : []),

    {
      label: "Service",
      path: "/service",
      color: "from-purple-500 to-indigo-400",
    },
    {
      label: "Service Sub",
      path: "/service-sub",
      color: "from-yellow-500 to-orange-300",
    },
    {
      label: "Service Price",
      path: "/service-price",
      color: "from-red-500 to-pink-400",
    },
    {
      label: "Field Team",
      path: "/field-team",
      color: "from-gray-500 to-gray-400",
    },

    {
      label: "Operation",
      path: "/operation-team",
      color: "from-lime-500 to-green-400",
    },
    ...(userType !== "5" && userType !== "7"
      ? [
          {
            label: "Backhand",
            path: "/backhand-team",
            color: "from-lime-500 to-green-400",
          },
        ]
      : []),
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

export default MasterFilter;
