import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { useParams } from "react-router-dom";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { Button, Input } from "@material-tailwind/react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { MdArrowBack, MdSend } from "react-icons/md";
import { toast } from "react-toastify";
import UseEscapeKey from "../../utils/UseEscapeKey";
const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const EditVendor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  UseEscapeKey();
  const [vendor, setVendor] = useState({
    vendor_short: "",
    vendor_company: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_aadhar_no: "",
    vendor_gst_no: "",
    vendor_images: "",
    vendor_aadhar_front: "",
    vendor_aadhar_back: "",
    vendor_aadhar_gst: "",
    vendor_service_no_count: "",
    vendor_branch_no_count: "",
    vendor_area_no_count: "",
    vendor_status: "",
    branch_id: "",
    vendor_ref_name_1: "",
    vendor_ref_name_2: "",
    vendor_ref_mobile_1: "",
    vendor_ref_mobile_2: "",
  });

  const [users, setUsers] = useState([
    {
      id: "",
      vendor_service: "",
      vendor_service_status: "",
    },
  ]);
  const [users1, setUsers1] = useState([
    {
      id: "",
      vendor_branch_flat: "",
      vendor_branch_building: "",
      vendor_branch_landmark: "",
      vendor_branch_location: "",
      vendor_branch_city: "",
      vendor_branch_district: "",
      vendor_branch_state: "",
      vendor_branch_pincode: "",
      vendor_branch_status: "",
    },
  ]);
  const [users2, setUsers2] = useState([
    {
      id: "",
      vendor_area: "",
      vendor_area_status: "",
    },
  ]);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [selectedFile3, setSelectedFile3] = useState(null);
  const [selectedFile4, setSelectedFile4] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [servicess, setServicess] = useState([]);

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
        setUsers(response.data.vendorService);
        setUsers1(response.data.vendorbranch);
        setUsers2(response.data.vendorArea);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchVendorData();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setServicess(response.data.service);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

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

  const onChange = (e, index) => {
    const updatedUsers = users.map((user, i) =>
      index === i ? { ...user, [e.target.name]: e.target.value } : user
    );
    setUsers(updatedUsers);
  };

  const onChange1 = (e, index) => {
    const updatedUsers = users1.map((user, i) =>
      index === i ? { ...user, [e.target.name]: e.target.value } : user
    );
    setUsers1(updatedUsers);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");

    if (!form.checkValidity()) {
      toast.error("Fill all required");
    } else {
      setIsButtonDisabled(true);

      const formData = new FormData();
      Object.keys(vendor).forEach((key) => formData.append(key, vendor[key]));

      if (selectedFile1) formData.append("vendor_images", selectedFile1);
      if (selectedFile2) formData.append("vendor_aadhar_front", selectedFile2);
      if (selectedFile3) formData.append("vendor_aadhar_back", selectedFile3);
      if (selectedFile4) formData.append("vendor_aadhar_gst", selectedFile4);

      users.forEach((user, index) => {
        Object.keys(user).forEach((key) => {
          formData.append(`vendor_service_data[${index}][${key}]`, user[key]);
        });
      });

      users1.forEach((user, index) => {
        Object.keys(user).forEach((key) => {
          formData.append(`vendor_branch_data[${index}][${key}]`, user[key]);
        });
      });

      users2.forEach((user, index) => {
        Object.keys(user).forEach((key) => {
          formData.append(`vendor_area_data[${index}][${key}]`, user[key]);
        });
      });

      try {
        const response = await axios.post(
          `${BASE_URL}/api/panel-update-vendor/${id}?_method=PUT`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.code == "200") {
          toast.success("Data Updated Successfully");
          navigate("/vendor-list");
        } else {
          if (response.data.code == "401") {
            toast.error("Company Short Duplicate Entry");
          } else if (response.data.code == "402") {
            toast.error("Mobile No Duplicate Entry");
          } else {
            toast.error("Email Id Duplicate Entry");
          }
        }
      } catch (error) {
        console.error("Error updating vendor:", error);
        toast.error("Error updating vendor");
      }
    }
  };

  return (
    <Layout>
      <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Edit Vendor </h1>
          <Link to={`/add-vendor-service/${id}`} className="btn btn-outline">
            <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              <FiPlus className="mr-2" /> Add Vendor Service
            </button>
          </Link>
        </div>

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
                label="Gst No"
                type="text"
                name="vendor_gst_no"
                maxLength={15}
                value={vendor.vendor_gst_no}
                onChange={onInputChange}
                className="w-full border border-gray-700 rounded-md p-2"
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <Input
                label="Photo"
                type="file"
                name="vendor_images"
                onChange={(e) => setSelectedFile1(e.target.files[0])}
                className="w-full border border-gray-700 rounded-md p-2"
              />
              <small>{vendor.vendor_images}</small>
            </div>

            <div>
              <Input
                label="  Aadhar Card Front Side"
                type="file"
                name="vendor_documents"
                onChange={(e) => setSelectedFile2(e.target.files[0])}
                className="w-full border border-gray-700 rounded-md p-2"
              />
              <small>{vendor.vendor_aadhar_front}</small>
            </div>

            <div>
              <label className="block text-gray-700 mb-1"></label>
              <Input
                label=" Aadhar Card Back Side"
                type="file"
                name="vendor_certificates"
                onChange={(e) => setSelectedFile3(e.target.files[0])}
                className="w-full border border-gray-700 rounded-md p-2"
              />
              <small>{vendor.vendor_aadhar_back}</small>
            </div>

            <div>
              <Input
                label="GST Certificate"
                type="file"
                name="vendor_license"
                onChange={(e) => setSelectedFile4(e.target.files[0])}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <small>{vendor.vendor_aadhar_gst}</small>
            </div>
          </div>

          {/* Reference Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Input
                label="Reference Name 1"
                type="text"
                name="vendor_ref_name_1"
                value={vendor.vendor_ref_name_1}
                onChange={(e) => onInputChange(e)}
                className="w-full border border-gray-700 rounded-md p-2"
              />
            </div>

            <div>
              <Input
                label="  Reference Mobile 1"
                type="text"
                name="vendor_ref_mobile_1"
                value={vendor.vendor_ref_mobile_1}
                onChange={(e) => onInputChange(e)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <Input
                label="Reference Name 2"
                type="text"
                name="vendor_ref_name_2"
                value={vendor.vendor_ref_name_2}
                onChange={(e) => onInputChange(e)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <Input
                label="   Reference Mobile 2"
                type="text"
                name="vendor_ref_mobile_2"
                value={vendor.vendor_ref_mobile_2}
                onChange={(e) => onInputChange(e)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Status */}

          <FormControl fullWidth>
            <InputLabel id="service-select-label">
              <span className="text-sm relative bottom-[6px]">
                Status <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <Select
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="service-select-label"
              id="service-select"
              name="vendor_status"
              value={vendor.vendor_status}
              onChange={onInputChange}
              label="Status *"
              required
            >
              {statusOptions.map((data) => (
                <MenuItem key={data.value} value={data.value}>
                  {data.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* service details and adress details  */}
          <h1 className="text-xl font-semibold mb-4 mt-3">Service Details</h1>
          <hr className="border-gray-300 mb-4" />
          {users.map((user, index) => (
            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
              key={index}
            >
              <div className="col-span-3">
                <FormControl fullWidth>
                  <InputLabel id="service-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Service <span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="service-select-label"
                    id="service-select"
                    name="vendor_service"
                    value={user.vendor_service}
                    onChange={(e) => onChange(e, index)}
                    label="Service *"
                    required
                  >
                    {servicess.map((servicessdata, key) => (
                      <MenuItem key={key} value={servicessdata.service}>
                        {servicessdata.service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <input
                  type="hidden"
                  name="id"
                  value={user.id}
                  onChange={(e) => onChange(e, index)}
                />
              </div>
              <div>
                <FormControl fullWidth>
                  <InputLabel id="service-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Status <span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="service-select-label"
                    id="service-select"
                    name="vendor_service_status"
                    required
                    value={user.vendor_service_status}
                    onChange={(e) => onChange(e, index)}
                    label="Status *"
                  >
                    {statusOptions.map((data) => (
                      <MenuItem key={data.value} value={data.value}>
                        {data.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          ))}
          <h1 className="text-xl font-semibold mb-4">Address Details</h1>
          <hr className="border-gray-300 mb-4" />
          {users1.map((user, index) => (
            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
              key={index}
            >
              <div>
                <Input
                  label="House/Flat/Plot"
                  type="text"
                  name="vendor_branch_flat"
                  value={user.vendor_branch_flat}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-700 rounded-md p-2"
                />
                <input
                  type="hidden"
                  name="id"
                  value={user.id}
                  onChange={(e) => onChange1(e, index)}
                />
              </div>
              <div>
                <Input
                  label="Apartment Building"
                  type="text"
                  name="vendor_branch_building"
                  value={user.vendor_branch_building}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-700 rounded-md p-2"
                />
              </div>
              <div>
                <Input
                  label="Landmark"
                  type="text"
                  name="vendor_branch_landmark"
                  value={user.vendor_branch_landmark}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-700 rounded-md p-2"
                />
              </div>
              <div>
                <Input
                  label="Street/Location/Village"
                  type="text"
                  name="vendor_branch_location"
                  value={user.vendor_branch_location}
                  required
                  disabled
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-700 rounded-md p-2"
                  labelProps={{
                    className: "!text-gray-600 ",
                  }}
                />
              </div>
              <div>
                <Input
                  label="City"
                  type="text"
                  name="vendor_branch_city"
                  required
                  disabled
                  value={user.vendor_branch_city}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-700 rounded-md p-2"
                  labelProps={{
                    className: "!text-gray-600 ",
                  }}
                />
              </div>
              <div>
                <Input
                  label="District"
                  type="text"
                  name="vendor_branch_district"
                  required
                  disabled
                  value={user.vendor_branch_district}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  labelProps={{
                    className: "!text-gray-600 ",
                  }}
                />
              </div>
              <div>
                <Input
                  label="State"
                  type="text"
                  name="vendor_branch_state"
                  required
                  disabled
                  value={user.vendor_branch_state}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  labelProps={{
                    className: "!text-gray-600 ",
                  }}
                />
              </div>
              <div>
                <Input
                  label="Pincode"
                  type="text"
                  name="vendor_branch_pincode"
                  required
                  disabled
                  value={user.vendor_branch_pincode}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  labelProps={{
                    className: "!text-gray-600 ",
                  }}
                />
              </div>
              <div>
                <FormControl fullWidth>
                  <InputLabel id="service-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Status <span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="service-select-label"
                    id="service-select"
                    name="vendor_branch_status"
                    value={user.vendor_branch_status}
                    onChange={(e) => onChange1(e, index)}
                    label="Status *"
                    required
                  >
                    {statusOptions.map((data) => (
                      <MenuItem key={data.value} value={String(data.value)}>
                        {data.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          ))}
          <div className="mt-4 text-center">
            <Button
              type="submit"
              className="mr-2 mb-2"
              color="primary"
              onClick={onSubmit}
              disabled={isButtonDisabled}
            >
              <div className="flex gap-1">
                <MdSend className="w-4 h-4" />
                <span>{isButtonDisabled ? "Updating..." : "Update"}</span>
              </div>
            </Button>

            <Link to="/vendor-list">
              <Button className="mr-2 mb-2" color="primary">
                <div className="flex gap-1">
                  <MdArrowBack className="w-4 h-4" />
                  <span>Back</span>
                </div>
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditVendor;
