import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Input } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
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
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const ServiceSubEditMaster = () => {
  const { id } = useParams();
  const [services, setService] = useState({
    service_id: "",
    service_sub: "",
    service_sub_status: "",
    service_sub_image: "",
  });
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  UseEscapeKey();
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [serdata, setSerData] = useState([]);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-sub-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setService(response.data.servicesub);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    fetchServiceData();
  }, [id]);

  useEffect(() => {
    const fetchServiceOptions = async () => {
      const response = await axios.get(`${BASE_URL}/api/panel-fetch-service`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSerData(response.data.service);
    };

    fetchServiceOptions();
  }, []);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setService({
      ...services,
      [name]: value,
    });
  };
  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/service-sub?page=${pageNo}`);
  };
  const onSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    const data = new FormData();
    data.append("service_id", services.service_id);
    data.append("service_sub", services.service_sub);
    data.append("service_sub_image", selectedFile);
    data.append("service_sub_status", services.service_sub_status);

    const form = document.getElementById("addIndiv");
    if (form.checkValidity()) {
      setIsButtonDisabled(true);

      try {
        const res = await axios.post(
          `${BASE_URL}/api/panel-update-service-sub/${id}?_method=PUT`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.code == "200") {
          toast.success("Branch Create succesfull");

          navigate(`/service-sub?page=${pageNo}`);
        } else {
          toast.error("duplicate entry");
        }
      } catch (error) {
        console.error("Error updating service:", error);
        setLoading(false);
        setIsButtonDisabled(false);
      } finally {
        setIsButtonDisabled(false);
        setLoading(false);
      }
    }
  };

  const imageUrl = services.service_sub_image
    ? `https://agsdraft.online/app/storage/app/public/service_sub/${services.service_sub_image}`
    : "https://agsdraft.online/app/storage/app/public/no_image.jpg";

  return (
    <Layout>
      <MasterFilter />
      <PageHeader title={"Edit Service Sub"} onClick={handleBack} />

      <Card className="p-6 mt-2">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div className="flex justify-center items-center">
              <img src={imageUrl} alt="Service" className="w-52 h-52" />
            </div>
            <div className=" p-2 ">
              <div className="mb-6">
                <FormControl fullWidth>
                  <InputLabel id="service-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Service <span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="service-select-label"
                    id="service-select"
                    name="service_id"
                    value={services.service_id}
                    onChange={onInputChange}
                    label="Service *"
                    required
                  >
                    {serdata.map((ser, key) => (
                      <MenuItem key={key} value={ser.id}>
                        {ser.service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="mb-6">
                <Input
                  label="Service Sub"
                  type="text"
                  name="service_sub"
                  value={services.service_sub}
                  onChange={onInputChange}
                  required
                  disabled
                  labelProps={{
                    className: "!text-gray-600   ",
                  }}
                />
              </div>
              <div className="mb-6">
                <Input
                  label="Image"
                  type="file"
                  name="service_sub_image"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-6">
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
                    name="service_sub_status"
                    value={services.service_sub_status}
                    onChange={onInputChange}
                    label="Status *"
                    required
                  >
                    {statusOptions.map((data) => (
                      <MenuItem key={data.value} value={data.value}>
                        {data.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          {/* <div className="text-center mt-6">
            <Button
              type="submit"
              className="mr-2 mb-2"
            >
              <div className="flex gap-1">
                <MdSend className="w-4 h-4" />
                <span>Update</span>
              </div>
            </Button>

            <Button className="mr-2 mb-2" onClick={handleBack}>
              <div className="flex gap-1">
                <MdArrowBack className="w-4 h-4" />
                <span>Back</span>
              </div>
            </Button>
          </div> */}
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
    </Layout>
  );
};

export default ServiceSubEditMaster;
