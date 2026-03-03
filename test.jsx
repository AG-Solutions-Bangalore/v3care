import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../base/BaseUrl";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [isPanelUp, setIsPanelUp] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/panel-check-status`);
      const datas = response.data;
      setIsPanelUp(datas);

      if (!datas?.success) setError(true);
      else setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  useEffect(() => {
    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else {
      const token = localStorage.getItem("token");
      if (
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
    }
  }, [error, navigate, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const id = setInterval(checkPanelStatus, 6000000);
    return () => clearInterval(id);
  }, []);

  return (
    <ContextPanel.Provider
      value={{
        isPanelUp,
        setIsPanelUp,
      }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
