import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSend, MdArrowBack } from "react-icons/md"; // React Icons for styling

import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";

const AddServicePrice = () => {
  const [services, setServices] = useState({
    service_id: "",
    service_sub_id: "",
    service_price_for: "",
    service_price_rate: "",
    service_price_amount: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [serdatasub, setSerDataSub] = useState([]);
  const [serdata, setSerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchServicepriceData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
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
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchServicepricedData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
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
    setLoading(false);
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

  // const onInputChange = (e) => {
  //   setServices({
  //     ...services,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const data = new FormData();
    data.append("service_id", services.service_id);
    data.append("service_sub_id", services.service_sub_id);
    data.append("service_price_for", services.service_price_for);
    data.append("service_price_rate", services.service_price_rate);
    data.append("service_price_amount", services.service_price_amount);
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
        toast.success("Branch Create succesfull");

        setServices({
          service_id: "",
          service_sub_id: "",
          service_price_for: "",
          service_price_rate: "",
          service_price_amount: "",
        });
        navigate("/service-price");
      } else {
        alert("Duplicate Entry");
      }
    });
    setIsButtonDisabled(false);
  };

  return (
    <Layout>
      <MasterFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Create Service Price
        </h3>
      </div>
      <div className="w-full mt-5 p-4 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Service Select Field */}
            <div className="form-group">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Service <span className="text-red-700">*</span>
              </label>
              <select
                name="service_id"
                value={services.service_id}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {serdata.map((serdatas, key) => (
                  <option key={key} value={serdatas.id}>
                    {serdatas.service}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Sub Select Field */}
            <div className="form-group">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Service Sub
              </label>
              <select
                name="service_sub_id"
                value={services.service_sub_id}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {serdatasub.map((serdatas, key) => (
                  <option key={key} value={serdatas.id}>
                    {serdatas.service_sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Price For Field */}
            <div className="form-group">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Service Price For<span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                name="service_price_for"
                value={services.service_price_for}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Service Rate Field */}
            <div className="form-group">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Service Rate<span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                name="service_price_rate"
                value={services.service_price_rate}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Service Amount Field */}
            <div className="form-group">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Service Amount<span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                name="service_price_amount"
                value={services.service_price_amount}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            {/* Submit Button */}
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300"
              disabled={isButtonDisabled}
            >
              <MdSend className="w-5 h-5" />
              <span>{isButtonDisabled ? "Submiting..." : "Submit"}</span>
            </button>

            {/* Back Button */}
            <Link to="/service-price">
              <button
                type="button"
                className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition-all duration-300"
              >
                <MdArrowBack className="w-5 h-5" />
                <span>Back</span>
              </button>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddServicePrice;
