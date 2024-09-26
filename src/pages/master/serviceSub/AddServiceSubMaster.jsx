import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSend, MdArrowBack } from "react-icons/md";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";

const AddServiceSubMaster = () => {
  const [services, setServices] = useState({
    service_id: "",
    service_sub: "",
    service_sub_image: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [serdata, setSerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchServiceSUbData = async () => {
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
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceSUbData();
    setLoading(false);
  }, []);

  const onInputChange = (e) => {
    setServices({
      ...services,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const data = new FormData();
    data.append("service_id", services.service_id);
    data.append("service_sub", services.service_sub);
    data.append("service_sub_image", selectedFile);

    axios({
      url: BASE_URL + "/api/panel-create-service-sub",
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
          service_sub: "",
          service_sub_image: "",
        });
        navigate("/service");
      } else {
        toast.error("duplicate entry");
      }
    });
    setIsButtonDisabled(false);
  };
  return (
    <Layout>
      <MasterFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Create Service Sub
        </h3>
      </div>
      <div className="w-full mt-5 p-4 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Service Select Field */}
            <div className="form-group">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Service<span className="text-red-700">*</span>
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

            {/* Service Sub Field */}
            <div className="form-group">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Service Sub <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                name="service_sub"
                value={services.service_sub}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* File Upload Field */}
            <div className="form-group">
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Image
              </label>
              <input
                type="file"
                name="service_sub_image"
                onChange={(e) => setSelectedFile(e.target.files[0])}
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
              <span>{isButtonDisabled ? "Submiting...." : "Submit"}</span>
            </button>

            {/* Back Button */}
            <Link to="/service-sub">
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

export default AddServiceSubMaster;
