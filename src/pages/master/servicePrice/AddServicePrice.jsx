import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSend, MdArrowBack } from "react-icons/md"; // React Icons for styling

import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import axios from "axios";
import { BASE_URL } from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import { Button, Input } from "@material-tailwind/react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";

const AddServicePrice = () => {
  const [services, setServices] = useState({
    service_id: "",
    service_sub_id: "",
    service_price_for: "",
    service_price_rate: "",
    service_price_amount: "",
    branch_id: "",
    service_weekend_amount: "",
    service_holiday_amount: "",
  });
  UseEscapeKey();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [serdatasub, setSerDataSub] = useState([]);
  const [serdata, setSerData] = useState([]);
  const [branch, setBranch] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchServicepriceData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/panel-fetch-branch`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBranch(response.data?.branch);
      } catch (error) {
        console.error("Error fetching branch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicepriceData();
  }, []);
  useEffect(() => {
    const fetchServicepriceData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSerData(response.data?.service);
      } catch (error) {
        console.error("Error fetching service data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicepriceData();
  }, []);

  useEffect(() => {
    if (!services.service_id) return; // Exit if undefined or null

    const fetchServicepricedData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-sub/` + services.service_id,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSerDataSub(response.data?.servicesub);
      } catch (error) {
        console.error("Error fetching service sub data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicepricedData();
  }, [services.service_id]);

  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt);

  const onInputChange = (e) => {
    const { name, value } = e.target;

    if (["service_price_rate", "service_price_amount"].includes(name)) {
      if (validateOnlyDigits(value)) {
        setServices((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setServices((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const data = new FormData();
    data.append("service_id", services.service_id);
    data.append("service_sub_id", services.service_sub_id);
    data.append("service_price_for", services.service_price_for);
    data.append("service_price_rate", services.service_price_rate);
    data.append("service_price_amount", services.service_price_amount);
    data.append("service_weekend_amount", services.service_weekend_amount);
    data.append("service_holiday_amount", services.service_holiday_amount);
    data.append("branch_id", services.branch_id);
    // panel-create-service
    // Submit logic goes here
    axios({
      url: BASE_URL + "/api/panel-create-service-price",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "200") {
        toast.success(res.data?.msg || "Service Price Create succesfull");

        setServices({
          service_id: "",
          service_sub_id: "",
          service_price_for: "",
          service_price_rate: "",
          service_price_amount: "",
        });
        navigate("/service-price");
      } else {
        toast.error(res.data?.msg || "Duplicate Entery ");
      }
    });
    setIsButtonDisabled(false);
  };

  return (
    <Layout>
      <MasterFilter />

      <PageHeader title={"Create Service Price"} />

      <div className="w-full mt-5 p-4 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <FormControl fullWidth>
              <InputLabel id="branch-select-label">
                <span className=" text-sm  bottom-[6px] relative  ">
                  Branch<span className="text-red-700">*</span>
                </span>
              </InputLabel>
              <Select
                sx={{ height: "40px", borderRadius: "5px" }}
                labelId="branch-select-label"
                id="branch-select"
                name="branch_id"
                value={services.branch_id}
                label="Branch"
                required
                onChange={onInputChange}
              >
                {branch.map((item) => (
                  <MenuItem key={item.id} value={String(item.id)}>
                    {item.branch_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                label="Service *"
                onChange={onInputChange}
                required
              >
                {serdata.map((serdatas) => (
                  <MenuItem key={serdatas.id} value={String(serdatas.id)}>
                    {serdatas.service}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="service-sub-select-label">
                <span className=" text-sm  bottom-[6px] relative  ">
                  Service Sub
                </span>
              </InputLabel>
              <Select
                sx={{ height: "40px", borderRadius: "5px" }}
                labelId="service-sub-select-label"
                id="service-sub-select"
                name="service_sub_id"
                value={services.service_sub_id}
                label="Service Sub"
                onChange={onInputChange}
              >
                {serdatasub.map((serdatas) => (
                  <MenuItem key={serdatas.id} value={String(serdatas.id)}>
                    {serdatas.service_sub}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Service Price For Field */}
            <div className="form-group">
              <Input
                label="Service Price For"
                type="text"
                name="service_price_for"
                value={services.service_price_for}
                onChange={onInputChange}
                required
                // className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Service Rate Field */}
            <div className="form-group">
              <Input
                label="Original Price"
                type="text"
                name="service_price_rate"
                value={services.service_price_rate}
                onChange={onInputChange}
                required
                // className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Service Amount Field */}
            <div className="form-group">
              <Input
                label="Discount Price"
                type="text"
                name="service_price_amount"
                value={services.service_price_amount}
                onChange={onInputChange}
                required
                // className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="form-group">
              <Input
                label="Holiday Price"
                type="text"
                name="service_holiday_amount"
                value={services.service_holiday_amount}
                onChange={onInputChange}
                required
                // className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="form-group">
              <Input
                label="Weekend Price"
                type="text"
                name="service_weekend_amount"
                value={services.service_weekend_amount}
                onChange={onInputChange}
                required
                // className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
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

export default AddServicePrice;
