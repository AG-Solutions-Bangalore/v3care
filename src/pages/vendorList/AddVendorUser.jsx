import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { MdSend } from "react-icons/md";

import Layout from "../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import { toast } from "react-toastify";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import UseEscapeKey from "../../utils/UseEscapeKey";

const AddVendorUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({
    name: "",
    mobile: "",
    email: "",
    vendor_id: id,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  UseEscapeKey();
  const onInputChange = (e) => {
    setVendor({
      ...vendor,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required");
    } else {
      let data = {
        name: vendor.name,
        mobile: vendor.mobile,
        email: vendor.email,
        vendor_id: id,
      };
      const token = localStorage.getItem("token");
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
        toast.success("Vendor User Created");
        navigate(`/vendor-user-list/${id}`);
      } else {
        if (response.data.code == "401") {
          toast.error("full name duplicate entry");
        } else if (response.data.code == "402") {
          toast.error("mobile no duplicate entry");
        } else {
          toast.error("email id duplicate entry");
        }
      }
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Create Vendor User
        </h2>
        <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-lg">
          <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Full Name */}
              <div className="form-group">
                <Input
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
                <Input
                  fullWidth
                  required
                  id="mobile"
                  label="Mobile No"
                  maxLength={10}
                  // inputProps={{ maxLength: 10, minLength: 10 }}
                  name="mobile"
                  value={vendor.mobile}
                  onChange={onInputChange}
                  className="bg-gray-100 rounded-md"
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <Input
                  fullWidth
                  required
                  id="email"
                  label="Email"
                  type="email"
                  name="email"
                  inputProps={{ maxLength: 10, minLength: 10 }}
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
