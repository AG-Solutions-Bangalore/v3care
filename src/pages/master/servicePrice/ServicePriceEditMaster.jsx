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

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const ServicePriceEditMaster = () => {
  const { id } = useParams();

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

  const onSubmit = async (e) => {
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
          toast.success("update succesfull");
          navigate("/service-price");
        } else {
          toast.error("duplicate entry");
        }
      } catch (error) {
        console.error("Error updating service price:", error);
        alert("err, updating service price ");
      } finally {
        setIsButtonDisabled(false);
      }
    }
  };
  return (
    <Layout>
      <MasterFilter />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 text-2xl font-bold text-gray-800">
          Edit Service Price
        </div>

        <Card className="p-4 sm:p-6 lg:p-8">
          <form
            id="editServiceForm"
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <div>
                <div className="relative">
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
                <div className="relative">
                  <FormControl fullWidth>
                    <InputLabel id="service-select-label">
                      <span className="text-sm relative bottom-[6px]">
                        Service Sub <span className="text-red-700">*</span>
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
                      required
                    >
                      {serdatasub.map((subService) => (
                        <MenuItem key={subService.id} value={subService.id}>
                          {subService.service_sub}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div>
                <div className="relative ">
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
              </div>
            </div>

            <div>
              <div className="relative">
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
                <div className="relative mt-4">
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
              </div>

              <div>
                <div className="relative mt-6">
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
            </div>

            <div className="col-span-1 lg:col-span-2 flex flex-col sm:flex-row justify-center items-center mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                type="submit"
                className="mr-2 mb-2"
                color="primary"
                onClick={onSubmit}
                disabled={isButtonDisabled}
              >
                <div className="flex gap-1">
                  <MdSend className="w-4 h-4" />
                  <span>{isButtonDisabled ? "Updating..." : "Update"}</span>
                </div>
              </Button>

              <Link to="/service-price">
                <Button className="mr-2 mb-2" color="primary">
                  <div className="flex gap-1">
                    <MdArrowBack className="w-4 h-4" />
                    <span>Back</span>
                  </div>
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default ServicePriceEditMaster;
