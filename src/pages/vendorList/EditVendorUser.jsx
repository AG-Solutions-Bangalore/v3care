import { useContext, useEffect, useState } from "react";
import { MdSend } from "react-icons/md";

import Layout from "../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { ContextPanel } from "../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";

const EditVendorUser = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState({
    name: "",
    mobile: "",
    email: "",
    status: "",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const status = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];
  useEffect(() => {
    const fetchEditVendorUserData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-admin-user-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVendor(response.data?.adminUser);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEditVendorUserData();
    setLoading(false);
  }, []);

  const onInputChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    let data = {
      name: vendor.name,
      mobile: vendor.mobile,
      email: vendor.email,
      status: vendor.status,
      remarks: vendor.remarks,
    };
    const response = await axios.put(
      `${BASE_URL}/api/panel-update-vendor-user/${id}`,
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6 ">
          Edit Vendor User {id}{" "}
        </h1>
        <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-lg">
          <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group">
                <label className="block mb-2 text-sm font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={vendor.name}
                  onChange={onInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="form-group">
                <label className="block mb-2 text-sm font-medium">
                  Mobile No
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={vendor.mobile}
                  onChange={onInputChange}
                  required
                  maxLength="10"
                  minLength="10"
                  className="w-full px-4 py-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="form-group">
                <label className="block mb-2 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={vendor.email}
                  onChange={onInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="form-group">
                <label className="block mb-2 text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={vendor.status}
                  onChange={onInputChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {status.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-md shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 ease-in-out disabled:opacity-50"
                onClick={onSubmit}
                disabled={isButtonDisabled}
              >
                <MdSend className="w-5 h-5" />
                <span>Update</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditVendorUser;
