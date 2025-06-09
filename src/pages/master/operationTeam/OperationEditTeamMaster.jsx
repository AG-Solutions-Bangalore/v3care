import { Card, Input, Textarea } from "@material-tailwind/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const status = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
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
const OperationEditTeamMaster = () => {
  const { id } = useParams();
  UseEscapeKey();
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
    view_branch_id: "",
    //new
    user_job_skills: null,
    user_designation: "",
    user_training: "",
    user_trained_bywhom: "",
    user_last_training: "",
    user_joinining_date: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchloading, setFetchLoading] = useState(false);

  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
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

        setTeam(normalizedData);
      })
      .catch((error) => {
        console.error("Error fetching admin user data:", error);
      })
      .finally(() => {
        setFetchLoading(false);
      });
  }, [id]);
  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/operation-team?page=${pageNo}`);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = document.getElementById("addIndiv");

    if (!form.checkValidity()) {
      toast.error("Fill all required fields");
      setLoading(false);
      return;
    }

    setIsButtonDisabled(true);

    try {
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
      data.append("view_branch_id", team.view_branch_id);

      //new
      data.append("user_designation", team.user_designation);
      data.append("user_job_skills", team.user_job_skills);
      data.append("user_training", team.user_training);
      data.append("user_trained_bywhom", team.user_trained_bywhom);
      data.append("user_last_training", team.user_last_training);
      data.append("user_joinining_date", team.user_joinining_date);

      const response = await axios.post(
        `${BASE_URL}/api/panel-update-admin-user/${id}?_method=PUT`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == "200") {
        toast.success(response.data?.msg || "Update successful");
        navigate(`/operation-team?page=${pageNo}`);
      } else {
        toast.error(response.data?.msg || "Duplicate entry");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <MasterFilter />
      <PageHeader title={"Edit Office Staff"} onClick={handleBack} />
      {fetchloading ? (
        <LoaderComponent />
      ) : (
        <div className="container mx-auto ">
          <Card className="p-6 mt-2">
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-4">
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
                    className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                  />
                </div>
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
                {/* <div>
                  <Input
                    label="Pancard No"
                    type="text"
                    name="user_pancard_no"
                    value={team.user_pancard_no}
                    onChange={onInputChange}
                    maxLength={10}
                    className="w-full px-4 py-3 border border-gray-400 rounded-md  transition-all"
                  />
                </div> */}
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
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default OperationEditTeamMaster;
