import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, Input } from "@material-tailwind/react";
import { FiArrowLeft } from "react-icons/fi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaEdit, FaServicestack } from "react-icons/fa";
import {
  MdSubtitles,
  MdPriceCheck,
  MdOutlineRateReview,
  MdSend,
  MdArrowBack,
} from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
// import { BiStatus } from "react-icons/bi";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const ServicePriceEditMaster = () => {
  const { id } = useParams();
  UseEscapeKey();
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const [services, setService] = useState({
    service_id: "",
    service_sub_id: "",
    service_price_for: "",
    service_price_rate: "",
    service_price_amount: "",
    service_price_status: "",
  });

  const navigate = useNavigate();
  const [serdata, setSerData] = useState([]);
  const [serdatasub, setSerDataSub] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchloading, setFetchLoading] = useState(false);

  // Validation function
  const validateOnlyDigits = (inputtxt) =>
    /^\d+$/.test(inputtxt) || inputtxt.length === 0;

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (
      ["service_price_rate", "service_price_amount"].includes(name) &&
      !validateOnlyDigits(value)
    )
      return;

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
          `${BASE_URL}/api/panel-fetch-service-price-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setService(response.data.serviceprice);
      } catch (error) {
        console.error("Error fetching service price:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);

  useEffect(() => {
    const fetchServiceOptions = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSerData(response.data.service);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServiceOptions();
  }, []);

  useEffect(() => {
    if (services.service_id) {
      const fetchServiceSubOptions = async () => {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/panel-fetch-service-sub/${services.service_id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setSerDataSub(response.data.servicesub);
        } catch (error) {
          console.error("Error fetching service subs:", error);
        }
      };

      fetchServiceSubOptions();
    }
  }, [services.service_id]);
  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/service-price?page=${pageNo}`);
  };
  const onSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    const form = document.getElementById("editServiceForm");

    if (!form.checkValidity()) {
      toast.error("Fill all required");
    } else {
      setIsButtonDisabled(true);

      const data = new FormData();
      data.append("service_id", services.service_id);
      data.append("service_sub_id", services.service_sub_id);
      data.append("service_price_for", services.service_price_for);
      data.append("service_price_rate", services.service_price_rate);
      data.append("service_price_amount", services.service_price_amount);
      data.append("service_price_status", services.service_price_status);

      try {
        const response = await axios.post(
          `${BASE_URL}/api/panel-update-service-price/${id}?_method=PUT`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.code == "200") {
          toast.success(response.data?.msg || "update succesfull");
          navigate(`/service-price?page=${pageNo}`);
        } else {
          toast.error(response.data?.msg || "duplicate entry");
        }
      } catch (error) {
        console.error("Error updating service price:", error);
        alert("err, updating service price ");
        setLoading(false);
        setIsButtonDisabled(false);
      } finally {
        setLoading(false);
        setIsButtonDisabled(false);
      }
    }
  };
  return (
    <Layout>
      <MasterFilter />
      <PageHeader title={"Edit Service Price"} onClick={handleBack} />
      {fetchloading ? (
        <LoaderComponent />
      ) : (
        <Card className="p-4 sm:p-6 lg:p-8 mt-2">
          <form id="editServiceForm" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <div>
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
                      {serdata.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.service}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div>
                <FormControl fullWidth>
                  <InputLabel id="service-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Service Sub
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="service-select-label"
                    id="service-select"
                    name="service_sub_id"
                    value={services.service_sub_id}
                    onChange={onInputChange}
                    label="Service Sub *"
                  >
                    {serdatasub.map((subService) => (
                      <MenuItem key={subService.id} value={subService.id}>
                        {subService.service_sub}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div>
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
                    name="service_price_status"
                    value={services.service_price_status}
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

              <div>
                <Input
                  label=" Service Price For"
                  type="text"
                  name="service_price_for"
                  value={services.service_price_for}
                  onChange={onInputChange}
                  className="w-full pl-2 pr-4 py-2 border border-gray-300 rounded-md "
                  required
                />
              </div>

              <div>
                <Input
                  label="Service Rate"
                  type="text"
                  name="service_price_rate"
                  value={services.service_price_rate}
                  onChange={onInputChange}
                  className="w-full pl-2 pr-4 py-2 border border-gray-300 rounded-md "
                  required
                />
              </div>

              <div>
                <Input
                  label="Service Amount"
                  type="text"
                  name="service_price_amount"
                  value={services.service_price_amount}
                  onChange={onInputChange}
                  className="w-full pl-2 pr-4 py-2 border border-gray-300 rounded-md "
                  required
                />
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
                onClick={handleBack}
              />
            </div>
          </form>
        </Card>
      )}
    </Layout>
  );
};

export default ServicePriceEditMaster;
