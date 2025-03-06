import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import MasterFilter from "../../../components/MasterFilter";
import { FaBuilding } from "react-icons/fa";
import { Button, Card, Input } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { ContextPanel } from "../../../utils/ContextPanel";
import { toast } from "react-toastify";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { MdArrowBack, MdSend } from "react-icons/md";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const BranchEditMaster = () => {
  const [branch, setBranch] = useState({
    branch_name: "",
    branch_status: "",
  });

  const [status, setStatus] = useState([
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ]);
  UseEscapeKey();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setBranch({
      ...branch,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
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
        setLoading(false);
      }
    };
    fetchBranchData();
    setLoading(false);
  }, []);
  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/branch?page=${pageNo}`);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    let data = {
      branch_name: branch.branch_name,
      branch_status: branch.branch_status,
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
      console.log("Form submitted", branch);
      if (response.data.code == "200") {
        toast.success("update succesfull");
        navigate(`/branch?page=${pageNo}`);
      } else {
        toast.error("duplicate entry");
      }
    } catch (error) {
      console.error("Error updating refer by", error);
      toast.error("Update failed. Please try again.");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <MasterFilter />
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="my-4 text-2xl font-bold text-gray-800">
          <FaBuilding className="inline mr-2" /> Edit Branch
        </div>

        <Card className="p-6 mt-6">
          <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch Name */}
              <div className="form-group">
                <Input
                  label="Branch"
                  type="text"
                  name="branch_name"
                  value={branch.branch_name}
                  onChange={onInputChange}
                  required
                  disabled
                  labelProps={{
                    className: "!text-gray-600 ",
                  }}
                />
              </div>

              {/* Branch Status */}

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

            {/* Buttons */}
            <div className="text-center mt-6">
              <Button
                type="submit"
                className="mr-2 mb-2"
                // color="primary"
                // disabled={isButtonDisabled}
              >
                <div className="flex gap-1">
                  <MdSend className="w-4 h-4" />
                  <span>Update</span>
                </div>
              </Button>

              <Button
                className="mr-2 mb-2"
                // color="primary"
                onClick={handleBack}
              >
                <div className="flex gap-1">
                  <MdArrowBack className="w-5 h-5" />
                  <span>Back</span>
                </div>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default BranchEditMaster;
