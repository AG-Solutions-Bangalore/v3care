// import React from "react";
// import { FaArrowLeft } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const PageHeader = ({ title, onBack }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg shadow-md border border-blue-200 mt-2">
//       {/* Back Arrow Button */}
//       <button
//         onClick={onBack || (() => navigate(-1))}
//         className="flex items-center justify-center w-10 h-10 bg-white text-blue-600 rounded-full shadow-md border border-blue-300 transition-all hover:bg-blue-600 hover:text-white"
//       >
//         <FaArrowLeft className="text-lg" />
//       </button>

//       {/* Page Title */}
//       <h3 className="text-lg md:text-xl font-semibold text-gray-900">
//         {title}
//       </h3>
//     </div>
//   );
// };

// export default PageHeader;
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PageHeader = ({ title, label2, onBack }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center w-full bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg shadow-md border border-blue-200 mt-2 
      justify-between"
    >
      {/* Left Section: Back Button & Title */}
      <div className="flex items-center space-x-4">
        {/* Back Arrow Button */}
        <button
          onClick={onBack || (() => navigate(-1))}
          className="flex items-center justify-center w-10 h-10 bg-white text-blue-600 rounded-full shadow-md border border-blue-300 transition-all hover:bg-blue-600 hover:text-white"
        >
          <FaArrowLeft className="text-lg" />
        </button>

        {/* Page Title */}
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          {title}
        </h3>
      </div>

      {/* Right Section: Optional Label2 */}
      {label2 && (
        <div className="text-lg md:text-xl font-semibold text-gray-700">
          {label2}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
