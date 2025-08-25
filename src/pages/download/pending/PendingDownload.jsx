import { TextField } from "@mui/material";
import axios from "axios";
import Moment from "moment";
import { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Layout from "../../../layout/Layout";

const PendingDownload = () => {
  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0];
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

    localStorage.setItem(
      "booking_date_from",
      downloadReceived.booking_date_from
    );
    localStorage.setItem("booking_date_to", downloadReceived.booking_date_to);

    navigate("/view-pending-download");
  };

  return (
    <Layout>
      <PageHeader title={"Pending Payment Report"} />{" "}
      <div className="">
        <div className="bg-white shadow-md rounded-lg mt-2 overflow-hidden">
          <form onSubmit={onSubmit} className="p-6">
            <div className="flex items-center text-blue-600 mb-4 text-sm bg-blue-50 p-3 rounded-md">
              <AiOutlineInfoCircle className="mr-2 text-lg flex-shrink-0" />
              <p>
                Select a date range to filter your pending payment report. Leave
                blank if you want all records.
              </p>
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

            <div className="flex justify-center mt-2 space-x-2">
              <ButtonConfigColor
                type="download"
                label="Download Report"
                buttontype="submit"
                loading={isDownloading}
              />
              <ButtonConfigColor
                type="view"
                label="View Report"
                loading={isViewing}
                onClick={onSubmitView}
              />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PendingDownload;
