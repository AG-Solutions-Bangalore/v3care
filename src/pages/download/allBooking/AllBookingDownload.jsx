import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import DownloadFilter from "../../../components/DownloadFilter";
import { MenuItem, TextField } from "@mui/material";
import { FiDownload } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import BASE_URL from "../../../base/BaseUrl";
import Moment from "moment";
import { useNavigate } from "react-router-dom";

const AllBookingDownload = () => {
  // Get today's date and first day of month in proper format
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  const firstDayOfMonth = Moment().startOf("month").format("YYYY-MM-DD");
  
  const [downloadBooking, setBookingDownload] = useState({
    booking_date_from: firstDayOfMonth,
    booking_date_to: todayFormatted,
    branch_id: "",
  });
  
  const [branch, setBranch] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDownload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/panel-fetch-branch`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setBranch(data.branch);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  const onSubmitView = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Store filter values in localStorage
    localStorage.setItem('booking_date_from', downloadBooking.booking_date_from);
    localStorage.setItem('booking_date_to', downloadBooking.booking_date_to);
    localStorage.setItem('branch_id', downloadBooking.branch_id);
    
    // Store branch name if a branch is selected
    const selectedBranch = branch.find(b => b.id.toString() === downloadBooking.branch_id);
    if (selectedBranch) {
      localStorage.setItem('branch_name', selectedBranch.branch_name);
    } else {
      localStorage.removeItem('branch_name'); 
    }
    
    // Navigate to the view page
    navigate('/view-allBooking');
  };
  
  return (
    <Layout>
      <DownloadFilter />
      <div className="">
        <div className="bg-white shadow-md rounded-b-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-800 px-6 py-2">
            <h2 className="text-lg font-semibold text-white">All Booking Report</h2>
          </div>
          
          <form onSubmit={onSubmitView} className="p-6">
            <div className="flex items-center text-blue-600 mb-4 text-sm bg-blue-50 p-3 rounded-md">
              <AiOutlineInfoCircle className="mr-2 text-lg flex-shrink-0" />
              <p>Select a date range and branch to filter your report. Leave branch blank to include all bookings.</p>
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
                label="Branch"
                select
                size="small"
                name="branch_id"
                value={downloadBooking.branch_id}
                onChange={onInputChange}
                variant="outlined"
                fullWidth
              >
                <MenuItem value="">All Branches</MenuItem>
                {branch.map((branchData) => (
                  <MenuItem key={branchData.id} value={String(branchData.id)}>
                    {branchData.branch_name}
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
                {isLoading ? "Processing..." : "View Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AllBookingDownload;