import { Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as SelectMaterial,
} from "@mui/material";
import { CircleMinus, MinusCircleIcon, PlusCircleIcon } from "lucide-react";

const serviceShowWebsite = [
  {
    id: 1,
    name: "Popular",
  },
  {
    id: 2,
    name: "Most Popular",
  },
  {
    id: 3,
    name: "Super Popular",
  },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "40px",
    height: "40px",
    borderRadius: "0.375rem",
    borderColor: "#e5e7eb",
    "&:hover": {
      borderColor: "#9ca3af",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "40px",
    padding: "0 8px",
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

const AddServiceMaster = () => {
  const [services, setServices] = useState({
    service: "",
    service_comm: "",
    service_sort: "",
    service_image: "",
    service_show_website: [],
    service_meta_title: "",
    service_meta_description: "",
    service_slug: "",
    service_meta_full_length: "",
    super_service_id: "",
    service_includes: "",
    faq_data: [
      {
        service_faq_heading: "",
        service_faq_description: ""
      }
    ]
  });
  
  const [activeTab, setActiveTab] = useState("basic");
  const [formErrors, setFormErrors] = useState({});
  const [superservice, setSuperservice] = useState([]);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation function
  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt);
  
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-super-service`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSuperservice(response.data?.servicesuper);
      } catch (error) {
        console.error("Error fetching servicesuper data", error);
      }
    };
    fetchServiceData();
  }, []);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .substring(0, 250);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (["service_comm"].includes(name)) {
      if (validateOnlyDigits(value)) {
        setServices((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setServices((prev) => {
        const updatedService = {
          ...prev,
          [name]: value,
        };
    
        if (name === "service_meta_title") {
          updatedService.service_slug = generateSlug(value);
        }
    
        return updatedService;
      });
    }
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setServices((prev) => ({
      ...prev,
      service_show_website: selectedOptions
        ? selectedOptions.map((option) => option.id)
        : [],
    }));
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqData = services.faq_data.map((faq, i) => 
      i === index ? { ...faq, [field]: value } : faq
    );
    setServices(prev => ({ ...prev, faq_data: updatedFaqData }));
  };
  
  const addFaqRow = () => {
    if (services.faq_data.length < 20) {
      setServices(prev => ({
        ...prev,
        faq_data: [
          ...prev.faq_data,
          { service_faq_heading: "", service_faq_description: "" }
        ]
      }));
    }
  };
  
  const removeFaqRow = (index) => {
    if (services.faq_data.length > 1) {
      const updatedFaqData = services.faq_data.filter((_, i) => i !== index);
      setServices(prev => ({ ...prev, faq_data: updatedFaqData }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
  
    if (!services.super_service_id) errors.super_service_id = "Super Service is required";
    if (!services.service) errors.service = "Service is required";
    if (!services.service_sort) errors.service_sort = "Service Sort is required";
    if (!selectedFile) errors.service_image = "Service Image is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   

 
    if (!validateForm()) {
     
      setActiveTab("basic");
      toast.error("Please fill all required fields in Basic Information");
      setLoading(false);
      setIsButtonDisabled(false);
      return;
    }
  

    const data = new FormData();
    data.append("service", services.service);
    data.append("service_image", selectedFile);
    data.append("service_comm", services.service_comm);
    data.append("service_meta_title", services.service_meta_title);
    data.append("service_sort", services.service_sort);
    data.append("service_meta_description", services.service_meta_description);
    data.append("service_slug", services.service_slug);
    data.append("service_meta_full_length", services.service_meta_full_length);
    data.append("super_service_id", services.super_service_id);
    data.append("service_includes", services.service_includes);

    data.append(
      "service_show_website",
      services.service_show_website.join(",")
    );
    services.faq_data.forEach((faq, index) => {
      data.append(`faq_data[${index}][service_faq_heading]`, faq.service_faq_heading);
      data.append(`faq_data[${index}][service_faq_description]`, faq.service_faq_description);
    });
    setIsButtonDisabled(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-service`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === 200) {
        toast.success(response.data?.msg);

        setServices({
          service: "",
          service_comm: "",
          service_image: "",
          service_show_website: [],
          faq_data: [
            {
              service_faq_heading: "",
              service_faq_description: ""
            }
          ]
        });

        navigate("/service");
      } else {
        toast.error(response.data?.msg || "Duplicate entry");
      }
    } catch (error) {
      toast.error(error.response.data?.message);
      setLoading(false);
      setIsButtonDisabled(false);
    } finally {
      setLoading(false);
      setIsButtonDisabled(false);
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === 'Backspace' ||
      event.key === 'Delete' ||
      event.key === 'Tab' ||
      event.key === 'Escape' ||
      event.key === 'Enter' ||
      (event.key >= '0' && event.key <= '9') ||
      event.key === '.'
    ) {
      return;
    }
    event.preventDefault();
  };
  const hasBasicErrors = () => {
    return !services.super_service_id || !services.service || !services.service_sort || !services.service_status;
  };
  const websiteOptions = serviceShowWebsite.map((item) => ({
    value: item.id,
    label: item.name,
    id: item.id,
  }));

  const selectedWebsiteValues = websiteOptions.filter((option) =>
    services.service_show_website.includes(option.id)
  );

  return (
    <Layout>
      <MasterFilter />

      <PageHeader title={"Create Service"} />

      <div className="w-full mt-2 mx-auto p-8 bg-white shadow-lg rounded-xl">
        <form  autoComplete="off" onSubmit={onSubmit} noValidate>
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
          <button
      type="button"
      className={`py-2 px-4 font-medium text-sm focus:outline-none transition-all duration-300 relative ${
        activeTab === "basic"
          ? "border-b-2 border-blue-500 text-blue-600"
          : "text-gray-500 hover:text-gray-700"
      } ${hasBasicErrors() && Object.keys(formErrors).length > 0 ? "border-red-500" : ""}`}
      onClick={() => setActiveTab("basic")}
    >
      Basic Information
      {hasBasicErrors() && Object.keys(formErrors).length > 0 && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      )}
    </button>
            <button
              type="button"
              className={`py-2 px-4 font-medium text-sm focus:outline-none transition-all duration-300 ${
                activeTab === "faq"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("faq")}
            >
              FAQ
            </button>
          </div>

          {/* Tab Contents */}
          <div className="transition-all duration-300">
            {/* Basic Information Tab */}
            <div
              className={`${activeTab === "basic" ? "block" : "hidden"}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <FormControl fullWidth>
                  <InputLabel id="super_service_id-label">
                    <span className="text-sm relative bottom-[6px]">
                      Super Service
                      <span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <SelectMaterial
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="super_service_id-label"
                    id="super_service_id-select"
                    name="super_service_id"
                    value={services.super_service_id}
                    onChange={onInputChange}
                    label="Super Service"
                    error={!!formErrors.super_service_id}
                    
                  >
                    {superservice.map((item) => (
                      <MenuItem key={item.id} value={String(item.id)}>
                        {item.serviceSuper}
                      </MenuItem>
                    ))}
                  </SelectMaterial>
                  {formErrors.super_service_id && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.super_service_id}</p>
                  )}
                </FormControl>

                <div className="form-group">
                  <Input
                    label="Service"
                    type="text"
                    name="service"
                    value={services.service}
                    onChange={onInputChange}
                    maxLength={250}
                    error={!!formErrors.service}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none transition-all duration-300 shadow-sm"
                  />
                  {formErrors.service && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.service}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <Input
                    label="Service Sort"
                    type="tel"
                    name="service_sort"
                    value={services.service_sort}
                    onChange={onInputChange}
                    
                    onKeyDown={handleKeyDown}
                    error={!!formErrors.service_sort}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none transition-all duration-300 shadow-sm"
                  />
                  {formErrors.service_sort && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.service_sort}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <Input
                    label="Service Image"
                    type="file"
                    name="service_image"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    error={!!formErrors.service_image}
                    className="w-full px-4 pb-2 border border-gray-300 rounded-md focus:outline-none transition-all duration-300 shadow-sm"
                  />
                  {formErrors.service_image && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.service_image}</p>
                  )}
                </div>
                
                <div className="form-group relative col-span-1 md:col-span-2 lg:col-span-4">
                  <label className="block text-xs font-medium text-gray-700 absolute -top-4 left-0">
                    Service Show Website
                  </label>
                  <Select
                    isMulti
                    options={websiteOptions}
                    value={selectedWebsiteValues}
                    onChange={handleMultiSelectChange}
                    styles={customStyles}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select Service..."
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <Textarea
                  label="Meta Title"
                  value={services?.service_meta_title}
                  name="service_meta_title"
                  onChange={onInputChange}
                />
                <Textarea
                  label="Meta Description"
                  value={services?.service_meta_description}
                  name="service_meta_description"
                  onChange={onInputChange}
                />
                <Textarea
                  label="Service Slug"
                  value={services?.service_slug}
                  name="service_slug"
                  onChange={onInputChange}
                />
                <Textarea
                  label="Service Meta Full length"
                  value={services?.service_meta_full_length}
                  name="service_meta_full_length"
                  onChange={onInputChange}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Includes</h3>
                </div>
                <Textarea
                  label="Service Include"
                  value={services?.service_includes}
                  name="service_includes"
                  onChange={onInputChange}
                />
                <p className="text-xs px-2 text-gray-700 mt-1">
                  Separate multiple items with commas (e.g., cleaning, painting, repairs).
                </p>
              </div>
            </div>

            {/* FAQ Tab */}
            <div
              className={`transition-all duration-300 ${activeTab === "faq" ? "block" : "hidden"}`}
            >
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    FAQ <span className="text-xs px-1">(max -5)</span>
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          FAQ Heading
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          FAQ Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '80px' }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {services.faq_data.map((faq, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Textarea
                              label="FAQ heading"
                              value={faq.service_faq_heading}
                              onChange={(e) => handleFaqChange(index, 'service_faq_heading', e.target.value)}
                              className="w-full"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <Textarea
                              label="FAQ description"
                              value={faq.service_faq_description}
                              onChange={(e) => handleFaqChange(index, 'service_faq_description', e.target.value)}
                              className="w-full"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => removeFaqRow(index)}
                              disabled={services.faq_data.length <= 1}
                              className={`text-red-600 hover:text-red-900 ${services.faq_data.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <MinusCircleIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <button
                  type="button"
                  onClick={addFaqRow}
                  disabled={services.faq_data.length == 20}
                  className={`mt-4 px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                    services.faq_data.length == 20
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  Add FAQ
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
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

export default AddServiceMaster;