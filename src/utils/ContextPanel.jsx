import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../base/BaseUrl";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [currentYear, setCurrentYear] = useState("");
  const [isPanelUp, setIsPanelUp] = useState(true);
  const [error, setError] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [previousNotifications, setPreviousNotifications] = useState([]);
  const [newNotifications, setNewNotifications] = useState([]); // For popups
  const navigate = useNavigate();
  const location = useLocation();
  const userType = localStorage.getItem("user_type_id");
  const branchId = localStorage.getItem("branch_id");

  // Store IDs of shown popups to avoid duplicates
  const [shownNotificationIds, setShownNotificationIds] = useState(new Set());

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) return;

      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-notification-booking`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      
      if (data && data.bookingNotification) {
        const newNotifs = data.bookingNotification;
        
        // Find newly added notifications by comparing IDs
        if (previousNotifications.length > 0) {
          const currentIds = new Set(previousNotifications.map(n => n.id));
          const newlyAdded = newNotifs.filter(n => !currentIds.has(n.id));
          
          if (newlyAdded.length > 0) {
            // Add to popup queue
            setNewNotifications(prev => [...newlyAdded, ...prev]);
            
            // Mark them as shown
            setShownNotificationIds(prev => {
              const newSet = new Set(prev);
              newlyAdded.forEach(n => newSet.add(n.id));
              return newSet;
            });
          }
        } else {
          // First load, no popups
          setNewNotifications([]);
        }
        
        // Update main notifications list
        setNotifications(newNotifs);
        
        // Update previous notifications for next comparison
        setPreviousNotifications(newNotifs);
        
        // Update unread count
        const newCount = newNotifs.length;
        setUnreadCount(newCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Get next popup notification
  const getNextPopup = () => {
    if (newNotifications.length === 0) return null;
    return newNotifications[0];
  };

  // Remove notification from popup queue after showing
  const removeFromPopupQueue = (id) => {
    setNewNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Clear all notifications from popup queue
  const clearAllPopups = () => {
    setNewNotifications([]);
  };

  // Mark all notifications as read
  const markNotificationsAsRead = () => {
    setUnreadCount(0);
  };

  // Add a new notification (for testing or real-time updates)
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setNewNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
    setNewNotifications([]);
    setUnreadCount(0);
    setPreviousNotifications([]);
    setShownNotificationIds(new Set());
  };

  // Check panel status
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
      console.error(error);
      setError(true);
    }
  };

  // Fetch year data
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

  // Auth and panel status check
  useEffect(() => {
    const token = localStorage.getItem("token");

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

  // Panel status check with interval
  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 6000000);
    return () => clearInterval(intervalId);
  }, []);

  // Notification polling with 30-second interval
  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Set up polling every 30 seconds
    const notificationInterval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => {
      clearInterval(notificationInterval);
    };
  }, []);

  return (
    <ContextPanel.Provider
      value={{
        isPanelUp,
        setIsPanelUp,
        userType,
        currentYear,
        notifications,
        unreadCount,
        newNotifications,
        getNextPopup,
        removeFromPopupQueue,
        clearAllPopups,
        fetchNotifications,
        markNotificationsAsRead,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;