import React from "react";
import { motion } from "framer-motion";
import logo from "../../../public/img/v3logo.png";
const LoaderComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[550px] bg-gray-100">
      <motion.div
        initial={{ x: -20 }}
        animate={{ x: 20 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.6,
          ease: "easeInOut",
        }}
      >
        {/* <span className="text-6xl">🧹</span> */}
        <img src={logo} className="w-42 h-40"/>
      </motion.div>
      <p className="mt-4 text-gray-600 font-medium text-lg">
        Loading in progress...
      </p>
    </div>
  );
};

export default LoaderComponent;
