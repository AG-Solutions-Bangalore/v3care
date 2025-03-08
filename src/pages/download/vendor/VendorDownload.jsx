import React, { useState } from "react";
import Layout from "../../../layout/Layout";
import DownloadFilter from "../../../components/DownloadFilter";
import { MenuItem, TextField } from "@mui/material";
import { FiDownload } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";

const VendorDownload = () => {
  const [downloadVendor, setDownloadVendor] = useState({ vendor_status: "" });
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Pending", label: "Pending" },
  ];
  const [isLoading, setIsLoading] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setDownloadVendor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const downloadReport = async (url, fileName) => {
    setIsLoading(true);
    try {
      const data = {
        vendor_status: downloadVendor.vendor_status,
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
      setIsLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    downloadReport(`${BASE_URL}/api/panel-download-vendor`, `vendor-list-${new Date().toISOString().slice(0, 10)}.csv`);
  };
  
  return (
    <Layout>
      <DownloadFilter />
      <div className="">
        <div className="bg-white shadow-md rounded-b-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-800 px-6 py-2">
            <h2 className="text-lg font-semibold text-white">Download Vendor Report</h2>
          </div>
          
          <form onSubmit={onSubmit} className="p-6">
            <div className="flex items-center text-blue-600 mb-4 text-sm bg-blue-50 p-3 rounded-md">
              <AiOutlineInfoCircle className="mr-2 text-lg flex-shrink-0" />
              <p>Select a vendor status to filter your report. Leave status blank to include all vendors.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <TextField
                label="Vendor Status"
                select
                size="small"
                name="vendor_status"
                value={downloadVendor.vendor_status}
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
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 disabled:opacity-70"
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
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default VendorDownload;