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
  const [test, setTest] = useState([]);
  const [servicess, setServicess] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (event) => {
    setTest(event.target.value);
    console.log("check", event.target.value);
  };

  useEffect(() => {
    const theLoginToken = localStorage.getItem("token");

    axios
      .get(`${BASE_URL}/api/panel-fetch-service`, {
        headers: {
          Authorization: `Bearer ${theLoginToken}`,
        },
      })
      .then((response) => setServicess(response.data.service))
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("vendor_service", test);

    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");

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
          if (res.data.code == "200") {
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
      <div className="p-6 w-full mx-auto">
        <h1 className="text-2xl font-bold mb-4">Add Vendor Service{id}</h1>
        <form
          id="addIndiv"
          autoComplete="off"
          onSubmit={onSubmit}
          className="space-y-4"
        >
          <div className="border-t border-gray-300 my-4"></div>
          <div className="w-full">
            <FormControl fullWidth>
              <InputLabel htmlFor="select-multiple-checkbox">
                Service*
              </InputLabel>
              <Select
                multiple
                value={test}
                onChange={handleChange}
                required
                input={<Input id="select-multiple-checkbox" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {servicess.map((service) => (
                  <MenuItem key={service.service} value={service.service}>
                    <Checkbox
                      color="primary"
                      checked={test.indexOf(service.service) > -1}
                    />
                    <ListItemText primary={service.service} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded flex items-center disabled:bg-gray-400"
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
