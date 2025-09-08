import { Input, Textarea } from "@material-tailwind/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import LoaderComponent from "../../../components/common/LoaderComponent";

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
const AddFieldTeamMaster = () => {
  const location = useLocation();
const id = location.state?.id; 
const [fetchLoading, setFetchLoading] = useState(false);
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
    view_branch_id: "",

    //new
    user_job_skills: "",
    user_designation: null,
    user_training: "",
    user_trained_bywhom: "",
    user_last_training: "",
    user_joinining_date: "",
  });
  const navigate = useNavigate();
  UseEscapeKey();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [loading, setLoading] = useState(false);
  const userType = localStorage.getItem("user_type_id");
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
useEffect(() => {
  if (!id) return; 
  setFetchLoading(true);
  axios({
    url: `${BASE_URL}/api/panel-fetch-admin-user-by-id/${id}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => {
      const rawData = res?.data?.adminUser || {};
      const normalizedData = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => {
          if (value === null || value === "null") return [key, ""];
          return [key, value];
        })
      );

      setTeam((prev) => ({ ...prev, ...normalizedData }));
    })
    .catch((error) => {
      console.error("Error fetching admin user data:", error);
    })
    .finally(() => {
      setFetchLoading(false);
    });
}, [id]);
 
  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile" || name == "user_aadhar_no") {
      const digitsOnly = value.replace(/\D/g, "");
      setTeam((prevTeam) => ({
        ...prevTeam,
        [name]: digitsOnly,
      }));
      return;
    }

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

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

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
    data.append("view_branch_id", team.view_branch_id);
    data.append("user_pancard", selectedFile2);
    //new
    data.append("user_designation", team.user_designation);
    data.append("user_job_skills", team.user_job_skills);
    data.append("user_training", team.user_training);
    data.append("user_trained_bywhom", team.user_trained_bywhom);
    data.append("user_last_training", team.user_last_training);
    data.append("user_joinining_date", team.user_joinining_date);
    axios({
      url: BASE_URL + "/api/panel-create-admin-userD",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "200") {
        toast.success(res.data?.msg || "Create succesfull");

        setTeam({
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
        // navigate("/field-team");
        navigate(-1)
      } else {
        toast.error(res.data?.msg || "duplicate entry");
        setLoading(false);
      }
    });
    setIsButtonDisabled(false);
    setLoading(false);
  };
  return (
    <Layout>
      <MasterFilter />

   <PageHeader title={id ? "Transfer Field Team" : "Create Field Team"} />
  {fetchLoading ? (
        <LoaderComponent />
      ) : (
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
            <div>
              <Input
                label="Email Id"
                type="email"
                name="email"
                required
                value={team.email}
                onChange={onInputChange}
                maxLength={50}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>
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
                <small className="text-gray-500">{team.user_aadhar}</small>
            </div>
            {/* Pancard No Field */}
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
              />
                <small className="text-gray-500">{team.user_pancard}</small>
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
            <div className="col-span-2">
              <Textarea
                label="Job Skills"
                name="user_job_skills"
                value={team.user_job_skills}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              />
            </div>{" "}
            <div className="col-span-2">
              <Textarea
                label="Remarks"
                name="remarks"
                value={team.remarks}
                onChange={onInputChange}
                maxLength={950}
                className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
              ></Textarea>
            </div>
          </div>

          {/* <div className="flex justify-center space-x-4">

            <Button
              type="submit"
              className="mr-2 mb-2"
              color="primary"
            >
              <div className="flex gap-1">
                <MdSend className="w-4 h-4" />
                <span>Submit</span>
              </div>
            </Button>


            <Link to="/field-team">
              <Button className="mr-2 mb-2" color="primary">
                <div className="flex gap-1">
                  <MdArrowBack className="w-5 h-5" />
                  <span>Back</span>
                </div>
              </Button>
            </Link>
          </div> */}
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
         )}
    </Layout>
  );
};

export default AddFieldTeamMaster;
