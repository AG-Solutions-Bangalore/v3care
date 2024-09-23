import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaMobile,
  FaEnvelope,
  FaIdCard,
  FaFileAlt,
  FaClipboardList,
} from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import BASE_URL from "../../../base/BaseUrl";
const status = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const BackhandEditTeamMaster = () => {
  const { id } = useParams();

  const [team, setTeam] = useState({
    name: "",
    mobile: "",
    email: "",
    remarks: "",
    status: "",
    user_aadhar_no: "",
    user_aadhar: "",
    user_pancard_no: "",
    user_pancard: "",
    user_type: "",
  });

  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const validateOnlyDigits = (inputtxt) => {
    return /^\d+$/.test(inputtxt) || inputtxt.length === 0;
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "mobile" || name === "user_aadhar_no") &&
      !validateOnlyDigits(value)
    ) {
      return;
    }
    setTeam({ ...team, [name]: value });
  };

  useEffect(() => {
    axios({
      url: `${BASE_URL}/api/panel-fetch-admin-user-by-id/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      setTeam(res.data.adminUser);
    });
  }, [id]);

  const onSubmit = (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");
    if (form.checkValidity()) {
      setIsButtonDisabled(true);
      const data = new FormData();
      Object.keys(team).forEach((key) => {
        data.append(key, team[key]);
      });
      data.append("user_aadhar", selectedFile1);
      data.append("user_pancard", selectedFile2);

      axios({
        url: `${BASE_URL}/api/panel-update-admin-user/${id}?_method=PUT`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code === "200") {
          alert("data update succesfully");
        } else {
          alert("duplicate entry");
        }
      });
    }
  };
  return (
    <Layout>
      <MasterFilter />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Backhand Team {id}</h1>
        <form
          id="addIndiv"
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Full Name Field */}
            <div className="relative">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-blue-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={team.name}
                  onChange={onInputChange}
                  disabled
                  required
                />
              </div>
            </div>

            {/* Mobile No Field */}
            <div className="relative">
              <label className="block text-gray-700  mb-2" htmlFor="mobile">
                Mobile No
              </label>
              <div className="relative">
                <FaMobile className="absolute top-3 left-3 text-blue-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Mobile No"
                  name="mobile"
                  value={team.mobile}
                  onChange={onInputChange}
                  maxLength={10}
                  minLength={10}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className="block text-gray-700  mb-2" htmlFor="email">
                Email Id
              </label>
              <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-blue-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  placeholder="Email Id"
                  name="email"
                  value={team.email}
                  onChange={onInputChange}
                />
              </div>
            </div>

            {/* Aadhar No Field */}
            <div className="relative">
              <label
                className="block text-gray-700  mb-2"
                htmlFor="user_aadhar_no"
              >
                Aadhar No
              </label>
              <div className="relative">
                <FaIdCard className="absolute top-3 left-3 text-blue-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Aadhar No"
                  name="user_aadhar_no"
                  value={team.user_aadhar_no}
                  onChange={onInputChange}
                  maxLength={12}
                />
              </div>
            </div>

            {/* Aadhar File Upload */}
            <div className="relative">
              <label
                className="block text-gray-700  mb-2"
                htmlFor="user_aadhar"
              >
                Aadhar File
              </label>
              <div className="relative">
                <FaFileAlt className="absolute top-3 left-3 text-blue-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="file"
                  name="user_aadhar"
                  onChange={(e) => setSelectedFile1(e.target.files[0])}
                />
              </div>
              <small className="text-gray-500">{team.user_aadhar}</small>
            </div>

            {/* Pancard No Field */}
            <div className="relative">
              <label
                className="block text-gray-700  mb-2"
                htmlFor="user_pancard_no"
              >
                Pancard No
              </label>
              <div className="relative">
                <FaIdCard className="absolute top-3 left-3 text-blue-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Pancard No"
                  name="user_pancard_no"
                  value={team.user_pancard_no}
                  onChange={onInputChange}
                  maxLength={10}
                />
              </div>
            </div>

            {/* Pancard File Upload */}
            <div className="relative">
              <label
                className="block text-gray-700  mb-2"
                htmlFor="user_pancard"
              >
                Pancard File
              </label>
              <div className="relative">
                <FaFileAlt className="absolute top-3 left-3 text-blue-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="file"
                  name="user_pancard"
                  onChange={(e) => setSelectedFile2(e.target.files[0])}
                />
              </div>
              <small className="text-gray-500">{team.user_pancard}</small>
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <label className="block text-gray-700 mb-2" htmlFor="status">
                Status
              </label>
              <div className="relative">
                <FaClipboardList className="absolute top-3 left-3 text-blue-400" />
                <select
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="status"
                  value={team.status}
                  onChange={onInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  {status.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Remarks Field */}
            <div className="relative col-span-full">
              <label className="block text-gray-700  mb-2" htmlFor="remarks">
                Remarks
              </label>
              <div className="relative">
                <MdDescription className="absolute top-3 left-3 text-blue-400" />
                <textarea
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Remarks"
                  name="remarks"
                  value={team.remarks}
                  onChange={onInputChange}
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6 space-x-4">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={onSubmit}
              disabled={isButtonDisabled}
            >
              Update
            </button>
            <Link
              to="/field-team"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BackhandEditTeamMaster;
