import { Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  BASE_URL,
  NO_IMAGE_URL,
  RIGHTSIDEBAR_IMAGE,
} from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import MasterFilter from "../../../components/MasterFilter";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  Switch,
} from "@mui/material";

const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "40px",
    height: "auto",
    borderRadius: "0.375rem",
    borderColor: "#e5e7eb",
    paddingTop: "2px",
    paddingBottom: "2px",
    "&:hover": {
      borderColor: "#9ca3af",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "auto",
    padding: "4px 8px",
    flexWrap: "wrap",
    gap: "4px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "40px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#3b82f6" : "white",
    color: state.isSelected ? "white" : "#1f2937",
    "&:hover": {
      backgroundColor: "#e5e7eb",
    },
  }),
};

const EditRightSidebar = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    service_id: [],
    service_sub_id: [],
    serviceDetails_name: "",
    serviceDetails: "",
    serviceDetails_image: null,
    serviceDetails_status: "Active",
  });

  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [initialImage, setInitialImage] = useState(null);
  const navigate = useNavigate();

  UseEscapeKey();

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setServices(response.data?.service || []);
      } catch (error) {
        console.error("Error fetching services", error);
        toast.error("Failed to load services");
      }
    };
    fetchServices();
  }, []);

  // Fetch sub services
  useEffect(() => {
    const fetchSubServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-sub-new`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubServices(response.data?.servicesub || []);
      } catch (error) {
        console.error("Error fetching sub services", error);
        toast.error("Failed to load sub services");
      }
    };
    fetchSubServices();
  }, []);

  // Fetch service details by ID
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-details-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.servicedetails;
        setFormData({
          // service_id: data.service_id.split(",").map(Number),
          // service_sub_id: data.service_sub_id.split(",").map(Number),
          service_id: data.service_id
            ? data.service_id.split(",").map(Number)
            : [],
          service_sub_id: data.service_sub_id
            ? data.service_sub_id.split(",").map(Number)
            : [],

          serviceDetails_name: data.serviceDetails_name,
          serviceDetails: data.serviceDetails,
          serviceDetails_image: null,
          serviceDetails_status: data.serviceDetails_status,
        });

        if (data.serviceDetails_image) {
          setInitialImage(`${RIGHTSIDEBAR_IMAGE}/${data.serviceDetails_image}`);
          setPreviewImage(`${RIGHTSIDEBAR_IMAGE}/${data.serviceDetails_image}`);
        } else {
          setPreviewImage(NO_IMAGE_URL);
        }
      } catch (error) {
        console.error("Error fetching service details", error);
        toast.error("Failed to load service details");
      }
    };

    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, serviceDetails_image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      service_id: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleSubServiceChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      service_sub_id: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      serviceDetails_status: e.target.checked ? "Active" : "Inactive",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsButtonDisabled(true);

    const data = new FormData();
    data.append("id", id);
    data.append("service_id", formData.service_id.join(","));
    data.append("service_sub_id", formData.service_sub_id.join(","));
    data.append("serviceDetails_name", formData.serviceDetails_name);
    data.append("serviceDetails", formData.serviceDetails);
    data.append("serviceDetails_status", formData.serviceDetails_status);

    if (formData.serviceDetails_image) {
      data.append("serviceDetails_image", formData.serviceDetails_image);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/panel-update-service-details/${id}?_method=PUT`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.code === 200) {
        toast.success(response.data.msg);
        navigate(-1);
      } else {
        toast.error(response.data.msg || "Failed to update service details");
      }
    } catch (error) {
      console.error("Error updating service details:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
      setIsButtonDisabled(false);
    }
  };

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.service,
  }));

  const subServiceOptions = subServices.map((service) => ({
    value: service.id,
    label: service.service_sub,
  }));

  const selectedServices = serviceOptions.filter((option) =>
    formData.service_id.includes(option.value)
  );

  const selectedSubServices = subServiceOptions.filter((option) =>
    formData.service_sub_id.includes(option.value)
  );

  return (
    <Layout>
      <MasterFilter />
      <PageHeader title={"Edit Service Details"} />

      <div className="w-full mt-5 mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/5 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Preview</h2>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">
                  {formData.serviceDetails_status === "Active"
                    ? "Active"
                    : "Inactive"}
                </span>
                <Switch
                  checked={formData.serviceDetails_status === "Active"}
                  onChange={handleStatusChange}
                  color="primary"
                  inputProps={{ "aria-label": "status toggle" }}
                />
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50 h-fit relative">
              {formData.serviceDetails_status === "Inactive" && (
                <div className="absolute inset-0 bg-gray-200 bg-opacity-70  flex items-center justify-center z-10 rounded-lg">
                  {/* <div className="bg-white p-3 rounded-lg shadow-lg transform rotate-[-15deg] opacity-90 border-2 border-red-500">
                    <span className="text-red-600 font-bold text-lg">DISABLED</span>
                  </div> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.0"
                    width="214.000000pt"
                    height="162.000000pt"
                    viewBox="0 0 214.000000 162.000000"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g transform="rotate(-15 107 81)">
                      <g
                        transform="translate(0.000000,162.000000) scale(0.100000,-0.100000)"
                        fill="#000000"
                        stroke="none"
                      >
                        <path
                          d="M950 1480 c-30 -4 -75 -13 -99 -20 -65 -17 -199 -89 -222 -118 -11 -14 -29 -30 -41 -36 -21 -10 -113 -115 -106 -121 2 -1 33 1 70 6 59 7 74 14 123 54 107 87 236 134 367 135 31 0 58 3 61 8 2 4 2 1 1 -5 -5 -19 27 -16 41 4 7 9 17 13 24 9 9 -6 9 -11 0 -22 -9 -11 -8 -14 9 -14 11 0 55 -17 98 -39 72 -35 84 -38 134 -32 38 4 56 11 57 21 3 20 -70 73 -150 109 -90 41 -93 42 -131 26 -44 -19 -47 -19 -40 0 4 8 14 15 23 16 12 0 11 2 -4 8 -32 13 -155 20 -215 11z m134 -25 c-4 -8 -8 -15 -10 -15 -2 0 -4 7 -4 15 0 8 4 15 10 15 5 0 7 -7 4 -15z m-69 -15 c-3 -5 -12 -10 -18 -10 -7 0 -6 4 3 10 19 12 23 12 15 0z m30 -20 c-3 -5 -21 -9 -38 -9 l-32 1 30 8 c43 11 47 11 40 0z m-135 -15 c-7 -8 -20 -15 -29 -15 -11 1 -8 5 9 15 32 18 35 18 20 0z m-65 -34 c-3 -6 -11 -11 -17 -11 -6 0 -6 6 2 15 14 17 26 13 15 -4z m-125 -17 c0 -2 -14 -4 -31 -4 -16 0 -28 4 -25 9 5 8 56 3 56 -5z m63 -1 c-7 -2 -21 -2 -30 0 -10 3 -4 5 12 5 17 0 24 -2 18 -5z m527 -13 c0 -5 -4 -10 -10 -10 -5 0 -10 5 -10 10 0 6 5 10 10 10 6 0 10 -4 10 -10z m80 -21 c0 -5 -4 -9 -10 -9 -5 0 -10 7 -10 16 0 8 5 12 10 9 6 -3 10 -10 10 -16z"
                          fill="#B82631"
                        />
                        <path
                          d="M1939 1268 c0 -2 -3 -21 -5 -43 -6 -44 -14 -60 -14 -26 0 12 -4 19 -10 16 -6 -4 -10 5 -10 19 0 14 -2 26 -5 26 -26 0 -283 -32 -295 -37 -8 -3 -24 -5 -35 -4 -11 0 -112 -10 -225 -23 -154 -18 -207 -28 -216 -40 -6 -9 -17 -16 -24 -16 -8 0 -10 -8 -6 -26 5 -19 3 -25 -6 -22 -7 3 -14 14 -16 26 -5 33 -27 45 -72 37 -22 -4 -38 -11 -34 -16 3 -5 0 -9 -5 -9 -6 0 -11 5 -11 10 0 15 -40 12 -56 -5 -17 -17 -39 -21 -29 -5 8 13 1 13 -124 -5 -58 -8 -108 -20 -112 -26 -5 -8 -8 -8 -11 1 -3 10 -11 9 -31 -5 -16 -10 -27 -13 -27 -6 0 14 -103 5 -108 -9 -4 -12 -32 -14 -32 -2 0 4 -28 4 -62 0 -35 -5 -70 -8 -80 -9 -9 0 -19 -10 -22 -22 -6 -21 -7 -21 -20 -4 -12 16 -24 17 -87 12 -41 -3 -75 -8 -77 -10 -2 -2 0 -24 3 -49 5 -34 12 -46 24 -46 15 0 170 18 298 35 28 4 43 12 46 23 4 15 5 15 6 -1 1 -14 8 -16 38 -12 36 5 247 30 343 41 71 8 263 33 283 37 10 2 23 10 28 18 7 11 9 10 9 -5 0 -19 0 -19 21 0 14 13 22 15 27 6 10 -15 154 0 160 17 3 8 8 9 17 1 8 -7 88 -1 268 20 312 37 329 39 332 42 2 2 1 24 -2 51 -4 30 -10 47 -19 47 -8 0 -14 -1 -15 -2z m-889 -168 c0 -5 -5 -10 -11 -10 -5 0 -7 5 -4 10 3 6 8 10 11 10 2 0 4 -4 4 -10z m-207 -21 c-4 -15 -8 -17 -14 -8 -6 11 4 28 18 29 0 0 -1 -9 -4 -21z m-687 -66 c-10 -10 -19 5 -10 18 6 11 8 11 12 0 2 -7 1 -15 -2 -18z"
                          fill="#B82631"
                        />
                        <path
                          d="M1755 1096 c-5 -3 -27 -7 -47 -11 -24 -4 -38 -11 -38 -20 0 -8 6 -15 14 -15 9 0 15 -19 19 -57 4 -32 11 -96 17 -142 8 -74 7 -86 -7 -96 -27 -20 2 -28 72 -20 72 7 104 33 125 99 10 32 10 40 -1 47 -10 6 -11 9 -1 9 30 0 -4 143 -42 179 -22 21 -87 36 -111 27z m56 -36 c29 -16 50 -76 56 -162 6 -75 5 -77 -25 -107 -30 -31 -56 -39 -67 -22 -3 5 -8 40 -11 77 -3 37 -9 99 -14 137 -5 39 -6 75 -4 79 7 11 42 10 65 -2z"
                          fill="#B82631"
                        />
                        <path
                          d="M1530 1064 c-47 -6 -87 -12 -90 -13 -3 -1 4 -8 15 -17 17 -12 23 -38 36 -152 15 -124 15 -138 1 -150 -28 -22 0 -30 73 -21 109 13 108 13 112 43 3 18 0 25 -7 21 -5 -3 -10 -2 -10 4 0 5 6 12 13 14 9 4 8 8 -3 16 -12 9 -17 4 -24 -23 -8 -30 -14 -35 -49 -40 -22 -4 -41 -5 -43 -3 -2 2 -6 33 -10 70 -6 67 -6 67 19 67 17 0 28 -7 32 -20 9 -28 29 -25 21 3 -3 12 -6 37 -6 55 0 35 -15 43 -23 12 -5 -19 -41 -28 -50 -12 -3 4 -8 33 -11 65 l-7 57 40 0 c31 0 41 -4 46 -20 9 -27 25 -25 24 3 -1 51 -7 53 -99 41z"
                          fill="#B82631"
                        />
                        <path
                          d="M1250 1030 c-14 -4 -19 -8 -12 -9 7 -1 10 -5 7 -11 -3 -5 -2 -10 3 -10 5 0 13 -24 16 -52 4 -29 13 -56 19 -60 8 -5 9 -10 1 -18 -7 -7 -7 -33 -1 -81 6 -50 6 -74 -2 -82 -24 -24 -9 -29 62 -23 111 11 107 8 107 79 0 44 -3 58 -10 47 -5 -8 -10 -10 -11 -5 -1 6 -5 -10 -8 -35 -6 -44 -7 -45 -44 -48 -24 -2 -39 1 -41 10 -2 7 -10 71 -16 142 -12 118 -12 129 4 138 40 22 -17 36 -74 18z"
                          fill="#B82631"
                        />
                        <path
                          d="M1080 1014 c0 -5 -18 -10 -40 -10 -49 -2 -61 -11 -37 -29 10 -7 20 -30 22 -52 3 -21 8 -58 11 -83 3 -25 7 -61 9 -80 1 -19 3 -39 5 -45 1 -5 2 -21 1 -35 -1 -20 -3 -22 -11 -10 -8 13 -10 12 -10 -2 0 -20 23 -22 104 -9 82 14 113 69 85 150 -7 19 -20 33 -34 37 -22 5 -22 7 -8 36 16 31 13 102 -5 120 -13 13 -92 23 -92 12z m60 -42 c0 -10 3 -22 7 -26 4 -3 7 -21 7 -39 1 -26 -5 -35 -31 -49 -18 -10 -41 -18 -50 -17 -11 0 -13 3 -5 6 13 5 17 39 5 46 -7 4 -8 39 -4 85 1 7 15 12 36 12 27 0 35 -4 35 -18z m25 -165 c33 -47 5 -127 -44 -127 -15 0 -21 10 -27 43 -9 53 -10 90 -1 104 10 16 56 3 72 -20z m-94 -120 c-10 -9 -11 -8 -5 6 3 10 9 15 12 12 3 -3 0 -11 -7 -18z"
                          fill="#B82631"
                        />
                        <path
                          d="M831 968 c-13 -35 -23 -160 -12 -154 5 4 12 0 14 -6 3 -7 6 7 7 32 4 94 13 99 39 19 13 -41 28 -79 33 -86 13 -16 -1 -21 -44 -16 -22 3 -35 9 -32 15 4 6 -2 8 -12 6 -11 -2 -20 -13 -22 -26 -3 -21 -1 -22 17 -13 13 7 22 8 26 1 3 -5 22 -10 41 -10 27 0 37 -5 46 -25 9 -19 9 -28 0 -37 -20 -20 -13 -28 26 -28 43 0 71 13 52 25 -6 4 -20 27 -30 51 -11 24 -25 44 -32 44 -9 0 -10 2 -2 8 14 9 0 52 -16 52 -7 0 -9 8 -5 21 5 14 4 19 -4 15 -6 -4 -9 -2 -5 7 8 21 -14 67 -32 67 -13 0 -14 3 -5 14 6 7 9 21 5 30 -9 24 -43 20 -53 -6z"
                          fill="#B82631"
                        />
                        <path
                          d="M610 957 c-53 -27 -62 -113 -16 -162 28 -30 116 -79 116 -64 0 6 8 9 20 6 47 -12 4 44 -60 79 -50 27 -66 52 -58 90 5 27 34 41 58 26 28 -17 40 -15 40 7 0 30 -56 40 -100 18z"
                          fill="#B82631"
                        />
                        <path
                          d="M458 942 c-52 -3 -58 -12 -30 -40 23 -23 54 -283 34 -290 -7 -2 -12 -10 -12 -19 0 -18 39 -8 57 16 15 20 15 29 3 111 -22 144 -23 187 -3 199 28 15 4 26 -49 23z"
                          fill="#B82631"
                        />
                        <path
                          d="M195 913 c-40 -6 -53 -20 -33 -35 11 -9 21 -41 28 -98 18 -142 20 -149 38 -143 15 4 15 3 0 -10 -10 -8 -18 -22 -18 -31 0 -9 -4 -16 -10 -16 -5 0 -10 -6 -10 -14 0 -11 13 -13 63 -9 111 9 150 59 145 183 -7 152 -57 194 -203 173z m111 -38 c17 -9 30 -24 31 -37 19 -201 14 -229 -40 -247 -16 -6 -32 -10 -34 -8 -5 5 -33 237 -33 275 0 27 4 32 24 32 13 0 37 -7 52 -15z"
                          fill="#B82631"
                        />
                        <path
                          d="M690 890 c0 -14 5 -18 17 -13 11 4 13 8 5 11 -7 2 -10 8 -6 13 3 5 0 9 -5 9 -6 0 -11 -9 -11 -20z"
                          fill="#B82631"
                        />
                        <path
                          d="M714 709 c-3 -6 -3 -14 2 -18 14 -10 13 -41 -1 -41 -7 0 -18 -7 -25 -15 -12 -15 -72 -22 -68 -7 5 16 -12 72 -22 72 -5 0 -10 -20 -10 -44 0 -44 0 -44 40 -51 44 -7 84 1 74 16 -3 6 3 13 14 15 19 5 46 67 34 78 -9 10 -30 7 -38 -5z"
                          fill="#B82631"
                        />
                        <path
                          d="M808 703 c-10 -11 -18 -27 -18 -36 0 -9 -4 -17 -10 -17 -5 0 -10 -7 -10 -15 0 -16 40 -19 75 -6 17 7 17 9 3 17 -9 5 -18 24 -20 43 -3 33 -3 33 -20 14z"
                          fill="#B82631"
                        />
                        <path
                          d="M1968 693 c-38 -4 -39 -6 -42 -54 -1 -8 -9 -23 -18 -33 -10 -10 -18 -18 -18 -19 0 -3 79 3 117 9 28 4 32 8 31 37 0 45 -7 67 -21 65 -7 -1 -29 -3 -49 -5z"
                          fill="#B82631"
                        />
                        <path
                          d="M1775 669 c-33 -5 -82 -11 -110 -14 -27 -3 -59 -7 -70 -9 -11 -2 -59 -7 -107 -11 -48 -4 -86 -10 -84 -14 2 -3 -17 -6 -42 -7 -107 -2 -334 -32 -343 -45 -4 -8 -8 -8 -10 -1 -5 14 -89 3 -86 -10 1 -6 -6 -12 -15 -13 -10 -2 -15 2 -12 10 4 10 -6 11 -43 7 -26 -2 -49 -8 -51 -12 -2 -5 -11 -6 -22 -3 -27 7 -194 -16 -198 -28 -3 -6 -9 -5 -18 1 -7 7 -18 9 -24 5 -6 -4 -33 -8 -58 -10 -50 -3 -106 -9 -237 -25 -44 -6 -85 -10 -92 -10 -18 0 -18 -89 0 -96 8 -3 85 4 173 15 87 11 186 23 219 26 93 9 112 14 94 26 -13 10 12 5 47 -8 7 -2 15 0 18 6 4 6 13 8 20 5 8 -3 14 1 13 8 -1 37 5 56 20 62 20 8 32 -9 25 -36 -3 -13 0 -19 9 -17 8 1 22 -1 31 -5 9 -4 72 0 140 8 169 23 169 23 208 25 23 2 29 5 19 9 -14 6 -15 9 -3 20 11 10 16 9 25 -6 10 -16 19 -17 73 -11 33 5 104 13 156 19 52 6 109 12 125 14 17 2 81 10 143 16 112 13 114 13 109 36 -5 30 9 32 16 3 7 -28 32 -19 33 12 0 14 3 30 8 37 4 6 4 17 1 22 -7 11 -14 11 -100 -1z m-408 -85 c-3 -3 -12 -4 -19 -1 -8 3 -5 6 6 6 11 1 17 -2 13 -5z m53 -3 c0 -11 -26 -22 -34 -14 -12 12 -5 23 14 23 11 0 20 -4 20 -9z m-265 -21 c3 -5 1 -10 -4 -10 -6 0 -11 5 -11 10 0 6 2 10 4 10 3 0 8 -4 11 -10z m-55 -40 c0 -5 -2 -10 -4 -10 -3 0 -8 5 -11 10 -3 6 -1 10 4 10 6 0 11 -4 11 -10z m-507 -49 c13 -13 -7 -14 -65 -5 -23 4 -35 11 -32 19 6 14 79 4 97 -14z m-338 -21 c-3 -5 -11 -10 -16 -10 -6 0 -7 5 -4 10 3 6 11 10 16 10 6 0 7 -4 4 -10z"
                          fill="#B82631"
                        />
                        <path
                          d="M525 610 c3 -5 10 -10 16 -10 5 0 9 5 9 10 0 6 -7 10 -16 10 -8 0 -12 -4 -9 -10z"
                          fill="#B82631"
                        />
                        <path
                          d="M758 453 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"
                          fill="#B82631"
                        />
                        <path
                          d="M1471 453 c-19 -4 -101 -62 -131 -93 -3 -3 -18 -11 -35 -19 l-30 -13 48 -15 c35 -10 47 -18 45 -31 -2 -10 3 -17 12 -17 8 0 15 6 15 14 0 8 15 19 34 23 20 6 35 17 38 29 3 10 11 19 18 19 13 0 95 88 95 103 0 7 -68 8 -109 0z m-70 -116 c-10 -9 -11 -8 -5 6 3 10 9 15 12 12 3 -3 0 -11 -7 -18z"
                          fill="#B82631"
                        />
                        <path
                          d="M600 351 l-25 -7 23 -8 c12 -4 22 -11 22 -16 0 -15 70 -63 93 -65 12 -2 21 -7 20 -12 -1 -5 25 -20 58 -33 58 -22 62 -23 89 -7 35 21 51 22 24 2 -14 -11 -15 -14 -4 -15 35 0 51 33 25 52 -5 4 -6 10 -2 14 4 4 16 -1 27 -11 14 -13 17 -22 10 -29 -5 -5 -10 -18 -10 -27 0 -23 47 -33 115 -24 43 5 54 10 59 28 3 11 0 27 -6 34 -8 10 -5 13 13 13 16 0 20 -3 11 -8 -9 -6 -7 -14 9 -31 17 -18 27 -21 52 -15 40 8 40 8 40 39 0 15 4 24 11 22 6 -2 10 -12 10 -21 -2 -20 9 -20 46 -1 36 19 39 48 8 69 -33 23 -67 20 -78 -6 -7 -19 -9 -20 -9 -4 -1 14 -6 17 -23 12 -74 -21 -142 -28 -226 -22 -51 4 -101 11 -110 16 -56 30 -131 57 -129 47 1 -7 -10 -12 -25 -12 -16 1 -28 -5 -28 -12 0 -7 -9 -13 -20 -13 -16 0 -20 7 -20 30 0 31 -6 34 -50 21z m215 -80 c-3 -6 -11 -11 -17 -11 -6 0 -6 6 2 15 14 17 26 13 15 -4z m245 -41 c0 -11 5 -20 12 -20 8 0 5 -7 -5 -17 -17 -17 -19 -17 -33 1 -14 20 -14 20 -15 0 0 -17 -1 -16 -9 4 -5 12 -14 22 -20 22 -5 0 -10 6 -10 13 0 9 14 14 40 15 34 2 40 -1 40 -18z"
                          fill="#B82631"
                        />
                        <path
                          d="M678 353 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"
                          fill="#B82631"
                        />
                        <path
                          d="M918 173 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z"
                          fill="#B82631"
                        />
                      </g>
                    </g>
                  </svg>
                </div>
              )}

              <div
                className={
                  formData.serviceDetails_status === "Inactive"
                    ? "opacity-50"
                    : ""
                }
              >
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Service preview"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-500">Image preview</span>
                  </div>
                )}

                {formData.serviceDetails_name ? (
                  <h3 className="text-lg font-semibold mb-2 break-words whitespace-normal">
                    {formData.serviceDetails_name}
                  </h3>
                ) : (
                  <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                )}

                {formData.serviceDetails ? (
                  <div className="overflow-hidden">
                    {showFullText ? (
                      <p className="text-gray-700 text-sm whitespace-pre-line break-words">
                        {formData.serviceDetails}
                      </p>
                    ) : (
                      <p className="text-gray-700 text-sm whitespace-pre-line break-words">
                        {formData.serviceDetails
                          .split(" ")
                          .slice(0, 100)
                          .join(" ")}
                        {formData.serviceDetails.split(" ").length > 100 &&
                          "..."}
                      </p>
                    )}
                    {formData.serviceDetails.split(" ").length > 100 && (
                      <span
                        className="text-blue-600 underline cursor-pointer hover:text-blue-800 mt-1 inline-block"
                        onClick={() => setShowFullText((prev) => !prev)}
                      >
                        {showFullText ? "Read less" : "Read more"}
                      </span>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-4/6"></div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-3/5 p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Service Details Name */}
                <div>
                  <Input
                    label="Service Details Name"
                    type="text"
                    name="serviceDetails_name"
                    value={formData.serviceDetails_name}
                    onChange={handleInputChange}
                    required
                    maxLength={250}
                  />
                </div>

                {/* Service Details Description */}
                <div>
                  <Textarea
                    label="Service Details"
                    name="serviceDetails"
                    value={formData.serviceDetails}
                    onChange={handleInputChange}
                    required
                    rows={6}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Image
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {initialImage
                      ? "Upload a new image to replace the existing one"
                      : "Upload an image for this service (JPEG, PNG, etc.)"}
                  </p>
                </div>

                {/* Service Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service <span className="text-red-500">*</span>
                  </label>
                  <Select
                    isMulti
                    options={serviceOptions}
                    value={selectedServices}
                    onChange={handleServiceChange}
                    styles={customStyles}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select Service..."
                    required
                    menuPlacement="top"
                    closeMenuOnSelect={false}
                  />
                </div>

                {/* Sub Service Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Service
                  </label>
                  <Select
                    isMulti
                    options={subServiceOptions}
                    value={selectedSubServices}
                    onChange={handleSubServiceChange}
                    styles={customStyles}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select Sub Service..."
                    menuPlacement="top"
                    closeMenuOnSelect={false}
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <ButtonConfigColor
                    type="button"
                    buttontype="button"
                    label="Cancel"
                    onClick={() => navigate(-1)}
                  />
                  <ButtonConfigColor
                    type="submit"
                    buttontype="submit"
                    label="Update"
                    disabled={isButtonDisabled}
                    loading={loading}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditRightSidebar;
