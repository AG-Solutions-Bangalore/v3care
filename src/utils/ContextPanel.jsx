import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../base/BaseUrl";
import NotificationPopup from "../components/NotificationComponent";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [currentYear, setCurrentYear] = useState("");
  const [isPanelUp, setIsPanelUp] = useState(true);
  const [error, setError] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [newNotifications, setNewNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopupNotification, setCurrentPopupNotification] =
    useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const userType = localStorage.getItem("user_type_id");

  // =====================================================================
  // FETCH NOTIFICATIONS
  // =====================================================================

  const fetchNotifications = async (isInitial = false, forceCheck = false) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-notification-booking`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const currentList = response.data?.bookingNotification || [];

      // --------------------------------------
      // INITIAL FETCH (NO POPUP)
      // --------------------------------------
      if (isInitial) {
        const count = currentList.length;
        const lastId =
          currentList.length > 0
            ? Math.max(...currentList.map((n) => n.id))
            : 0;

        localStorage.setItem("notification_count", count.toString());
        localStorage.setItem("last_notification_id", lastId.toString());
        localStorage.setItem("notification_initialized", "true");

        setNotifications(currentList);
        setNotificationCount(count);

        console.log("Initial notifications stored:", count);
        return currentList;
      }

      // --------------------------------------
      // NORMAL SUBSEQUENT CHECKS (WITH POPUP)
      // --------------------------------------
      const storedCount = parseInt(
        localStorage.getItem("notification_count") || "0"
      );
      const storedLastId = parseInt(
        localStorage.getItem("last_notification_id") || "0"
      );

      const currentCount = currentList.length;

      // Always update the notifications list in state
      setNotifications(currentList);
      setNotificationCount(currentCount);

      // Check for new notifications
      if (currentCount > storedCount) {
        // New notifications arrived
        const currentLatestId = Math.max(...currentList.map((n) => n.id));

        const newlyAdded = currentList.filter(
          (item) => item.id > storedLastId
        );

        if (newlyAdded.length > 0) {
          newlyAdded.sort((a, b) => b.id - a.id);

          setNewNotifications((prev) => [...newlyAdded, ...prev]);
          localStorage.setItem("notification_count", currentCount.toString());
          localStorage.setItem("last_notification_id", currentLatestId.toString());

          if (!showPopup) {
            setCurrentPopupNotification(newlyAdded[0]);
            setShowPopup(true);
          }
        } else {
          // Update stored values even if no new notifications
          localStorage.setItem("notification_count", currentCount.toString());
          localStorage.setItem("last_notification_id", currentLatestId.toString());
        }
      } else if (currentCount < storedCount) {
        // Notifications deleted
        localStorage.setItem("notification_count", currentCount.toString());
        if (currentList.length > 0) {
          const currentLatestId = Math.max(...currentList.map((n) => n.id));
          localStorage.setItem("last_notification_id", currentLatestId.toString());
        }
      } else if (forceCheck) {
        // Force update stored values
        if (currentList.length > 0) {
          const currentLatestId = Math.max(...currentList.map((n) => n.id));
          localStorage.setItem("last_notification_id", currentLatestId.toString());
        }
      }

      return currentList;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  };

  // =====================================================================
  // POPUP HANDLING
  // =====================================================================

  const handleClosePopup = () => {
    if (newNotifications.length > 0) {
      const updated = newNotifications.slice(1);
      setNewNotifications(updated);

      if (updated.length > 0) {
        setCurrentPopupNotification(updated[0]);
      } else {
        setShowPopup(false);
        setCurrentPopupNotification(null);
      }
    } else {
      setShowPopup(false);
      setCurrentPopupNotification(null);
    }
  };

  const markAllAsRead = () => {
    const count = notifications.length;
    const lastId =
      notifications.length > 0
        ? Math.max(...notifications.map((n) => n.id))
        : 0;

    localStorage.setItem("notification_count", count.toString());
    localStorage.setItem("last_notification_id", lastId.toString());

    setNewNotifications([]);
    setShowPopup(false);
    setCurrentPopupNotification(null);
  };

  // =====================================================================
  // NOTIFICATION INITIALIZATION
  // =====================================================================

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const initNotifications = async () => {
      const notificationInitialized = localStorage.getItem("notification_initialized") === "true";
      
      if (!notificationInitialized) {
        // FIRST TIME → Fetch and store initial notifications but NO POPUP
        console.log("First login - fetching initial notifications without popup");
        await fetchNotifications(true);
      } else {
        // Already initialized → do a normal check
        console.log("Already initialized - doing normal check");
        await fetchNotifications(false, true);
      }
    };

    initNotifications();

    // Set up polling interval
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const notificationInitialized = localStorage.getItem("notification_initialized") === "true";
        if (notificationInitialized) {
          console.log("Polling for new notifications...");
          fetchNotifications(false);
        }
      }
    }, 3000000);

    return () => clearInterval(interval);
  }, []);

  // =====================================================================
  // PANEL STATUS + AUTH PROTECTION
  // =====================================================================

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

  // =====================================================================
  // YEAR FETCH
  // =====================================================================

  useEffect(() => {
    const fetchYearData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/fetch-year`);
        setCurrentYear(response?.data?.year.current_year);
      } catch (err) {
        console.error("Error fetching year:", err);
      }
    };
    fetchYearData();
  }, []);

  return (
    <ContextPanel.Provider
      value={{
        isPanelUp,
        setIsPanelUp,
        userType,
        currentYear,
        notifications,
        notificationCount,
        newNotifications,
        fetchNotifications: () => fetchNotifications(false),
        markAllAsRead,
      }}
    >
      {children}

      {showPopup && currentPopupNotification && (
        <NotificationPopup
          notification={currentPopupNotification}
          onClose={handleClosePopup}
          totalNew={newNotifications.length}
          markAllAsRead={markAllAsRead}
        />
      )}
    </ContextPanel.Provider>
  );
};

export default AppProvider;