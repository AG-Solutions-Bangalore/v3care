import { Card, Input } from "@material-tailwind/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const BranchEditMaster = () => {
  const [branch, setBranch] = useState({
    branch_name: "",
    branch_status: "",
    branch_pincode: "",
    branch_state_name: "",
    branch_contact_person: "",
    branch_contact_no: "",
  });

  const status = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];
  UseEscapeKey();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [fetchloading, setFetchLoading] = useState(false);

  // const onInputChange = (e) => {
  //   setBranch({
  //     ...branch,
  //     [e.target.name]: e.target.value,
  //   });
  // };
  const onInputChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "branch_pincode" || name === "branch_contact_no") {
      newValue = value.replace(/\D/g, "");
    }

    setBranch({
      ...branch,
      [name]: newValue,
    });
  };
  useEffect(() => {
    const fetchBranchData = async () => {
      setFetchLoading(true);

      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-branch-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBranch(response.data?.branch);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchBranchData();
  }, []);
  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/branch?page=${pageNo}`);
  };
  const onSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    let data = {
      branch_name: branch.branch_name,
      branch_status: branch.branch_status,
      branch_pincode: branch.branch_pincode,
      branch_state_name: branch.branch_state_name,
      branch_contact_person: branch.branch_contact_person,
      branch_contact_no: branch.branch_contact_no,
    };

    setIsButtonDisabled(true);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-branch/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.code == "200") {
        toast.success(response.data?.msg || "update succesfull");
        navigate(`/branch?page=${pageNo}`);
      } else {
        toast.error(response.data?.msg || "duplicate entry");
      }
    } catch (error) {
      console.error("Error updating refer by", error);
      toast.error("Update failed. Please try again.");
      setLoading(false);
    } finally {
      setIsButtonDisabled(false);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <MasterFilter />
      <div className="container mx-auto">
        <PageHeader title={" Edit Branch"} onClick={handleBack} />
        {fetchloading ? (
          <LoaderComponent />
        ) : (
          <Card className="p-6 mt-6">
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {/* Branch Name Field */}
                <Input
                  fullWidth
                  label="Branch Name"
                  required
                  name="branch_name"
                  maxLength={80}
                  value={branch.branch_name}
                  onChange={onInputChange}
                />
                <Input
                  fullWidth
                  label="Pincode"
                  name="branch_pincode"
                  maxLength={6}
                  value={branch.branch_pincode}
                  onChange={onInputChange}
                />
                <Input
                  fullWidth
                  label="State Name"
                  name="branch_state_name"
                  maxLength={80}
                  value={branch.branch_state_name}
                  onChange={onInputChange}
                />
                <Input
                  fullWidth
                  label="Contact Person"
                  name="branch_contact_person"
                  maxLength={80}
                  value={branch.branch_contact_person}
                  onChange={onInputChange}
                />
                <Input
                  fullWidth
                  label="Contact No"
                  name="branch_contact_no"
                  maxLength={10}
                  value={branch.branch_contact_no}
                  onChange={onInputChange}
                />
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
                    name="branch_status"
                    value={branch.branch_status}
                    onChange={onInputChange}
                    label="Status *"
                    required
                  >
                    {status.map((data) => (
                      <MenuItem key={data.value} value={String(data.value)}>
                        {data.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                  onClick={handleBack}
                />
              </div>
            </form>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default BranchEditMaster;
