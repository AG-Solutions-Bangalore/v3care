import React, { useState } from "react";
import Layout from "../../../layout/Layout";
import DownloadFilter from "../../../components/DownloadFilter";
import { TextField } from "@mui/material";
import { FiDownload, FiEye } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import axios from "axios";
import Moment from "moment";
import BASE_URL from "../../../base/BaseUrl";
import { useNavigate } from "react-router-dom";

const PendingDownload = () => {
  // Get today's date and first day of month in proper format
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  const firstDayOfMonth = Moment().startOf("month").format("YYYY-MM-DD");
  
  const [downloadReceived, setDownloadReceived] = useState({
    booking_date_from: firstDayOfMonth,
    booking_date_to: todayFormatted,
  });
  
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setDownloadReceived((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const downloadReport = async (url, fileName) => {
    setIsDownloading(true);
    try {
      const data = {
        booking_date_from: downloadReceived.booking_date_from,
        booking_date_to: downloadReceived.booking_date_to,
      };
      const token = localStorage.getItem("token");
      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Create download link
      const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Success notification could be added here
      console.log(`${fileName} downloaded successfully.`);
    } catch (err) {
      console.error(`Error downloading ${fileName}:`, err);
      // Error notification could be added here
    } finally {
      setIsDownloading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    downloadReport(
      `${BASE_URL}/api/panel-download-pending-payment`,
      `pending-payment-${Moment().format("YYYYMMDD")}.csv`
    );
  };

  const onSubmitView = (e) => {
    e.preventDefault();
    setIsViewing(true);
    
    // Store filter values in localStorage
    localStorage.setItem('booking_date_from', downloadReceived.booking_date_from);
    localStorage.setItem('booking_date_to', downloadReceived.booking_date_to);
    
    // Navigate to the view page
    navigate('/view-pending-download');
  };
  
  return (
    <Layout>
      {/* <DownloadFilter /> */}
      <div className="">
        <div className="bg-white shadow-md rounded-lg mt-5 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-800 px-6 py-2">
            <h2 className="text-lg font-semibold text-white">Pending Payment Report</h2>
          </div>
          
          <form onSubmit={onSubmit} className="p-6">
            <div className="flex items-center text-blue-600 mb-4 text-sm bg-blue-50 p-3 rounded-md">
              <AiOutlineInfoCircle className="mr-2 text-lg flex-shrink-0" />
              <p>Select a date range to filter your pending payment report. Leave blank if you want all records.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <TextField
                label="From Date"
                type="date"
                required
                size="small"
                InputLabelProps={{ shrink: true }}
                name="booking_date_from"
                value={downloadReceived.booking_date_from}
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
                value={downloadReceived.booking_date_to}
                onChange={onInputChange}
                variant="outlined"
                fullWidth
              />
            </div>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="submit"
                disabled={isDownloading}
                className="flex items-center justify-center px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 disabled:opacity-70"
              >
                {isDownloading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FiDownload className="mr-2" />
                )}
                {isDownloading ? "Processing..." : "Download Report"}
              </button>
              
              <button
                type="button"
                onClick={onSubmitView}
                disabled={isViewing}
                className="flex items-center justify-center px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-md hover:from-green-600 hover:to-green-800 transition-all duration-300 disabled:opacity-70"
              >
                {isViewing ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FiEye className="mr-2" />
                )}
                {isViewing ? "Loading..." : "View Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PendingDownload;