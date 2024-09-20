import React, { useState } from "react";
import Layout from "../../../layout/Layout";
import DownloadFilter from "../../../components/DownloadFilter";
import { MenuItem, TextField } from "@mui/material";
import { FiDownload } from "react-icons/fi";
import { AiFillAlert } from "react-icons/ai";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import Moment from "moment";

const BookingDownload = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;

  const firstdate = Moment().startOf("month").format("YYYY-MM-DD");
  const [downloadBooking, setBookingDownload] = useState({
    booking_date_from: firstdate,
    booking_date_to: todayback,
    order_status: "",
  });
  const [status, setStatus] = useState([
    { value: "Confirmed", label: "Confirmed" },
    { value: "On the way", label: "On the way" },
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Vendor", label: "Vendor" },
    { value: "Cancel", label: "Cancel" },
  ]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDownload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const downloadReport = async (url, fileName) => {
    try {
      let data = {
        booking_date_from: downloadBooking.booking_date_from,
        booking_date_to: downloadBooking.booking_date_to,
        order_status: downloadBooking.order_status,
      };
      const token = localStorage.getItem("token");
      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      console.log(`${fileName} downloaded successfully.`);
      // toast.success("Member data Download");
    } catch (err) {
      console.error(`Error downloading ${fileName}:`, err);
      toast.error("Err on Downloading");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    downloadReport(
      `${BASE_URL}/api/panel-download-booking`,
      "booking-list.csv"
    );
    // Handle the form submission logic here
  };
  return (
    <Layout>
      <DownloadFilter />
      <div className="px-6 py-8">
        <div className="mb-4 text-2xl font-bold text-gray-800">
          Download Booking
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <form id="dowRecp" autoComplete="off" onSubmit={onSubmit}>
            <div className="flex items-center text-red-500 mb-4">
              <AiFillAlert className="mr-2" />
              <h3>Leave blank if you want all records.</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="form-group">
                <TextField
                  fullWidth
                  label="From Date"
                  type="date"
                  required
                  InputLabelProps={{ shrink: true }}
                  name="booking_date_from"
                  value={downloadBooking.booking_date_from}
                  onChange={onInputChange}
                  variant="outlined"
                  className="w-full"
                />
              </div>

              <div className="form-group">
                <TextField
                  fullWidth
                  label="To Date"
                  type="date"
                  required
                  InputLabelProps={{ shrink: true }}
                  name="booking_date_to"
                  value={downloadBooking.booking_date_to}
                  onChange={onInputChange}
                  variant="outlined"
                  className="w-full"
                />
              </div>

              <div className="form-group">
                <TextField
                  fullWidth
                  label="Status"
                  select
                  name="order_status"
                  value={downloadBooking.order_status}
                  onChange={onInputChange}
                  variant="outlined"
                  className="w-full"
                >
                  {status.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <div className="flex justify-start items-center col-span-1 lg:col-span-3">
                <button
                  type="submit"
                  className={`flex items-center justify-center w-48 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-400`}
                  disabled={isButtonDisabled}
                >
                  <FiDownload className="mr-2" /> Download
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default BookingDownload;
