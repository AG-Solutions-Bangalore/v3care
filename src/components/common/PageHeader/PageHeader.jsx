import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PageHeader = ({ title, onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md border border-gray-200 mt-2">
      {/* Back Arrow Button */}
      <button
        onClick={onBack || (() => navigate(-1))}
        className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md"
      >
        <FaArrowLeft className="text-lg" />
      </button>

      {/* Page Title */}
      <h3 className="text-lg md:text-xl font-semibold text-gray-800">
        {title}
      </h3>
    </div>
  );
};

export default PageHeader;
