import { MenuItem, TextField } from "@mui/material";
import axios from "axios";
import Moment from "moment";
import { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Layout from "../../../layout/Layout";

const BookingDownload = () => {
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];
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
      const res = await axios.post(url, downloadBooking, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(`Error downloading ${fileName}:`, err);
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
      <PageHeader title={"Download Booking Report"} />

      <div className="">
        <div className="bg-white shadow-md rounded-lg mt-2 overflow-hidden">
          <form onSubmit={onSubmit} className="p-6">
            <div className="flex items-center text-blue-600 mb-4 text-sm bg-blue-50 p-3 rounded-md">
              <AiOutlineInfoCircle className="mr-2 text-lg flex-shrink-0" />
              <p>
                Select a date range and status to filter your report. Leave
                status blank to include all bookings.
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

            <div className="flex justify-center mt-2">
              <ButtonConfigColor
                type="download"
                buttontype="submit"
                label="Download Report"
                loading={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default BookingDownload;
