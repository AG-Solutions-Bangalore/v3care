import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import DownloadFilter from "../../../components/DownloadFilter";
import { MenuItem, TextField } from "@mui/material";
import { FiDownload } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import {BASE_URL} from "../../../base/BaseUrl";
import Moment from "moment";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";

const AllBookingDownload = () => {
  // Get today's date and first day of month in proper format
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];
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
    localStorage.setItem(
      "booking_date_from",
      downloadBooking.booking_date_from
    );
    localStorage.setItem("booking_date_to", downloadBooking.booking_date_to);
    localStorage.setItem("branch_id", downloadBooking.branch_id);

    // Store branch name if a branch is selected
    const selectedBranch = branch.find(
      (b) => b.id.toString() === downloadBooking.branch_id
    );
    if (selectedBranch) {
      localStorage.setItem("branch_name", selectedBranch.branch_name);
    } else {
      localStorage.removeItem("branch_name");
    }

    // Navigate to the view page
    navigate("/view-allBooking");
  };

  return (
    <Layout>
      <PageHeader title={"All Booking Report"} />
      <div className="bg-white shadow-md rounded-lg mt-2 overflow-hidden">
        <form onSubmit={onSubmitView} className="p-6">
          <div className="flex items-center text-blue-600 mb-4 text-sm bg-blue-50 p-3 rounded-md">
            <AiOutlineInfoCircle className="mr-2 text-lg flex-shrink-0" />
            <p>
              Select a date range and branch to filter your report. Leave branch
              blank to include all bookings.
            </p>
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

          <div className="flex justify-center mt-2">
            <ButtonConfigColor
              type="view"
              buttontype="view"
              label="View Report"
              loading={isLoading}
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AllBookingDownload;
