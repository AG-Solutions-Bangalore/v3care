// import React from "react";
// import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaCheck } from "react-icons/fa";
// import { FiLoader } from "react-icons/fi";

// const ButtonConfigColor = ({ type, label, onClick, disabled, loading }) => {
//   // Define button styles based on the type
//   const getButtonStyles = () => {
//     switch (type) {
//       case "submit":
//         return "bg-blue-600 hover:bg-blue-700 text-white";
//       case "back":
//         return "bg-gray-500 hover:bg-gray-600 text-white";
//       case "create":
//         return "bg-green-600 hover:bg-green-700 text-white";
//       case "edit":
//         return "bg-yellow-500 hover:bg-yellow-600 text-white";
//       case "delete":
//         return "bg-red-600 hover:bg-red-700 text-white";
//       default:
//         return "bg-gray-400 hover:bg-gray-500 text-white";
//     }
//   };

//   // Define icons based on the type
//   const getIcon = () => {
//     if (loading) return <FiLoader className="animate-spin text-lg" />; // Loader icon
//     switch (type) {
//       case "submit":
//         return <FaCheck />;
//       case "back":
//         return <FaArrowLeft />;
//       case "create":
//         return <FaPlus />;
//       case "edit":
//         return <FaEdit />;
//       case "delete":
//         return <FaTrash />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <button
//       className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${getButtonStyles()} ${
//         disabled || loading ? "opacity-50 cursor-not-allowed" : ""
//       }`}
//       onClick={onClick}
//       disabled={disabled || loading}
//     >
//       {getIcon()}
//       <span>{label}</span>
//     </button>
//   );
// };

// export default ButtonConfigColor;
import React from "react";
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaCheck } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

const ButtonConfigColor = ({
  type,
  label,
  onClick,
  disabled,
  loading,
  className,
}) => {
  // Define button styles based on the type
  const getButtonStyles = () => {
    switch (type) {
      case "submit":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "back":
        return "bg-gray-500 hover:bg-gray-600 text-white";
      case "create":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "edit":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "delete":
        return "bg-red-600 hover:bg-red-700 text-white";
      default:
        return "bg-gray-400 hover:bg-gray-500 text-white";
    }
  };

  // Define icons based on the type
  const getIcon = () => {
    if (loading) return <FiLoader className="animate-spin text-lg" />; // Loader icon
    switch (type) {
      case "submit":
        return <FaCheck />;
      case "back":
        return <FaArrowLeft />;
      case "create":
        return <FaPlus />;
      case "edit":
        return <FaEdit />;
      case "delete":
        return <FaTrash />;
      default:
        return null;
    }
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg transition-all duration-300 ${getButtonStyles()} ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${type !== "create" ? "flex  gap-2" : ""} ${
        className || ""
      }`} // Supports extra CSS
      onClick={onClick}
      disabled={disabled || loading}
    >
      {getIcon()}
      <span>{label}</span>
    </button>
  );
};

export default ButtonConfigColor;
