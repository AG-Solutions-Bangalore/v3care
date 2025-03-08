import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import DownloadFilter from "../../../components/DownloadFilter";
import { FiDownload } from "react-icons/fi";
import { AiFillAlert } from "react-icons/ai";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import Moment from "moment";

import { FormControl, InputLabel, Select, MenuItem,TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
const AllBookingDownload = () => {
  var today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
  
    today = mm + "/" + dd + "/" + yyyy;
    const todayback = yyyy + "-" + mm + "-" + dd;
  
    const firstdate = Moment().startOf("month").format("YYYY-MM-DD");
    const [downloadBooking, setBookingDownload] = useState({
      booking_date_from: firstdate,
      booking_date_to: todayback,
      branch_id: "",
    });
    const navigate= useNavigate()
    const [branch, setBranch] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  
    const onInputChange = (e) => {
      const { name, value } = e.target;
      setBookingDownload((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
   useEffect(() => {
      const theLoginToken = localStorage.getItem("token");
  
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + theLoginToken,
        },
      };
  
      fetch(BASE_URL + "/api/panel-fetch-branch", requestOptions)
        .then((response) => response.json())
        .then((data) => setBranch(data.branch));
    }, []);
   
  
 
    const onSubmitView = (e) => {
      e.preventDefault();
      localStorage.setItem('booking_date_from', downloadBooking.booking_date_from);
      localStorage.setItem('booking_date_to', downloadBooking.booking_date_to);
      localStorage.setItem('branch_id', downloadBooking.branch_id);
    
      
      const selectedBranch = branch.find(b => b.id.toString() === downloadBooking.branch_id);
      if (selectedBranch) {
        localStorage.setItem('branch_name', selectedBranch.branch_name);
      } else {
        localStorage.removeItem('branch_name'); 
      }
    
      navigate('/view-allBooking');
    };
    
  return (
   <Layout>
     <DownloadFilter />
      <div className="px-6 py-8">
        <div className="mb-4 text-2xl font-bold text-gray-800">
         All Booking Report
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <form id="dowRecp" autoComplete="off" onSubmit={onSubmitView}>
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
               
                <FormControl fullWidth>
                                <InputLabel id="service-select-label">
                                  <span className="text-sm  ">
                                    Branch 
                                  </span>
                                </InputLabel>
                                <Select
                                  labelId="service-select-label"
                                  id="service-select"
                                  name="branch_id"
                                  value={downloadBooking.branch_id}
                                  onChange={onInputChange}
                                  label="Branch *"
                                  
                                >
                                  {branch.map((branchdata) => (
                                    <MenuItem key={branchdata.id} value={String(branchdata.id)}>
                                      {branchdata.branch_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
              </div>

              <div className="flex justify-start items-center col-span-1 lg:col-span-3">
                <button
                  type="submit"
                  className={`flex items-center justify-center w-48 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-400`}
                  // disabled={isButtonDisabled}
                >
                  <FiDownload className="mr-2" /> View
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
   </Layout>
  )
}

export default AllBookingDownload