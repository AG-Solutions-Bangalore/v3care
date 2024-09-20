import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// implement this
const MasterFilter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = (paths) => {
    navigate(paths[0]);
  };

  const buttons = [
    {
      label: "Branch",
      paths: ["/branch", "/branch-alt"],
      color: "from-pink-500 to-orange-400",
    },
    {
      label: "Refer By",
      paths: ["/refer-by"],
      color: "from-blue-500 to-cyan-400",
    },
    {
      label: "Service",
      paths: ["/service"],
      color: "from-purple-500 to-indigo-400",
    },
  ];

  return (
    <div className="flex flex-wrap justify-between mt-6 gap-4">
      {buttons.map((button, index) => (
        <button
          key={index}
          className={`w-full md:w-auto flex-1 py-2 px-4 text-white rounded-lg transition-all ${
            location.pathname === button.paths[0]
              ? `bg-gradient-to-r ${button.color} shadow-lg transform -translate-y-1`
              : "bg-blue-200"
          }`}
          onClick={() => handleButtonClick(button.paths)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default MasterFilter;
