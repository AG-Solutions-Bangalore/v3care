import React, { useState } from "react";
import Layout from "../../../layout/Layout";
import DownloadFilter from "../../../components/DownloadFilter";
import { MenuItem, TextField } from "@mui/material";
import { FiDownload } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import Moment from "moment";

const BookingDownload = () => {
  // Get today's date and first day of month in proper format
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  const firstDayOfMonth = Moment().startOf("month").format("YYYY-MM-DD");
  
  const [downloadBooking, setBookingDownload] = useState({
    booking_date_from: firstDayOfMonth,
    booking_date_to: todayFormatted,
    order_status: "",
  });
  
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "On the way", label: "On the way" },
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Vendor", label: "Vendor" },
    { value: "Cancel", label: "Cancel" },
  ];
  
  const [isLoading, setIsLoading] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDownload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const downloadReport = async (url, fileName) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        url, 
        downloadBooking, 
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      // Create download link
      const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Success notification could be added here
    } catch (err) {
      console.error(`Error downloading ${fileName}:`, err);
      // Error notification could be added here
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    downloadReport(
      `${BASE_URL}/api/panel-download-booking`,
      `booking-list-${Moment().format("YYYYMMDD")}.csv`
    );
  };
  
  return (
    <Layout>
      {/* <DownloadFilter /> */}
      <div className="">
        <div className="bg-white shadow-md rounded-lg mt-5 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-800 px-6 py-2">
            <h2 className="text-lg font-semibold text-white">Download Booking Report</h2>
          </div>
          
          <form onSubmit={onSubmit} className="p-6">
            <div className="flex items-center text-blue-600 mb-4 text-sm bg-blue-50 p-3 rounded-md">
              <AiOutlineInfoCircle className="mr-2 text-lg flex-shrink-0" />
              <p>Select a date range and status to filter your report. Leave status blank to include all bookings.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="From Date"
                type="date"
                required
                size="small"
                InputLabelProps={{ shrink: true }}
                name="booking_date_from"
                value={downloadBooking.booking_date_from}
                onChange={onInputChange}
                variant="outlined"
                fullWidth
              />

              <TextField
                label="To Date"
                type="date"
                required
                size="small"
                InputLabelProps={{ shrink: true }}
                name="booking_date_to"
                value={downloadBooking.booking_date_to}
                onChange={onInputChange}
                variant="outlined"
                fullWidth
              />

              <TextField
                label="Status"
                select
                size="small"
                name="order_status"
                value={downloadBooking.order_status}
                onChange={onInputChange}
                variant="outlined"
                fullWidth
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 disabled:opacity-70"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FiDownload className="mr-2" />
                )}
                {isLoading ? "Processing..." : "Download Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default BookingDownload;