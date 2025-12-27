import { Input, Textarea } from "@material-tailwind/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const training = [
  {
    value: "Yes",
    label: "Yes",
  },
  {
    value: "No",
    label: "No",
  },
];

const AddOperationTeam = () => {
  const [team, setTeam] = useState({
    name: "",
    mobile: "",
    email: "",
    branch_id: "",
    user_aadhar_no: "",
    user_aadhar: "",
    user_pancard_no: "",
    user_pancard: "",
    user_type: "7",
    remarks: "",
    view_branch_id: "",
    user_job_skills: null,
    user_designation: "",
    user_training: "",
    user_trained_bywhom: "",
    user_last_training: "",
    user_joinining_date: "",
    // New fields
    user_image: "",
    user_bank_name: "",
    user_account_no: "",
    user_ifsc_code: "",
    user_branch_name: "",
    user_account_holder_name: "",
    user_alternate_name: "",
    user_alternate_mobile: "",
    user_refered_by: ""
  });

  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [selectedFile3, setSelectedFile3] = useState(null); // For user_image
  const userType = localStorage.getItem("user_type_id");
  
  UseEscapeKey();
  
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
    const { name, value } = e.target;
    
    // Validation for mobile, aadhar, and alternate mobile
    if (name === "mobile" || name === "user_aadhar_no" || name === "user_alternate_mobile") {
      const digitsOnly = value.replace(/\D/g, "");
      setTeam((prevTeam) => ({
        ...prevTeam,
        [name]: digitsOnly,
      }));
      return;
    }

    // Validation for PAN card (uppercase and alphanumeric)
    if (name === "user_pancard_no") {
      const input = value.toUpperCase();
      const allowed = /^[A-Z0-9]{0,10}$/;

      if (allowed.test(input)) {
        setTeam((prevTeam) => ({
          ...prevTeam,
          user_pancard_no: input,
        }));
      }
      return;
    }

    // Validation for IFSC code (uppercase and alphanumeric)
    if (name === "user_ifsc_code") {
      const input = value.toUpperCase();
      const allowed = /^[A-Z0-9]{0,11}$/;

      if (allowed.test(input)) {
        setTeam((prevTeam) => ({
          ...prevTeam,
          user_ifsc_code: input,
        }));
      }
      return;
    }

    // Validation for account number (digits only)
    if (name === "user_account_no") {
      const digitsOnly = value.replace(/\D/g, "");
      setTeam((prevTeam) => ({
        ...prevTeam,
        user_account_no: digitsOnly,
      }));
      return;
    }

    if (name === "branch_id") {
      setTeam((prevTeam) => ({
        ...prevTeam,
        branch_id: value,
        view_branch_id: value,
      }));
    } else {
      setTeam((prevTeam) => ({
        ...prevTeam,
        [name]: value,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setIsButtonDisabled(true);

    try {
      const data = new FormData();
      // Existing fields
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
      data.append("view_branch_id", team.view_branch_id);
      data.append("user_designation", team.user_designation);
      data.append("user_job_skills", team.user_job_skills);
      data.append("user_training", team.user_training);
      data.append("user_trained_bywhom", team.user_trained_bywhom);
      data.append("user_last_training", team.user_last_training);
      data.append("user_joinining_date", team.user_joinining_date);
      
      // New fields
      data.append("user_image", selectedFile3);
      data.append("user_bank_name", team.user_bank_name);
      data.append("user_account_no", team.user_account_no);
      data.append("user_ifsc_code", team.user_ifsc_code);
      data.append("user_branch_name", team.user_branch_name);
      data.append("user_account_holder_name", team.user_account_holder_name);
      data.append("user_alternate_name", team.user_alternate_name);
      data.append("user_alternate_mobile", team.user_alternate_mobile);
      data.append("user_refered_by", team.user_refered_by);

      const response = await axios.post(
        `${BASE_URL}/api/panel-create-admin-user`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == "200") {
        toast.success(response.data?.msg || "Create successful");

        setTeam({
          name: "",
          mobile: "",
          email: "",
          branch_id: "",
          user_aadhar_no: "",
          user_aadhar: "",
          user_pancard_no: "",
          user_pancard: "",
          user_type: "7",
          remarks: "",
          view_branch_id: "",
          user_job_skills: null,
          user_designation: "",
          user_training: "",
          user_trained_bywhom: "",
          user_last_training: "",
          user_joinining_date: "",
          user_image: "",
          user_bank_name: "",
          user_account_no: "",
          user_ifsc_code: "",
          user_branch_name: "",
          user_account_holder_name: "",
          user_alternate_name: "",
          user_alternate_mobile: "",
          user_refered_by: ""
        });

        // Reset file selections
        setSelectedFile1(null);
        setSelectedFile2(null);
        setSelectedFile3(null);

        navigate("/operation-team");
      } else {
        toast.error(response.data?.msg || "Duplicate entry");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error:", error);
      setLoading(false);
    } finally {
      setLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <MasterFilter />

      <PageHeader title={"Create Office Staff"} />

      <div className="w-full p-4 mt-2 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-4">
            {/* Full Name Field */}
            <div>
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={team.name}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3 border border-gray-500 rounded-md transition-all"
                maxLength={80}
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
                className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
              />
            </div>
            {/* Email Id Field */}
            <div>
              <Input
                label="Email Id"
                type="email"
                required
                name="email"
                value={team.email}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
              />
            </div>
            {/* Branch Select Field (conditional) */}
            {(userType == "6" || userType == "8") && (
              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Branch <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  name="branch_id"
                  value={team.branch_id}
                  onChange={onInputChange}
                  label="Branch *"
                  required
                >
                  {branch.map((branchdata) => (
                    <MenuItem key={branchdata.id} value={String(branchdata.id)}>
                      {branchdata.branch_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {/* Aadhar No Field */}
            <div>
              <Input
                label="Aadhar No"
                type="text"
                name="user_aadhar_no"
                value={team.user_aadhar_no}
                onChange={onInputChange}
                maxLength={12}
                className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
              />
            </div>
            {/* Aadhar Photo Upload */}
            <div>
              <Input
                label="Aadhar Photo"
                type="file"
                name="user_aadhar"
                onChange={(e) => setSelectedFile1(e.target.files[0])}
                className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
              />
            </div>
            {/* PAN Card Field */}
            <div>
              <InputMask
                mask="aaaaa 9999 a"
                value={team.user_pancard_no}
                onChange={onInputChange}
                name="user_pancard_no"
                formatChars={{
                  9: "[0-9]",
                  a: "[A-Z]",
                }}
              >
                {() => (
                  <div>
                    <Input
                      type="text"
                      label="PAN"
                      name="user_pancard_no"
                      className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                    />
                  </div>
                )}
              </InputMask>
            </div>
            {/* Pancard Photo Upload */}
            <div>
              <Input
                label="PAN Photo"
                type="file"
                name="user_pancard"
                onChange={(e) => setSelectedFile2(e.target.files[0])}
                className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
              />
            </div>
            {/* Designation Field */}
            <div>
              <Input
                label="Designation"
                name="user_designation"
                value={team.user_designation}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
              />
            </div>
            {/* Training Completed Field */}
            <FormControl fullWidth>
              <InputLabel id="user_training-label">
                <span className="text-sm relative bottom-[6px]">
                  Training Completed
                </span>
              </InputLabel>
              <Select
                sx={{ height: "40px", borderRadius: "5px" }}
                labelId="user_training-label"
                id="user_training"
                name="user_training"
                value={team.user_training}
                onChange={(e) => onInputChange(e)}
                label="Training Completed"
              >
                {training.map((item) => (
                  <MenuItem key={item.value} value={String(item.value)}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Trained By Field */}
            <div>
              <Input
                label="Trained By"
                name="user_trained_bywhom"
                value={team.user_trained_bywhom}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
              />
            </div>
            {/* Last Training Field */}
            <div>
              <Input
                label="Last Training"
                name="user_last_training"
                value={team.user_last_training}
                type="date"
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
              />
            </div>
            {/* Joining Date Field */}
            <div>
              <Input
                label="Joining Date"
                name="user_joinining_date"
                type="date"
                value={team.user_joinining_date}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
              />
            </div>
            {/* Remarks Field - Full width */}
            <div className="md:col-span-3">
              <Textarea
                label="Remarks"
                name="remarks"
                value={team.remarks}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                maxLength={980}
              ></Textarea>
            </div>
          </div>

          {/* Horizontal Rule */}
          <hr className="my-1 border-gray-300" />

          {/* New Additional Fields Section */}
          <div className="mt-1">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {/* User Image Upload */}
              <div>
                <Input
                  label="Profile Photo"
                  type="file"
                  name="user_image"
                  onChange={(e) => setSelectedFile3(e.target.files[0])}
                  className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                />
              </div>
               <div>
                <Input
                  label="Alternate Name"
                  name="user_alternate_name"
                  value={team.user_alternate_name}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                  maxLength={80}
                />
              </div>
              
              <div>
                <Input
                  label="Alternate Mobile"
                  name="user_alternate_mobile"
                  value={team.user_alternate_mobile}
                  onChange={onInputChange}
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                />
              </div>

                
              <div>
                <Input
                  label="Referred By"
                  name="user_refered_by"
                  value={team.user_refered_by}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                  maxLength={80}
                />
              </div>
              
             
              <div>
                <Input
                  label="Bank Name"
                  name="user_bank_name"
                  value={team.user_bank_name}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                  maxLength={80}
                />
              </div>
              
              <div>
                <Input
                  label="Account Number"
                  name="user_account_no"
                  value={team.user_account_no}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                  maxLength={20}
                />
              </div>
              
              <div>
                <Input
                  label="IFSC Code"
                  name="user_ifsc_code"
                  value={team.user_ifsc_code}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                  maxLength={11}
                />
              </div>
              
              <div>
                <Input
                  label="Branch Name"
                  name="user_branch_name"
                  value={team.user_branch_name}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                  maxLength={80}
                />
              </div>
              
              <div>
                <Input
                  label="Account Holder Name"
                  name="user_account_holder_name"
                  value={team.user_account_holder_name}
                  onChange={onInputChange}
                  className="w-full px-4 py-3 border border-gray-400 rounded-md transition-all"
                  maxLength={80}
                />
              </div>
              
             
              
              {/* Referral Section */}
             
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <ButtonConfigColor
              type="submit"
              buttontype="submit"
              label="Submit"
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

export default AddOperationTeam;