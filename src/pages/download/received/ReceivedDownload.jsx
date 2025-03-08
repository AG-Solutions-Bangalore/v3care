import React, { useState } from "react";
import DownloadFilter from "../../../components/DownloadFilter";
import Layout from "../../../layout/Layout";
import { MenuItem, TextField } from "@mui/material";
import { FiDownload } from "react-icons/fi";
import { AiFillAlert } from "react-icons/ai";
import axios from "axios";
import Moment from "moment";
import BASE_URL from "../../../base/BaseUrl";
import { useNavigate } from "react-router-dom";
const ReceivedDownload = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;

  const firstdate = Moment().startOf("month").format("YYYY-MM-DD");
  const [downloadReceived, setDownloadReceived] = useState({
    booking_date_from: firstdate,
    booking_date_to: todayback,
  });
  const navigate = useNavigate()
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setDownloadReceived((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const downloadReport = async (url, fileName) => {
    try {
      let data = {
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
      `${BASE_URL}/api/panel-download-received-payment`,
      "received-list.csv"
    );
    // Handle the form submission logic here
  };

  const onSubmitView = (e) => {
    e.preventDefault();
    localStorage.setItem('booking_date_from', downloadReceived.booking_date_from);
    localStorage.setItem('booking_date_to', downloadReceived.booking_date_to);
    navigate('/view-received-download');
  };
  return (
    <Layout>
      <DownloadFilter />
      <div className="px-6 py-8">
        <div className="mb-4 text-2xl font-bold text-gray-800">
          Download Received Payment
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
                  value={downloadReceived.booking_date_from}
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
                  value={downloadReceived.booking_date_to}
                  onChange={onInputChange}
                  variant="outlined"
                  className="w-full"
                />
              </div>

               <div className="flex items-center gap-5">
                              <button
                                type="submit"
                                className={`flex items-center justify-center w-full px-4 py-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-400`}
                                // disabled={isButtonDisabled}
                              >
                                <FiDownload className="mr-2" /> Download
                              </button>
                              <button
                                type="button"
                                className={`flex items-center justify-center w-full px-4 py-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-400`}
                                onClick={onSubmitView}
                              >
                                <FiDownload className="mr-2" /> View
                              </button>
                            </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ReceivedDownload;
