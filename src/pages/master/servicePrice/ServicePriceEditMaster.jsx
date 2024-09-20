import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Button, Card } from "@material-tailwind/react";
import { FiArrowLeft } from "react-icons/fi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaEdit, FaServicestack } from "react-icons/fa";
import { MdSubtitles, MdPriceCheck, MdOutlineRateReview } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
// import { BiStatus } from "react-icons/bi";
import BASE_URL from "../../../base/BaseUrl";

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

    if (form.checkValidity()) {
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
          alert("data update succesfully");
        } else {
          alert("duplicate entery");
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
          Edit Service Price {id}
        </div>

        <Card className="p-4 sm:p-6 lg:p-8">
          <form
            id="editServiceForm"
            onSubmit={onSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Service</label>
                <div className="relative">
                  <FaServicestack className="absolute top-3 left-3 text-gray-400" />
                  <select
                    name="service_id"
                    value={services.service_id}
                    onChange={onInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="">Select Service</option>
                    {serdata.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Service Sub</label>
                <div className="relative">
                  <MdSubtitles className="absolute top-3 left-3 text-gray-400" />
                  <select
                    name="service_sub_id"
                    value={services.service_sub_id}
                    onChange={onInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Sub Service</option>
                    {serdatasub.map((subService) => (
                      <option key={subService.id} value={subService.id}>
                        {subService.service_sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Service Price For
                </label>
                <div className="relative">
                  <MdPriceCheck className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    name="service_price_for"
                    value={services.service_price_for}
                    onChange={onInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Service Rate</label>
                <div className="relative">
                  <MdOutlineRateReview className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    name="service_price_rate"
                    value={services.service_price_rate}
                    onChange={onInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  Service Amount
                </label>
                <div className="relative">
                  <RiMoneyDollarCircleLine className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    name="service_price_amount"
                    value={services.service_price_amount}
                    onChange={onInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Status</label>
                <div className="relative">
                  <FaEdit className="absolute top-3 left-3 text-gray-400" />
                  <select
                    name="service_price_status"
                    value={services.service_price_status}
                    onChange={onInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                    required
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-2 flex flex-col sm:flex-row justify-center items-center mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                className={`w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center justify-center ${
                  isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={onSubmit}
                disabled={isButtonDisabled}
              >
                <AiOutlineCloudUpload className="mr-2" size={20} />
                Submit
              </Button>

              <Link to="/service-price" className="w-full sm:w-auto">
                <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center justify-center">
                  <FiArrowLeft className="mr-2" size={20} />
                  Cancel
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
