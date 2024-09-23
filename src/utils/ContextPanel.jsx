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
        const allowedPaths = [
          "/home",
          "/profile",
          "/cancel",
          "/completed",
          "/confirmed",
          "/inspection",
          "/today",
          "/tomorrow",
          "/pending",
          "/vendor-job",
          "/add-booking",
          "/branch",
          "/branch-edit/:id",
          "/refer-by",
          "/refer-by-edit/:id",
          "/service",
          "/service-edit/:id",
          "/service-sub",
          "/service-sub-edit/:id",
          "/service-price",
          "/service-price-edit/:id",
          "/field-team",
          "/field-team-edit/:id",
          "/field-team-view/:id",
          "/operation-team",
          "/operation-team-view/:id",
          "/operation-team-edit/:id",
          "/backhand-team",
          "/backhand-team-view/:id",
          "/backhand-team-edit/:id",
          "/vendor-list",
          "/add-vendor",
          "/vendor-view",
          "/vendor-edit",
          "/vendor-pending-edit",
          "/add-vendor-service",
          "/idealfield-list",
          "/pending-payment",
          "/pending-payment-view",
          "/received-payment",
          "/commission-pending",
          "/commission-received",
          "/notification",
          "/booking-download",
          "/vendor-download",
          "/change-password",
        ];
        const isAllowedPath = allowedPaths.some((path) =>
          currentPath.startsWith(path)
        );
        if (isAllowedPath) {
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
