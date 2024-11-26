import React from "react";

const ToggleSwitch = ({ isActive, onToggle }) => {


  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isActive}
          onChange={onToggle}
        />
      
      
        <div className={`block ${isActive ? "bg-green-500" : "bg-red-500"} w-8 h-5 rounded-full transition`}></div>
        <div
          className={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${
            isActive ? "translate-x-full" : ""
          }`}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;