import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaMobile,
  FaEnvelope,
  FaIdCard,
  FaFileAlt,
  FaClipboardList,
} from "react-icons/fa";
import { MdArrowBack, MdDescription, MdSend } from "react-icons/md";
import BASE_URL from "../../../base/BaseUrl";
import { Button, Input, Textarea } from "@material-tailwind/react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
const status = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const FieldTeamEditMaster = () => {
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
  });
  const navigate = useNavigate();
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // const validateOnlyDigits = (inputtxt) => {
  //   return /^\d+$/.test(inputtxt) || inputtxt.length === 0;
  // };

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  // const onInputChange = (e) => {
  //   const { name, value } = e.target;
  //   if (
  //     (name === "mobile" || name === "user_aadhar_no") &&
  //     !validateOnlyDigits(value)
  //   ) {
  //     return;
  //   }
  //   setTeam({ ...team, [name]: value });
  // };

  // const onInputChange = (e) => {
  //   const { name, value } = e.target;

  //   if (
  //     (name === "mobile" || name === "user_aadhar_no") &&
  //     !validateOnlyDigits(value)
  //   ) {
  //     return;
  //   }

  //   setTeam((prevState) => ({
  //     ...prevState,
  //     [name]: value || prevState[name],
  //   }));
  // };

  const onInputChange = (e) => {
    if (e.target.name == "mobile") {
      if (validateOnlyDigits(e.target.value)) {
        setTeam({
          ...team,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setTeam({
        ...team,
        [e.target.name]: e.target.value,
      });
    }
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
    if (!team.name || !team.mobile) {
      toast.error("Fill all required field");
      return;
    }

    setIsButtonDisabled(true);

    const data = new FormData();
    data.append("name", team.name);
    data.append("mobile", team.mobile);
    data.append("email", team.email);
    data.append("remarks", team.remarks);
    data.append("status", team.status);
    data.append("user_aadhar_no", team.user_aadhar_no);
    data.append("user_aadhar", selectedFile1);
    data.append("user_pancard_no", team.user_pancard_no);
    data.append("user_pancard", selectedFile2);
    data.append("user_type", team.user_type);

    axios({
      url: `${BASE_URL}/api/panel-update-admin-user/${id}?_method=PUT`,
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "200") {
        toast.success("update succesfull");
        navigate("/field-team");
      } else {
        toast.error("duplicate entry");
      }
    });

    // setIsButtonDisabled(false);
  };
  return (
    <Layout>
      <MasterFilter />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Field Team </h1>
        <form
          id="addIndiv"
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          autoComplete="off"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
            {/* Full Name Field */}
            <div>
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={team.name}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3 border border-gray-500 rounded-md  transition-all"
              />
            </div>

            {/* Mobile No Field */}
            <div>
              <Input
                label="Mobile No"
                type="text"
                name="mobile"
                value={team.mobile}
                onChange={onInputChange}
                maxLength={10}
                minLength={10}
                required
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>

            {/* Email Field */}
            <div>
              <Input
                label="Email Id"
                type="email"
                required
                name="email"
                value={team.email}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>

            {/* Aadhar No Field */}
            <div>
              <Input
                label="Aadhar No"
                type="text"
                name="user_aadhar_no"
                value={team.user_aadhar_no}
                onChange={onInputChange}
                maxLength={12}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>

            {/* Aadhar File Upload */}

            <div>
              <Input
                label="Aadhar File"
                type="file"
                name="user_aadhar"
                onChange={(e) => setSelectedFile1(e.target.files[0])}
                className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
              />
              <small className="text-gray-500">{team.user_aadhar}</small>
            </div>

            {/* Pancard No Field */}
            <div>
              <Input
                label="Pancard No"
                type="text"
                name="user_pancard_no"
                value={team.user_pancard_no}
                onChange={onInputChange}
                maxLength={10}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>

            {/* Pancard File Upload */}

            <div>
              <Input
                label="Pancard File"
                type="file"
                name="user_pancard"
                onChange={(e) => setSelectedFile2(e.target.files[0])}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
              <small className="text-gray-500">{team.user_pancard}</small>
            </div>

            {/* Status Dropdown */}

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
                name="status"
                value={team.status}
                onChange={onInputChange}
                label="Status *"
                required
              >
                {status.map((data) => (
                  <MenuItem key={data.value} value={data.value}>
                    {data.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Remarks Field */}

            <div className="col-span-3">
              <Textarea
                label="Remarks"
                name="remarks"
                value={team.remarks}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              ></Textarea>
            </div>
          </div>

          <div className="flex justify-center mt-6 space-x-4">
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

            <Link to="/field-team">
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

export default FieldTeamEditMaster;
