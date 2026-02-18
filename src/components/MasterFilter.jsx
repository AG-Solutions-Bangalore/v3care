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
      label: "Referred By",
      path: "/refer-by",
      color: "from-blue-500 to-cyan-400",
      hoverColor: "hover:bg-blue-50",
      textColor: "text-blue-900",
    },
    ...(userType !== "5" && userType !== "7"
      ? [
          {
            label: "Branch",
            path: "/branch",
            color: "from-gray-500 to-gray-400",
            hoverColor: "hover:bg-gray-50",
            textColor: "text-gray-900",
          },
        ]
      : []),
    ...(userType == "8"
      ? [
          {
            label: "Super Service",
            path: "/super-service",
            color: "from-pink-500 to-orange-400",
            hoverColor: "hover:bg-pink-50",
            textColor: "text-pink-900",
          },
        ]
      : []),
    {
      label: "Service",
      path: "/service",
      color: "from-purple-500 to-indigo-400",
      hoverColor: "hover:bg-purple-50",
      textColor: "text-purple-900",
    },
    {
      label: "Sub Service",
      path: "/service-sub",
      color: "from-yellow-500 to-orange-300",
      hoverColor: "hover:bg-yellow-50",
      textColor: "text-yellow-900",
    },
    {
      label: "Service Price",
      path: "/service-price",
      color: "from-red-500 to-pink-400",
      hoverColor: "hover:bg-red-50",
      textColor: "text-red-900",
    },

    ...(userType == "8"
      ? [
          {
            label: "Service Control",
            path: "/service-control",
            color: "from-purple-500 to-purple-400",
            hoverColor: "hover:bg-purple-50",
            textColor: "text-purple-900",
          },
        ]
      : []),
    ...(userType == "8" || userType == "7"
      ? [
          {
            label: "Right Sidebar",
            path: "/right-sidebar-content",
            color: "from-lime-500 to-red-400",
            hoverColor: "hover:bg-red-50",
            textColor: "text-red-900",
          },
        ]
      : []),
    {
      label: "Field Team",
      path: "/field-team",
      color: "from-gray-500 to-gray-400",
      hoverColor: "hover:bg-gray-50",
      textColor: "text-gray-900",
    },
    {
      label: "Office",
      path: "/operation-team",
      color: "from-lime-500 to-green-400",
      hoverColor: "hover:bg-green-50",
      textColor: "text-green-900",
    },
    ...(userType == "6" || userType == "8"
      ? [
          {
            label: "Admin",
            path: "/backhand-team",
            color: "from-lime-500 to-green-400",
            hoverColor: "hover:bg-green-50",
            textColor: "text-green-900",
          },
        ]
      : []),
    ...(userType == "7"
      ? [
          {
            label: "Blogs",
            path: "/blogs",
            color: "from-blue-500 to-yellow-400",
            hoverColor: "hover:bg-yellow-50",
            textColor: "text-black-900",
          },
        ]
      : []),
    ...(userType == "6" || userType == "8"
      ? [
          {
            label: "Holiday List",
            path: "/holiday-list",
            color: "from-blue-500 to-cyan-400",
            hoverColor: "hover:bg-blue-50",
            textColor: "text-blue-900",
          },
          {
            label: "Clients",
            path: "/clients",
            color: "from-cyan-500 to-red-400",
            hoverColor: "hover:bg-cyan-50",
            textColor: "text-cyan-900",
          },
          {
            label: "Blogs",
            path: "/blogs",
            color: "from-blue-500 to-yellow-400",
            hoverColor: "hover:bg-yellow-50",
            textColor: "text-black-900",
          },
          {
            label: "Email Alert",
            path: "/email-alert",
            color: "from-blue-500 to-gray-400",
            hoverColor: "hover:bg-blue-50",
            textColor: "text-black-900",
          },
          {
            label: "Bank",
            path: "/bank",
            color: "from-pink-500 to-cyan-400",
            hoverColor: "hover:bg-green-50",
            textColor: "text-green-900",
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white rounded-t-lg shadow-lg p-1 mt-4 mx-auto  w-full">
      <div className="flex flex-wrap justify-center items-center gap-1  ">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`relative group px-4 py-2 m-1 rounded-lg transition-all duration-200 text-sm font-medium ${
              location.pathname === button.path
                ? `bg-gradient-to-r ${button.color}  text-white`
                : ` ${button.hoverColor} ${button.textColor} bg-gray-100`
            }`}
            onClick={() => handleButtonClick(`${button.path}?page=1`)}
          >
            {button.label}
            {location.pathname !== button.path && (
              <span
                className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r ${button.color}  group-hover:w-full transition-all duration-300`}
              ></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MasterFilter;
