import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../base/BaseUrl";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [currentYear, setCurrentYear] = useState("");
  const [isPanelUp, setIsPanelUp] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userType = localStorage.getItem("user_type_id");

  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/panel-check-status`);
      const datas = await response.data;
      setIsPanelUp(datas);
      if (datas?.success) {
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };
  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/fetch-year`, {});

        setCurrentYear(response?.data?.year.current_year);
      } catch (error) {
        console.error("Error fetching year data:", error);
      }
    };

    fetchYearData();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("Current Route:", location.pathname);

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (
      !token &&
      ![
        "/",
        "/forget-password",
        "/add-booking-outside",
        "/become-partner-outside",
        "/maintenance",
      ].includes(location.pathname)
    ) {
      navigate("/");
    }
  }, [error, navigate, isPanelUp, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 6000000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    console.log("Current Route:", location.pathname);
  }, [location.pathname]);

  return (
    <ContextPanel.Provider
      value={{ isPanelUp, setIsPanelUp, userType, currentYear }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
