import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { useParams } from "react-router-dom";
import { Button, Card } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
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

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
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
      }
    };

    fetchServiceData();
  }, [id]);

  const onSubmit = (e) => {
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
            alert("Data Updated Successfully");
          } else {
            alert("Duplicate Entry");
          }
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  const imageUrl = services.service_image
    ? `https://agsdraft.online/app/storage/app/public/service/${services.service_image}`
    : "https://agsdraft.online/app/storage/app/public/no_image.jpg";

  return (
    <Layout>
      <MasterFilter />
      <div className="textfields-wrapper">
        <div className="my-4 text-2xl font-bold text-gray-800">
          Edit Service {id}
        </div>
        <Card className="p-6 mt-6">
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
              <div>
                <div className="mb-4">
                  <label className="text-gray-700">Service</label>
                  <input
                    type="text"
                    name="service"
                    value={services.service}
                    onChange={onInputChange}
                    disabled
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="text-gray-700">Service Commission</label>
                  <input
                    type="text"
                    name="service_comm"
                    value={services.service_comm}
                    onChange={onInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="text-gray-700">Image</label>
                  <input
                    type="file"
                    name="service_image"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-gray-700">Status</label>
                  <select
                    name="service_status"
                    value={services.service_status}
                    onChange={onInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
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
            {/* Buttons */}
            <div className="text-center mt-6">
              <Button
                type="submit"
                className="mr-4 mb-4"
                color="blue"
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Updating..." : "Update"}
              </Button>
              <Link>
                <Button className="mr-4 mb-4" color="green">
                  Back
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default ServiceEditMaster;
