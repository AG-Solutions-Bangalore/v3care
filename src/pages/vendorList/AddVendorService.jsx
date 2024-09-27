import Layout from "../../layout/Layout";
import React, { useState, useEffect } from "react";
import { Select, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { Input, FormControl, InputLabel } from "@mui/material";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import BASE_URL from "../../base/BaseUrl";
import { useParams } from "react-router-dom";

const AddVendorService = () => {
  const { id } = useParams();
  const [selectedServices, setSelectedServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (event) => {
    setSelectedServices(event.target.value);
    console.log("Selected Services:", event.target.value);
  };

  useEffect(() => {
    const theLoginToken = localStorage.getItem("token");

    axios
      .get(`${BASE_URL}/api/panel-fetch-service`, {
        headers: {
          Authorization: `Bearer ${theLoginToken}`,
        },
      })
      .then((response) => setAvailableServices(response.data.service))
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("vendor_service", selectedServices);

    const formValid = document.getElementById("addIndiv").reportValidity();

    if (formValid) {
      setIsButtonDisabled(true);
      axios
        .post(
          `${BASE_URL}/api/panel-update-vendors-services/${id}?_method=PUT`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.data.code === "200") {
            alert("Data updated successfully");
          } else {
            alert("Duplicate Entry");
            setIsButtonDisabled(false);
          }
        })
        .catch((error) => {
          console.error("Error updating data:", error);
          setIsButtonDisabled(false);
        });
    }
  };
  return (
    <Layout>
      <div className="p-6 w-full  mx-auto bg-white shadow-lg rounded-lg mt-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add Vendor Service - {id}
        </h1>
        <div className="border-t border-gray-300 my-4"></div>
        <form
          id="addIndiv"
          autoComplete="off"
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <FormControl fullWidth>
            <InputLabel htmlFor="select-multiple-checkbox">
              Service <span className="text-red-700">*</span>
            </InputLabel>
            <Select
              multiple
              value={selectedServices}
              onChange={handleChange}
              input={
                <Input
                  id="select-multiple-checkbox"
                  className="bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              }
              renderValue={(selected) => selected.join(", ")}
              className="bg-gray-100 rounded-md shadow-sm"
            >
              {availableServices.map((service) => (
                <MenuItem key={service.service} value={service.service}>
                  <Checkbox
                    color="primary"
                    checked={selectedServices.indexOf(service.service) > -1}
                  />
                  <ListItemText primary={service.service} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="flex justify-center">
            <button
              type="submit"
              className={`flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 ${
                isButtonDisabled ? "bg-gray-400" : "hover:bg-blue-700"
              }`}
              disabled={isButtonDisabled}
            >
              <FiEdit className="mr-2" /> Update
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddVendorService;
