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
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [newNotifications, setNewNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPopupNotification, setCurrentPopupNotification] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const userType = localStorage.getItem("user_type_id");

  // Fetch notifications
  const fetchNotifications = async (isInitial = false) => {
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
      const currentNotificationList = data?.bookingNotification || [];
      
      if (isInitial) {
        // FIRST TIME: Store only the count, not all notifications
        const currentCount = currentNotificationList.length;
        const latestId = currentNotificationList.length > 0 
          ? Math.max(...currentNotificationList.map(n => n.id))
          : 0;
        
        // Store only count and latest ID
        localStorage.setItem('notification_count', currentCount.toString());
        localStorage.setItem('last_notification_id', latestId.toString());
        
        // Set state
        setNotifications(currentNotificationList);
        setNotificationCount(currentCount);
        
        console.log("Initial setup: Count =", currentCount, "Latest ID =", latestId);
      } else {
        // SUBSEQUENT CALLS: Check for new notifications
        const storedCount = parseInt(localStorage.getItem('notification_count') || '0');
        const storedLastId = parseInt(localStorage.getItem('last_notification_id') || '0');
        const currentCount = currentNotificationList.length;
        
        console.log("Checking: Stored count =", storedCount, "Current count =", currentCount);
        console.log("Stored last ID =", storedLastId);
        
        if (currentCount > storedCount) {
          // New notifications arrived!
          const currentLatestId = Math.max(...currentNotificationList.map(n => n.id));
          
          // Find only NEW notifications (IDs greater than stored last ID)
          const newlyAdded = currentNotificationList.filter(
            notification => notification.id > storedLastId
          );
          
          console.log("New notifications found:", newlyAdded.length);
          
          if (newlyAdded.length > 0) {
            // Sort by ID descending (newest first)
            newlyAdded.sort((a, b) => b.id - a.id);
            
            // Add to queue
            setNewNotifications(prev => [...newlyAdded, ...prev]);
            
            // Update localStorage
            localStorage.setItem('notification_count', currentCount.toString());
            localStorage.setItem('last_notification_id', currentLatestId.toString());
            
            // Show popup for the first new notification
            if (!showPopup && newlyAdded.length > 0) {
              setCurrentPopupNotification(newlyAdded[0]);
              setShowPopup(true);
            }
          }
        } else if (currentCount < storedCount) {
          // Count decreased (maybe some notifications were deleted)
          // Just update the count
          localStorage.setItem('notification_count', currentCount.toString());
          
          // Also update last ID if needed
          if (currentNotificationList.length > 0) {
            const currentLatestId = Math.max(...currentNotificationList.map(n => n.id));
            localStorage.setItem('last_notification_id', currentLatestId.toString());
          }
        }
        
        // Always update state with current notifications
        setNotifications(currentNotificationList);
        setNotificationCount(currentCount);
      }
      
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Handle popup close
  const handleClosePopup = () => {
    if (newNotifications.length > 0) {
      // Remove the current shown notification from newNotifications
      const updatedNewNotifications = newNotifications.slice(1);
      setNewNotifications(updatedNewNotifications);
      
      if (updatedNewNotifications.length > 0) {
        // Show next notification
        setCurrentPopupNotification(updatedNewNotifications[0]);
      } else {
        // No more new notifications
        setShowPopup(false);
        setCurrentPopupNotification(null);
      }
    } else {
      setShowPopup(false);
      setCurrentPopupNotification(null);
    }
  };

  // Mark all as read - updates localStorage to current state
  const markAllAsRead = () => {
    const currentCount = notifications.length;
    const latestId = notifications.length > 0 
      ? Math.max(...notifications.map(n => n.id))
      : 0;
    
    localStorage.setItem('notification_count', currentCount.toString());
    localStorage.setItem('last_notification_id', latestId.toString());
    
    setNewNotifications([]);
    setShowPopup(false);
    setCurrentPopupNotification(null);
  };

  // Manual trigger for testing
  const triggerNotificationFetch = () => {
    fetchNotifications(false);
  };

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
    const panelIntervalId = setInterval(checkPanelStatus, 6000000);
    
    return () => clearInterval(panelIntervalId);
  }, []);

  // Fetch notifications logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Check if this is initial load (no stored count yet)
      const storedCount = localStorage.getItem('notification_count');
      
      const initializeAndFetch = async () => {
        if (!storedCount) {
          // First time: fetch and store count only
          await fetchNotifications(true);
          console.log("Initial fetch completed");
        } else {
          // Already initialized, just check for updates
          await fetchNotifications(false);
        }
      };
      
      // Initial fetch
      initializeAndFetch();
      
      // Set up interval for fetching notifications every 30 seconds
      const notificationIntervalId = setInterval(() => {
        if (token) {
          fetchNotifications(false);
        }
      }, 30000);
      
      return () => clearInterval(notificationIntervalId);
    }
  }, []);

  // Reset notification tracking on logout
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Only clear state, NOT localStorage (we want to keep the count/ID)
      setNotifications([]);
      setNotificationCount(0);
      setNewNotifications([]);
      setShowPopup(false);
      setCurrentPopupNotification(null);
    }
  }, [location.pathname]);

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
        triggerNotificationFetch // For testing
      }}
    >
      {children}
      
      {/* Notification Popup */}
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