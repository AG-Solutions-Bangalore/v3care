import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { MdSend } from "react-icons/md";

import Layout from "../../layout/Layout";
import { useParams } from "react-router-dom";

const AddVendorUser = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState({
    name: "",
    mobile: "",
    email: "",
    vendor_id: id,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setVendor({
      ...vendor,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let data = {
      name: vendor.name,
      mobile: vendor.mobile,
      email: vendor.email,
      vendor_id: id,
    };
    const response = await axios.post(
      `${BASE_URL}/api/panel-create-vendor-user`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.code == "200") {
      alert("success");
    } else {
      if (response.data.code == "401") {
        alert("full name duplicate entry");
      } else if (response.data.code == "402") {
        alert("mobile no duplicate entry");
      } else {
        alert("email id duplicate entry");
      }
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Create Vendor User{id}
        </h2>
        <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-lg">
          <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Full Name */}
              <div className="form-group">
                <TextField
                  id="name"
                  required
                  label="Full Name"
                  name="name"
                  value={vendor.name}
                  onChange={onInputChange}
                  fullWidth
                  className="bg-gray-100 rounded-md"
                />
              </div>

              {/* Mobile No */}
              <div className="form-group">
                <TextField
                  fullWidth
                  required
                  id="mobile"
                  label="Mobile No"
                  inputProps={{ maxLength: 10, minLength: 10 }}
                  name="mobile"
                  value={vendor.mobile}
                  onChange={onInputChange}
                  className="bg-gray-100 rounded-md"
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <TextField
                  fullWidth
                  required
                  id="email"
                  label="Email"
                  type="email"
                  name="email"
                  value={vendor.email}
                  onChange={onInputChange}
                  className="bg-gray-100 rounded-md"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 text-center">
              <Button
                type="submit"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-md shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 ease-in-out disabled:opacity-50"
                onClick={onSubmit}
                disabled={isButtonDisabled}
              >
                <MdSend className="text-white" />
                <span style={{ color: "white" }}>Submit</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddVendorUser;
