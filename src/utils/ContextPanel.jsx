import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [isPanelUp, setIsPanelUp] = useState(true);

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (isPanelUp?.success) {
      if (token) {
        if (
          currentPath === "/home" ||
          currentPath === "/profile" ||
          currentPath === "/cancel" ||
          currentPath === "/completed" ||
          currentPath === "/confirmed" ||
          currentPath === "/inspection" ||
          currentPath === "/today" ||
          currentPath === "/tomorrow" ||
          currentPath === "/pending" ||
          currentPath === "/vendor-job" ||
          currentPath === "/add-booking" ||
          currentPath === "/branch" ||
          currentPath === "/refer-by" ||
          currentPath === "/service" ||
          currentPath === "/service-sub" ||
          currentPath === "/service-price" ||
          currentPath === "/field-team" ||
          currentPath === "/operation-team" ||
          currentPath === "/backhand-team" ||
          currentPath === "/vendor-list" ||
          currentPath === "/idealfield-list" ||
          currentPath === "/pending-payment" ||
          currentPath === "/received-payment" ||
          currentPath === "/commission-pending" ||
          currentPath === "/commission-received" ||
          currentPath === "/change-password"
        ) {
          navigate(currentPath);
        } else {
          navigate("/home");
        }
      } else {
        if (
          currentPath === "/" ||
          currentPath === "/register" ||
          currentPath === "/forget-password"
        ) {
          navigate(currentPath);
        } else {
          navigate("/"); // Redirect to login if no token
        }
      }
    }
  }, [error, navigate, isPanelUp, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 6000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ContextPanel.Provider value={{ isPanelUp, setIsPanelUp }}>
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
