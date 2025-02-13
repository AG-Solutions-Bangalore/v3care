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
          "/all-booking",
          "/today",
          "/tomorrow",
          "/pending",
          "/rnr",
          "/vendor-job",
          "/add-booking",
          "/add-booking-user",
          "/view-booking",
          "/booking-assign",
          "/edit-booking-assign",
          "/assign-vendor",
          "/edit-booking-vendor",
          "/edit-booking",
          "/edit-booking-inspection",
          "/booking-reschedule",
          "/postpone-booking",
          "/branch",
          "/add-branch",
          "/branch-edit/:id",
          "/refer-by",
          "/add-referby",
          "/refer-by-edit/:id",
          "/service",
          "/add-service",
          "/add-service-sub",
          "/service-edit/:id",
          "/service-sub",
          "/service-sub-edit/:id",
          "/service-price",
          "/add-service-price",
          "/service-price-edit/:id",
          "/field-team",
          "/add-field-team",
          "/field-team-edit/:id",
          "/operation-team",
          "/add-operation-team",
          "/operation-team-edit/:id",
          "/backhand-team",
          "/add-backhand-team",
          "/backhand-team-view/:id",
          "/backhand-team-edit/:id",
          "/vendor-list",
          "/add-vendor",
          "/add-booking-vendor",
          "/vendor-view",
          "/vendor-edit",
          "/vendor-user-list",
          "/edit-vendor-user-list",
          "/add-vendor-user",
          "/vendor-pending-edit",
          "/add-vendor-service",
          "/idealfield-list",
          "/idealfield-vendor-list",
          "/pending-payment",
          "/pending-payment-view",
          "/received-payment",
          "/pending-received-view",
          "/commission-pending",
          "/commission-received",
          "/received-commission-view",
          "/pending-commission-view",
          "/notification",
          "/add-notification",
          "/booking-download",
          "/vendor-download",
          "/pending-download",
          "/received-download",
          "/change-password",
          "/report-quatation",
          "/report-tax-invoice",
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
          currentPath === "/forget-password" ||
          currentPath === "/add-booking-outside" ||
          currentPath === "/become-partner-outside"
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
    const intervalId = setInterval(checkPanelStatus, 6000000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ContextPanel.Provider value={{ isPanelUp, setIsPanelUp, userType }}>
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
