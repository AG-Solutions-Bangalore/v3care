import React from 'react';
import { XMarkIcon, BellAlertIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const NotificationPopup = ({ notification, onClose, totalNew, markAllAsRead }) => {
  const handleNext = () => {
    console.log("Closing notification ID:", notification.id);
    onClose();
  };

  const handleCloseAll = () => {
    markAllAsRead();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleNext}
      />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm transform transition-all animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <BellAlertIcon className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">New Notification</h3>
              <p className="text-xs text-gray-500">ID: {notification.id}</p>
            </div>
          </div>
          <button
            onClick={handleNext}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="p-4">
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
              {notification.notification_booking_heading}
            </span>
          </div>

          <p className="text-gray-700 text-sm mb-3">
            {notification.notification_booking_message}
          </p>

          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center">
              <span className="font-medium mr-2">Branch:</span>
              {notification.branch_name}
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-2">Order ID:</span>
              {notification.order_id}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 rounded-b-xl flex justify-between items-center">
          {totalNew > 1 ? (
            <span className="text-sm text-gray-600">
              {totalNew - 1} more to show
            </span>
          ) : (
            <span className="text-sm text-gray-600">New notification</span>
          )}

          <div className="flex space-x-2">
            <button
              onClick={handleCloseAll}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Close All
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {totalNew > 1 ? (
                <>
                  Next
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </>
              ) : (
                'Close'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
