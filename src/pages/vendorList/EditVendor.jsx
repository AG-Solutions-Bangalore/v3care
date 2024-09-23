import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { useParams } from "react-router-dom";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const EditVendor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

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
        alert("Data Updated Successfully");
      } else {
        if (response.data.code == "401") {
          alert("Company Short Duplicate Entry");
        } else if (response.data.code == "402") {
          alert("Mobile No Duplicate Entry");
        } else {
          alert("Email Id Duplicate Entry");
        }
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert("Error updating vendor");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Edit Vendor {id}</h1>
          <Link to={`/add-vendor-service/${id}`} className="btn btn-outline">
            <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              <FiPlus className="mr-2" /> Add Vendor Service
            </button>
          </Link>
        </div>

        {/* Personal Details */}
        <h2 className="text-lg font-semibold mb-2">Personal Details</h2>
        <hr className="mb-4" />

        <form onSubmit={onSubmit} autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Nickname */}
            <div>
              <label className="block text-gray-700 mb-1">Nick Name</label>
              <input
                type="text"
                name="vendor_short"
                value={vendor.vendor_short}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-gray-700 mb-1">
                Company<span className="text-red-800">*</span>
              </label>
              <input
                type="text"
                name="vendor_company"
                value={vendor.vendor_company}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            {/* Mobile No */}
            <div>
              <label className="block text-gray-700 mb-1">
                Mobile No<span className="text-red-800">*</span>
              </label>
              <input
                type="text"
                name="vendor_mobile"
                maxLength={10}
                minLength={10}
                value={vendor.vendor_mobile}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">
                Email<span className="text-red-800">*</span>
              </label>
              <input
                type="email"
                name="vendor_email"
                value={vendor.vendor_email}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            {/* Aadhar No */}
            <div>
              <label className="block text-gray-700 mb-1">
                Aadhar No<span className="text-red-800">*</span>
              </label>
              <input
                type="text"
                name="vendor_aadhar_no"
                maxLength={12}
                minLength={12}
                value={vendor.vendor_aadhar_no}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            {/* GST No */}
            <div>
              <label className="block text-gray-700 mb-1">GST No</label>
              <input
                type="text"
                name="vendor_gst_no"
                maxLength={15}
                value={vendor.vendor_gst_no}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-1">Photo</label>
              <input
                type="file"
                name="vendor_images"
                onChange={(e) => setSelectedFile1(e.target.files[0])}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <small>{vendor.vendor_images}</small>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Aadhar Card Front Side
              </label>
              <input
                type="file"
                name="vendor_documents"
                onChange={(e) => setSelectedFile2(e.target.files[0])}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <small>{vendor.vendor_aadhar_front}</small>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Aadhar Card Back Side
              </label>
              <input
                type="file"
                name="vendor_certificates"
                onChange={(e) => setSelectedFile3(e.target.files[0])}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <small>{vendor.vendor_aadhar_back}</small>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                GST Certificate
              </label>
              <input
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
              <label className="block text-gray-700 mb-1">
                Reference Name 1
              </label>
              <input
                type="text"
                name="vendor_ref_name_1"
                value={vendor.vendor_ref_name_1}
                onChange={(e) => onInputChange(e)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Reference Mobile 1
              </label>
              <input
                type="text"
                name="vendor_ref_mobile_1"
                value={vendor.vendor_ref_mobile_1}
                onChange={(e) => onInputChange(e)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Reference Name 2
              </label>
              <input
                type="text"
                name="vendor_ref_name_2"
                value={vendor.vendor_ref_name_2}
                onChange={(e) => onInputChange(e)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Reference Mobile 2
              </label>
              <input
                type="text"
                name="vendor_ref_mobile_2"
                value={vendor.vendor_ref_mobile_2}
                onChange={(e) => onInputChange(e)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-1">
                Status<span className="text-red-800">*</span>
              </label>
              <select
                name="vendor_status"
                value={vendor.vendor_status}
                onChange={onInputChange}
                className="w-full border border-gray-300 rounded-md p-2"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* service details and adress details  */}
          <h1 className="text-xl font-semibold mb-4">Service Details</h1>
          <hr className="border-gray-300 mb-4" />
          {users.map((user, index) => (
            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
              key={index}
            >
              <div className="col-span-3">
                <label className="block text-gray-700 mb-1">
                  Service<span className="text-red-800">*</span>
                </label>
                <select
                  name="vendor_service"
                  required
                  value={user.vendor_service}
                  onChange={(e) => onChange(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {servicess.map((servicessdata, key) => (
                    <option key={key} value={servicessdata.service}>
                      {servicessdata.service}
                    </option>
                  ))}
                </select>
                <input
                  type="hidden"
                  name="id"
                  value={user.id}
                  onChange={(e) => onChange(e, index)}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Status<span className="text-red-800">*</span>
                </label>
                <select
                  name="vendor_service_status"
                  required
                  value={user.vendor_service_status}
                  onChange={(e) => onChange(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                <label className="block text-gray-700 mb-1">
                  House #/Flat #/ Plot #
                </label>
                <input
                  type="text"
                  name="vendor_branch_flat"
                  value={user.vendor_branch_flat}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <input
                  type="hidden"
                  name="id"
                  value={user.id}
                  onChange={(e) => onChange1(e, index)}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Apartment/Building
                </label>
                <input
                  type="text"
                  name="vendor_branch_building"
                  value={user.vendor_branch_building}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Landmark</label>
                <input
                  type="text"
                  name="vendor_branch_landmark"
                  value={user.vendor_branch_landmark}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Street/Location/Village
                </label>
                <input
                  type="text"
                  name="vendor_branch_location"
                  value={user.vendor_branch_location}
                  required
                  disabled
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="vendor_branch_city"
                  required
                  disabled
                  value={user.vendor_branch_city}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  name="vendor_branch_district"
                  required
                  disabled
                  value={user.vendor_branch_district}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="vendor_branch_state"
                  required
                  disabled
                  value={user.vendor_branch_state}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  name="vendor_branch_pincode"
                  required
                  disabled
                  value={user.vendor_branch_pincode}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Status</label>
                <select
                  name="vendor_branch_status"
                  value={user.vendor_branch_status}
                  onChange={(e) => onChange1(e, index)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <div className="mt-4 text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              disabled={isButtonDisabled}
            >
              Update
            </button>
            <Link to="/vendor-list">
              <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                Back
              </button>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditVendor;
