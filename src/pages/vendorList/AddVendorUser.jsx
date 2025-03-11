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
import PageHeader from "../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";

const AddVendorUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required fields");
      setLoading(false);
      return; // Stop execution if the form is invalid
    }

    const data = {
      name: vendor.name,
      mobile: vendor.mobile,
      email: vendor.email,
      vendor_id: id,
    };

    try {
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

      if (response.data.code === "200") {
        toast.success("Vendor User Created");
        navigate(`/vendor-user-list/${id}`);
      } else {
        switch (response.data.code) {
          case "401":
            toast.error("Full name duplicate entry");
            break;
          case "402":
            toast.error("Mobile number duplicate entry");
            break;
          default:
            toast.error("Email ID duplicate entry");
        }
      }
    } catch (error) {
      console.error("Error creating vendor user:", error);
      toast.error("An error occurred while creating vendor user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div>
        <PageHeader title={"Create Vendor User"} />

        <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-lg mt-2">
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

            <div className="mt-6 text-center">
      

              <ButtonConfigColor
                type="submit"
                buttontype="submit"
                label="Submit"
                disabled={isButtonDisabled}
                loading={loading}
                onClick={onSubmit}
              />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddVendorUser;
