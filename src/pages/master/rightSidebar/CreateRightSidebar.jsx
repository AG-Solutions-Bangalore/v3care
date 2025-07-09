import { Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import MasterFilter from "../../../components/MasterFilter";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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

const CreateRightSidebar = () => {
  const [formData, setFormData] = useState({
    service_id: [],
    service_sub_id: [],
    serviceDetails_name: "",
    serviceDetails: "",
    serviceDetails_image: null,
  });

  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const navigate = useNavigate();

  UseEscapeKey();

  // Fetch  services
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
        console.error("Error fetching  services", error);
        toast.error("Failed to load  services");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsButtonDisabled(true);

    const data = new FormData();
    data.append("service_id", formData.service_id.join(","));
    data.append("service_sub_id", formData.service_sub_id.join(","));
    data.append("serviceDetails_name", formData.serviceDetails_name);
    data.append("serviceDetails", formData.serviceDetails);
    if (formData.serviceDetails_image) {
      data.append("serviceDetails_image", formData.serviceDetails_image);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-service-details`,
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
        toast.error(response.data.msg || "Failed to create service details");
      }
    } catch (error) {
      console.error("Error creating service details:", error);
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
      <PageHeader title={"Create Service Details"} />

      <div className="w-full mt-5 mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Preview Section (40% on large screens, full width on mobile) */}
          <div className="w-full lg:w-2/5 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>

            <div className="border rounded-lg p-4 bg-gray-50 h-fit">
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
  <div className="ql-editor" dangerouslySetInnerHTML={{ __html: formData.serviceDetails }} />
) : (
  <>
    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
    <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
    <div className="h-4 bg-gray-200 rounded mb-2 w-4/6"></div>
  </>
)}


              {/* {formData.serviceDetails ? (
                <div className="overflow-hidden">
                  {showFullText ? (
                    <p className="text-gray-700 text-sm whitespace-pre-line break-words"
                    
                    
                    >
                      {formData.serviceDetails}
                    </p>
                  ) : (
                    <p className="text-gray-700  text-sm whitespace-pre-line break-words">
                      {formData.serviceDetails
                        .split(" ")
                        .slice(0, 50)
                        .join(" ")}
                      {formData.serviceDetails.split(" ").length > 50 && "..."}
                    </p>
                  )}
                  {formData.serviceDetails.split(" ").length > 50 && (
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
              )} */}
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
   <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
  Service Details <span className="text-red-500">*</span>
  </label>
  <ReactQuill
    theme="snow"
    value={formData.serviceDetails}
    onChange={(value) => 
      setFormData({
        ...formData,
        serviceDetails: value
      })
    }
    modules={{
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
    }}
    formats={[
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet',
      'link', 'image'
    ]}
    className="h-64 mb-12"
  />
</div>
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Image <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Upload an image for this service (JPEG, PNG, etc.)
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
                    label="Submit"
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

export default CreateRightSidebar;
