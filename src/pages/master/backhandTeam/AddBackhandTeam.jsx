import { Input, Textarea } from "@material-tailwind/react";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { toast } from "react-toastify";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import InputMask from "react-input-mask";
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
const AddBackhandTeam = () => {
  const [team, setTeam] = useState({
    name: "",
    mobile: "",
    email: "",
    branch_id: "",
    user_aadhar_no: "",
    user_aadhar: "",
    user_pancard_no: "",
    user_pancard: "",
    user_type: "5",
    remarks: "",
    //new
    user_job_skills: null,
    user_designation: "",
    user_training: "",
    user_trained_bywhom: "",
    user_last_training: "",
    user_joinining_date: "",
  });
  const navigate = useNavigate();
  const [ViewBranchId, setViewBranchId] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [loading, setLoading] = useState(false);
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
  const validateOnlyDigits = (inputtxt) => {
    return /^\d+$/.test(inputtxt) || inputtxt.length === 0;
  };
  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (
      (name == "mobile" || name == "user_aadhar_no") &&
      !validateOnlyDigits(value)
    ) {
      return;
    }
    setTeam({ ...team, [name]: value });
  };
  const handleChange = (newValue) => {
    setViewBranchId(newValue);
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setIsButtonDisabled(true);
    const selectedServiceValues = ViewBranchId.map(
      (service) => service.id
    ).join(",");
    try {
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
      data.append("view_branch_id", selectedServiceValues);
      //new
      data.append("user_designation", team.user_designation);
      data.append("user_job_skills", team.user_job_skills);
      data.append("user_training", team.user_training);
      data.append("user_trained_bywhom", team.user_trained_bywhom);
      data.append("user_last_training", team.user_last_training);
      data.append("user_joinining_date", team.user_joinining_date);
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
        toast.success(response.data?.msg || "Create successful!");

        // Reset form fields
        setTeam({
          name: "",
          mobile: "",
          email: "",
          branch_id: "",
          user_aadhar_no: "",
          user_aadhar: "",
          user_pancard_no: "",
          user_pancard: "",
          user_type: "5",
          remarks: "",
        });

        // Navigate to the next page
        navigate("/backhand-team");
      } else {
        toast.error(response.data?.msg || "Duplicate Entry");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    } finally {
      // Re-enable button after request completes
      setLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <MasterFilter />
      <PageHeader title={"Create Admin"} />
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
                maxLength={80}
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
            {/* Email Id Field */}
            <div>
              <Input
                label="Email Id"
                type="email"
                name="email"
                required
                value={team.email}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>
            {/* Branch Select Field (conditional) */}
            {(userType == "6" || userType == "8") && (
              <>
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
                      <MenuItem
                        key={branchdata.id}
                        value={String(branchdata.id)}
                      >
                        {branchdata.branch_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={branch}
                    value={ViewBranchId}
                    disableCloseOnSelect
                    getOptionLabel={(option) =>
                      option.service ?? option.branch_name
                    }
                    onChange={(event, newValue) => handleChange(newValue)}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.service ?? option.branch_name}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            Choose Branch{" "}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        InputProps={{
                          ...params.InputProps,
                          style: { padding: "0px" },
                        }}
                        inputProps={{
                          ...params.inputProps,
                          style: { padding: "10px" },
                        }}
                      />
                    )}
                  />
                </Box>
              </>
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
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
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
                      className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
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
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>
            <div>
              <Input
                label="Designation"
                name="user_designation"
                value={team.user_designation}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>
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
            </FormControl>{" "}
            {/* Remarks Field */}
            <div>
              <Input
                label="Trained By"
                name="user_trained_bywhom"
                value={team.user_trained_bywhom}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>
            <div>
              <Input
                label="Last Training"
                name="user_last_training"
                value={team.user_last_training}
                type="date"
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>
            <div>
              <Input
                label="Joining Date"
                name="user_joinining_date"
                type="date"
                value={team.user_joinining_date}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>
            {/* Remarks Field */}
            <div className="col-span-2">
              <Textarea
                label="Remarks"
                name="remarks"
                value={team.remarks}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              ></Textarea>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
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

export default AddBackhandTeam;
