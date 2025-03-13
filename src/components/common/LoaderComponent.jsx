import React from "react";
import { motion } from "framer-motion";
import logo from "../../../public/img/v3logo.png";

const LoaderComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[550px] bg-gray-100">
      <motion.div
        initial={{ scale: 0.8, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 1.2,
          ease: "easeInOut",
        }}
      >
        <img src={logo} className="w-42 h-40 drop-shadow-lg" alt="Loading" />
      </motion.div>
      <motion.p
        className="mt-4 text-gray-700 font-semibold text-lg"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
      >
        Please wait, loading...
      </motion.p>
    </div>
  );
};

export default LoaderComponent;
