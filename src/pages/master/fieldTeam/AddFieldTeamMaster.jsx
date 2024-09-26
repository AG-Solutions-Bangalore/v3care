import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdSend, MdArrowBack } from "react-icons/md";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import BASE_URL from "../../../base/BaseUrl";

const AddFieldTeamMaster = () => {
  const [team, setTeam] = useState({
    name: "",
    mobile: "",
    email: "",
    branch_id: "",
    user_aadhar_no: "",
    user_aadhar: "",
    user_pancard_no: "",
    user_pancard: "",
    user_type: "1",
    remarks: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);

  const [branch, setBranch] = useState([]);
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(BASE_URL + "/api/panel-fetch-branch", requestOptions)
      .then((response) => response.json())
      .then((data) => setBranch(data.branch));
  }, []);

  const onInputChange = (e) => {
    setTeam({
      ...team,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const data = new FormData();
    data.append("name", team.name);
    data.append("mobile", team.mobile);
    data.append("email", team.email);
    data.append("remarks", team.remarks);
    data.append("branch_id", team.branch_id);
    data.append("user_type", team.user_type);
    data.append("user_aadhar_no", team.user_aadhar_no);
    data.append("user_aadhar", selectedFile1);
    data.append("user_pancard_no", team.user_pancard_no);
    data.append("user_pancard", selectedFile2);
    axios({
      url: BASE_URL + "/api/panel-create-admin-user",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "200") {
        alert("Data Inserted Sucessfully");
      } else {
        alert("Duplicate Entry");
      }
    });
  };
  return (
    <Layout>
      <MasterFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Create Field Team
        </h3>
      </div>
      <div className="w-full p-4 mt-2 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            {/* Full Name Field */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={team.name}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Mobile No Field */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Mobile No
              </label>
              <input
                type="text"
                name="mobile"
                value={team.mobile}
                onChange={onInputChange}
                maxLength={10}
                minLength={10}
                required
                className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Email Id Field */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Email Id
              </label>
              <input
                type="email"
                name="email"
                value={team.email}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Branch Select Field (conditional) */}
            {localStorage.getItem("user_type_id") === "6" && (
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Branch
                </label>
                <select
                  name="branch_id"
                  value={team.branch_id}
                  onChange={onInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  {branch.map((branchdata, key) => (
                    <option key={key} value={branchdata.id}>
                      {branchdata.branch_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Aadhar No Field */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Aadhar No
              </label>
              <input
                type="text"
                name="user_aadhar_no"
                value={team.user_aadhar_no}
                onChange={onInputChange}
                maxLength={12}
                className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Aadhar Photo Upload */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Aadhar Photo
              </label>
              <input
                type="file"
                name="user_aadhar"
                onChange={(e) => setSelectedFile1(e.target.files[0])}
                className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Pancard No Field */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Pancard No
              </label>
              <input
                type="text"
                name="user_pancard_no"
                value={team.user_pancard_no}
                onChange={onInputChange}
                maxLength={10}
                className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Pancard Photo Upload */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Pancard Photo
              </label>
              <input
                type="file"
                name="user_pancard"
                onChange={(e) => setSelectedFile2(e.target.files[0])}
                className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Remarks Field */}
            <div className="col-span-2">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={team.remarks}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              ></textarea>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            {/* Submit Button */}
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300"
              disabled={isButtonDisabled}
            >
              <MdSend className="w-5 h-5" />
              <span>Submit</span>
            </button>

            {/* Back Button */}
            <Link to="/listing">
              <button
                type="button"
                className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition-all duration-300"
              >
                <MdArrowBack className="w-5 h-5" />
                <span>Back</span>
              </button>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddFieldTeamMaster;
