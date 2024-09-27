import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSend, MdArrowBack } from "react-icons/md"; // React Icons for styling

import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Input } from "@material-tailwind/react";

const AddServiceMaster = () => {
  const [services, setServices] = useState({
    service: "",
    service_comm: "",
    service_image: "",
  });
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // Validation function
  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (["service_comm"].includes(name)) {
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
    data.append("service", services.service);
    data.append("service_image", selectedFile);
    data.append("service_comm", services.service_comm);

    axios({
      url: BASE_URL + "/api/panel-create-service",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "200") {
        toast.success("Branch Create succesfull");

        setServices({
          service: "",
          service_comm: "",
          service_image: "",
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
          Create Service
        </h3>
      </div>
      <div className="w-full mt-5 mx-auto p-8 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Service Field */}
            <div className="form-group">
              <Input
                label="service"
                type="text"
                name="service"
                value={services.service}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none   transition-all duration-300 shadow-sm"
              />
            </div>

            {/* Service Commission Field */}
            <div className="form-group">
              <Input
                label="service commission"
                type="tel"
                name="service_comm"
                value={services.service_comm}
                onChange={onInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none  transition-all duration-300 shadow-sm"
              />
            </div>

            {/* File Upload Field */}
            <div className="form-group">
              <Input
                label="service image"
                type="file"
                name="service_image"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full px-4 pb-2 border border-gray-300 rounded-md focus:outline-none  transition-all duration-300 shadow-sm"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            {/* Submit Button */}

            <Button
              type="submit"
              className="mr-2 mb-2"
              color="primary"
              disabled={isButtonDisabled}
            >
              <div className="flex gap-1">
                <MdSend className="w-4 h-4" />
                <span>{isButtonDisabled ? "Submiting..." : "Submit"}</span>
              </div>
            </Button>

            {/* Back Button */}
            <Link to="/service">
              <Button className="mr-2 mb-2" color="primary">
                <div className="flex gap-1">
                  <MdArrowBack className="w-4 h-4" />
                  <span>Back</span>
                </div>
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddServiceMaster;
