import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Input } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import {BASE_URL, NO_IMAGE_URL, SERVICE_IMAGE_URL} from "../../../base/BaseUrl";
import axios from "axios";
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
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import LoaderComponent from "../../../components/common/LoaderComponent";
const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const ServiceEditMaster = () => {
  const { id } = useParams();
  const [services, setService] = useState({
    service: "",
    service_status: "",
    service_image: "",
    service_comm: "",
  });
  UseEscapeKey();
  const navigate = useNavigate();
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchloading, setFetchLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const validateOnlyDigits = (inputtxt) => {
    const phoneno = /^\d+$/;
    return inputtxt.match(phoneno) || inputtxt.length === 0;
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "service_comm" && !validateOnlyDigits(value)) return;

    setService({
      ...services,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchServiceData = async () => {
      setFetchLoading(true);

      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setService(
          response.data.service || {
            service: "",
            service_status: "",
            service_image: "",
            service_comm: "",
          }
        );
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);
  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/service?page=${pageNo}`);
  };
  const onSubmit = (e) => {
    setLoading(true);

    e.preventDefault();

    const data = new FormData();
    data.append("service", services.service);
    data.append("service_image", selectedFile);
    data.append("service_status", services.service_status);
    data.append("service_comm", services.service_comm);

    const form = document.getElementById("addIndiv");
    if (form.checkValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: `${BASE_URL}/api/panel-update-service/${id}?_method=PUT`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success(res.data?.msg || "update succesfull");
            navigate(`/service?page=${pageNo}`);
          } else {
            setLoading(false);
            setIsButtonDisabled(false);
            toast.error(res.data?.msg || "duplicate entry");
          }
        })
        .finally(() => {
          setIsButtonDisabled(false);
          setLoading(false);
        });
    }
  };

  const imageUrl = services.service_image
    ? `${SERVICE_IMAGE_URL}/${services.service_image}`
    : `${NO_IMAGE_URL}`;

  return (
    <Layout>
      <MasterFilter />
      <div className="textfields-wrapper">
        <PageHeader title={"Edit Service"} onClick={handleBack} />
        {fetchloading ? (
          <LoaderComponent />
        ) : (
          <Card className="p-6 mt-2">
            <form
              id="addIndiv"
              autoComplete="off"
              onSubmit={onSubmit}
              className="p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Service Image */}
                <div className="flex justify-center items-center">
                  <img src={imageUrl} alt="Service" className="w-52 h-52" />
                </div>
                {/* Service Fields */}
                <div className="p-2 ">
                  <div className="mb-6">
                    <Input
                      label="Service"
                      type="text"
                      name="service"
                      value={services.service}
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
                      name="service_image"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="w-full border border-gray-700 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
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
                        name="service_status"
                        value={services.service_status}
                        onChange={onInputChange}
                        label="Status *"
                        required
                      >
                        {statusOptions.map((data) => (
                          <MenuItem key={data.value} value={String(data.value)}>
                            {data.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
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
        )}
      </div>
    </Layout>
  );
};

export default ServiceEditMaster;
