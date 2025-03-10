import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { useNavigate, useParams } from "react-router-dom";
import { FaBuilding } from "react-icons/fa";
import { Button, Card, Input } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { ContextPanel } from "../../../utils/ContextPanel";
import { toast } from "react-toastify";
import { MdArrowBack, MdSend } from "react-icons/md";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import PageHeader from "../../../components/common/PageHeader/PageHeader";

const ReferByEditMaster = () => {
  const [referBy, setReferBy] = useState({
    refer_by: "",
    refer_by_status: "",
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
    setReferBy({
      ...referBy,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchReferByData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-referby-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReferBy(response.data?.referby);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReferByData();
    setLoading(false);
  }, [id]);
  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/refer-by?page=${pageNo}`);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    let data = {
      refer_by: referBy.refer_by,
      refer_by_status: referBy.refer_by_status,
    };

    setIsButtonDisabled(true);

    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-referby/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Update successful");
      navigate(`/refer-by?page=${pageNo}`);
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
      <PageHeader title={"Edit Refer By"} onClick={handleBack} />

      <div className="container mx-auto ">
        <Card className="p-6 mt-2">
          <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch Name */}
              <div className="form-group">
                <Input
                  label="Refer By"
                  type="text"
                  name="refer_by"
                  value={referBy.refer_by}
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
                  name="refer_by_status"
                  value={referBy.refer_by_status}
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
                color="primary"
                // disabled={isButtonDisabled}
              >
                <div className="flex gap-1">
                  <MdSend className="w-4 h-4" />
                  <span>Update</span>
                </div>
              </Button>

              <Button
                onClick={handleBack}
                className="mr-2 mb-2"
                color="primary"
              >
                <div className="flex gap-1">
                  <MdArrowBack className="w-4 h-4" />
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

export default ReferByEditMaster;
