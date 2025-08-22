import axios from "axios";
import CryptoJS from "crypto-js";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../base/BaseUrl";
import { toast } from "react-toastify";
const secretKey = import.meta.env.VITE_SECRET_KEY;
const validationKey = import.meta.env.VITE_SECRET_VALIDATION;

const ValidationWrapper = ({ children }) => {
  const [status, setStatus] = useState("pending");
  const navigate = useNavigate();
  const hasValidated = useRef(false);

  useEffect(() => {
    if (hasValidated.current) return;
    hasValidated.current = true;

    const validateEnvironment = async () => {
      try {
        const dotenvRes = await axios.get(`${BASE_URL}/api/panel-fetch-dotenv`);
        const dynamicValidationKey = dotenvRes.data?.hashKey;

        if (!dynamicValidationKey) {
          throw new Error("Validation key missing from response");
        }

        const computedHash = validationKey
          ? CryptoJS.MD5(validationKey).toString()
          : "";

        if (!secretKey || computedHash !== dynamicValidationKey) {
          throw new Error("Unauthorized environment file detected");
        }

        setStatus("valid");

        if (window.location.pathname == "/maintenance") {
          navigate("/");
        }
      } catch (error) {
        console.error("❌ Validation Error:", error.message);
        toast.warning("Environment validation failed. Redirecting...");
        setStatus("invalid");
        localStorage.clear();
        if (window.location.pathname !== "/maintenance") {
          navigate("/maintenance");
        }
      } finally {
        hasValidated.current = false;
      }
    };

    validateEnvironment();
  }, [navigate]);


  return children;
};

export default ValidationWrapper;
