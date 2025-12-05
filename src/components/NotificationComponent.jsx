import React, { useContext, useState, useEffect } from 'react';
import { ContextPanel } from '../utils/ContextPanel';
import { XMarkIcon } from "@heroicons/react/24/outline";

const NotificationPopup = () => {
  const { 
    newNotifications, 
    getNextPopup, 
    removeFromPopupQueue,
    clearAllPopups 
  } = useContext(ContextPanel);
  
  const [currentPopup, setCurrentPopup] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (newNotifications.length > 0 && !currentPopup) {
      // Get next notification to show
      const nextPopup = getNextPopup();
      if (nextPopup) {
        setCurrentPopup(nextPopup);
        setIsVisible(true);
        
        // Auto hide after 5 seconds
        const timer = setTimeout(() => {
          handleClose();
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [newNotifications, currentPopup]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before removing
    setTimeout(() => {
      if (currentPopup) {
        removeFromPopupQueue(currentPopup.id);
        setCurrentPopup(null);
      }
    }, 300);
  };

  const handleClearAll = () => {
    clearAllPopups();
    setIsVisible(false);
    setCurrentPopup(null);
  };

  if (!currentPopup || !isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96 animate-slide-in">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <h4 className="font-bold text-gray-800">
                  {currentPopup.notification_booking_heading}
                </h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {currentPopup.branch_name}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {currentPopup.notification_booking_message}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Order ID: {currentPopup.order_id}</span>
                <span>Just now</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all ({newNotifications.length})
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  // Navigate to order details
                  // navigate(`/orders/${currentPopup.order_id}`);
                }}
                className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                View Order
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar for auto-dismiss */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-green-500 animate-progress"
            style={{ animationDuration: '5s' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;