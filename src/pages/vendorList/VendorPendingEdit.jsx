import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { Button, Input } from "@material-tailwind/react";
import { MdArrowBack, MdSend } from "react-icons/md";
import { toast } from "react-toastify";
import UseEscapeKey from "../../utils/UseEscapeKey";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";

const VendorPendingEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vendor, setVendor] = useState({
    vendor_short: "",
    vendor_company: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_aadhar_no: "",
    vendor_gst_no: "",
    vendor_ref_name_1: "",
    vendor_ref_mobile_1: "",
    vendor_ref_name_2: "",
    vendor_ref_mobile_2: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  UseEscapeKey();
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      navigate("/home");
      return;
    }

    const fetchVendorData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-vendor-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setVendor(response.data.vendor);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchVendorData();
  }, [id, navigate]);
  const validateOnlyDigits = (inputtxt) => {
    const phoneno = /^\d+$/;
    return phoneno.test(inputtxt) || inputtxt.length === 0;
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "vendor_mobile" ||
        name === "vendor_ref_mobile_1" ||
        name === "vendor_ref_mobile_2") &&
      !validateOnlyDigits(value)
    ) {
      return;
    }
    setVendor({ ...vendor, [name]: value });
  };
  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/vendor-list?page=${pageNo}`);
  };
  const onSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    const form = document.getElementById("addIndiv");

    if (!form.checkValidity()) {
      toast.error("Fill all required");
    } else {
      setIsButtonDisabled(true);

      let data = {
        vendor_short: vendor.vendor_short,
        vendor_company: vendor.vendor_company,
        vendor_mobile: vendor.vendor_mobile,
        vendor_email: vendor.vendor_email,
        vendor_aadhar_no: vendor.vendor_aadhar_no,
        vendor_gst_no: vendor.vendor_gst_no,
        vendor_ref_name_1: vendor.vendor_ref_name_1,
        vendor_ref_mobile_1: vendor.vendor_ref_mobile_1,
        vendor_ref_name_2: vendor.vendor_ref_name_2,
        vendor_ref_mobile_2: vendor.vendor_ref_mobile_2,
      };

      try {
        const response = await axios.post(
          `${BASE_URL}/api/panel-update-vendor-short/${id}?_method=PUT`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.code == "200") {
          toast.success(response.data?.msg || "Data Updated Successfully");
          navigate(`/vendor-list?page=${pageNo}`);
        } else {
          if (response.data.code == "401") {
            toast.error(response.data?.msg || "Company Short Duplicate Entry");
          } else if (response.data.code == "402") {
            toast.error(response.data?.msg || "Mobile No Duplicate Entry");
          } else {
            toast.error(response.data?.msg || "Email Id Duplicate Entry");
          }
        }
      } catch (error) {
        console.error("Error updating vendor:", error);
        toast.error("Error updating vendor");
        setLoading(false);
      } finally {
        setIsButtonDisabled(false);
        setLoading(false);
      }
    }
  };

  return (
    <Layout>
      <PageHeader title={"Pending Edit Vendor "} />

      <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
        {/* Personal Details */}
        <h2 className="text-lg font-semibold mb-2">Personal Details</h2>
        <hr className="mb-4" />

        <form onSubmit={onSubmit} id="addIndiv" autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Nickname */}
            <div>
              <Input
                label="Nick Name"
                type="text"
                name="vendor_short"
                value={vendor.vendor_short}
                onChange={onInputChange}
                className="w-full border border-gray-700 rounded-md p-2"
              />
            </div>

            {/* Company */}
            <div>
              <Input
                label="Company"
                type="text"
                name="vendor_company"
                value={vendor.vendor_company}
                onChange={onInputChange}
                className="w-full border border-gray-700 rounded-md p-2"
                required
              />
            </div>

            {/* Mobile No */}
            <div>
              <Input
                label="Mobile No"
                type="text"
                name="vendor_mobile"
                maxLength={10}
                minLength={10}
                value={vendor.vendor_mobile}
                onChange={onInputChange}
                className="w-full border border-gray-700 rounded-md p-2"
                required
              />
            </div>

            {/* Email */}
            <div>
              <Input
                label="Email"
                type="email"
                name="vendor_email"
                value={vendor.vendor_email}
                onChange={onInputChange}
                className="w-full border border-gray-700 rounded-md p-2"
                required
              />
            </div>

            {/* Aadhar No */}
            <div>
              <Input
                label="Aadhar No"
                type="text"
                name="vendor_aadhar_no"
                maxLength={12}
                minLength={12}
                value={vendor.vendor_aadhar_no}
                onChange={onInputChange}
                className="w-full border border-gray-700 rounded-md p-2"
                required
              />
            </div>

            {/* GST No */}
            <div>
              <Input
                label="GST No"
                type="text"
                name="vendor_gst_no"
                maxLength={15}
                value={vendor.vendor_gst_no}
                onChange={onInputChange}
                className="w-full border border-gray-700 rounded-md p-2"
              />
            </div>
          </div>
          {/* <div className="mt-4 text-center">
            <Button
              type="submit"
              className="mr-2 mb-2"
              // disabled={isButtonDisabled}
            >
              <div className="flex gap-1">
                <MdSend className="w-4 h-4" />
                <span>Update</span>
              </div>
            </Button>

            <Button className="mr-2 mb-2" onClick={handleBack}>
              <div className="flex gap-1">
                <MdArrowBack className="w-4 h-4" />
                <span>Back</span>
              </div>
            </Button>
          </div> */}
          <div className="flex justify-center space-x-4 my-2">
            <ButtonConfigColor
              type="edit"
              buttontype="submit"
              label="Update"
              disabled={isButtonDisabled}
              loading={loading}
            />

            <ButtonConfigColor
              type="back"
              buttontype="button"
              label="Cancel"
              onClick={() => navigate(-1)}
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default VendorPendingEdit;
