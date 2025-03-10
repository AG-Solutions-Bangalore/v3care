import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BaseUrl } from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [isPanelUp, setIsPanelUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/panel-check-status`);
      const datas = response.data;
      setIsPanelUp(datas);
      setError(!datas?.success);
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("Current Route:", location.pathname);

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (
      !token &&
      !["/", "/forget-password"].includes(location.pathname)
    ) {
      navigate("/");
    }
  }, [error, navigate, isPanelUp, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 300000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    console.log("Current Route:", location.pathname);
  }, [location.pathname]);

  return (
    <ContextPanel.Provider value={{ isPanelUp, setIsPanelUp, userType }}>
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
