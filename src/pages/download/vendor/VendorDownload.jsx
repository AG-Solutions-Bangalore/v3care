import React, { useState } from "react";
import Layout from "../../../layout/Layout";
import DownloadFilter from "../../../components/DownloadFilter";
import { MenuItem, TextField } from "@mui/material";
import { FiDownload } from "react-icons/fi";
import { AiFillAlert } from "react-icons/ai";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";

const VendorDownload = () => {
  const [downloadVendor, setDownloadVendor] = useState({ vendor_status: "" });
  const [status, setStatus] = useState([
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Pending", label: "Pending" },
  ]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setDownloadVendor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const downloadReport = async (url, fileName) => {
    try {
      let data = {
        vendor_status: downloadVendor.vendor_status,
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
    downloadReport(`${BASE_URL}/api/panel-download-vendor`, "vendor.csv");
    // Handle the form submission logic here
  };
  return (
    <Layout>
      <DownloadFilter />
      <div className="px-6 py-8">
        <div className="mb-4 text-2xl font-bold text-gray-800">
          Download Vendor
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <form id="dowRecp" autoComplete="off" onSubmit={onSubmit}>
            <div className="flex items-center text-red-500 mb-4">
              <AiFillAlert className="mr-2" />
              <h3>Leave blank if you want all records.</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-group">
                <TextField
                  fullWidth
                  label="Status"
                  autoComplete="off"
                  select
                  name="vendor_status"
                  value={downloadVendor.vendor_status}
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

              <div className="col-span-1">
                <button
                  type="submit"
                  className={`flex items-center justify-center w-full px-4 py-4 text-white bg-blue-600 hover:bg-purple-700 rounded-md disabled:bg-gray-400`}
                  onClick={onSubmit}
                  disabled={isButtonDisabled}
                >
                  <FiDownload className="mr-2" /> Download
                </button>
              </div>
              {/* sajid  */}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default VendorDownload;
