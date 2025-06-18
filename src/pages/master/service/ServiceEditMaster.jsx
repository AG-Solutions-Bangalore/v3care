import { Card, Input, Textarea, Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  Select as SelectMaterial,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  BASE_URL,
  NO_IMAGE_URL,
  SERVICE_IMAGE_URL,
} from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import { TrashIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "lucide-react";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

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

const faqStatusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
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

const ServiceEditMaster = () => {
  const { id } = useParams();
  const [services, setService] = useState({
    service: "",
    service_status: "",
    service_image: "",
    service_comm: "",
    service_show_website: [],
    service_meta_title: "",
    service_meta_description: "",
    service_slug: "",
    service_includes: "",
    service_meta_full_length: "",
    super_service_id: "",
    faq_data: []
  });

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState({ id: null, index: null });

  const handleOpenDialog = (faqId, index) => {
    setFaqToDelete({ id: faqId, index });
    setOpenDialog(true);
  };

  UseEscapeKey();
  const [superservice, setSuperservice] = useState([]);
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchloading, setFetchLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;

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

  const handleMultiSelectChange = (selectedOptions) => {
    setService((prev) => ({
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
    setService(prev => ({ ...prev, faq_data: updatedFaqData }));
  };

  const addFaqRow = () => {
    setService(prev => ({
      ...prev,
      faq_data: [
        ...prev.faq_data,
        { 
          service_faq_heading: "", 
          service_faq_description: "",
          service_faq_status: "Active",
          id: null
        }
      ]
    }));
  };
  const handleRemoveFaq = (index) => {
    const updatedFaqData = services.faq_data.filter((_, i) => i !== index);
    setService(prev => ({ ...prev, faq_data: updatedFaqData }));
  };

  const confirmDeleteFaq = async () => {
  const { id: faqId, index } = faqToDelete;
  
  if (faqId) {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/panel-delete-service-faq-by-id/${faqId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data.code === 200) {
        toast.success(response.data.msg);
        const updatedFaqData = services.faq_data.filter((_, i) => i !== index);
        setService(prev => ({ ...prev, faq_data: updatedFaqData }));
      } else {
        toast.error(response.data.msg || "Failed to delete FAQ");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting FAQ");
    }
  } else {
    if (services.faq_data.length > 1) {
      const updatedFaqData = services.faq_data.filter((_, i) => i !== index);
      setService(prev => ({ ...prev, faq_data: updatedFaqData }));
    }
  }
  
  setOpenDialog(false);
};

  useEffect(() => {
    const fetchServiceData = async () => {
      setFetchLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const serviceData = response.data.service || {
          service: "",
          service_status: "",
          service_image: "",
          service_comm: "",
          service_includes: "",
          service_show_website: [],
          service_meta_title: "",
          service_meta_description: "",
          service_slug: "",
          service_meta_full_length: "",
          super_service_id: "",
        };

        if (serviceData.service_show_website) {
          serviceData.service_show_website = serviceData.service_show_website
            .split(",")
            .map(Number);
        } else {
          serviceData.service_show_website = [];
        }

        
        serviceData.faq_data = response.data.serviceFAQ || [];
        
        setService(serviceData);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchServiceData();
  }, [id]);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/service?page=${pageNo}`);
  };

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    const data = new FormData();
    data.append("service", services.service);
    if (selectedFile) {
      data.append("service_image", selectedFile);
    }
    data.append("service_status", services.service_status);
    data.append("service_comm", services.service_comm);
    data.append("service_meta_title", services.service_meta_title);
    data.append("service_meta_description", services.service_meta_description);
    data.append("service_slug", services.service_slug);
    data.append("service_meta_full_length", services.service_meta_full_length);
    data.append("super_service_id", services.super_service_id);
    data.append("service_includes", services.service_includes);

    data.append(
      "service_show_website",
      services.service_show_website.join(",")
    );

    // Append FAQ data
    services.faq_data.forEach((faq, index) => {
      data.append(`faq_data[${index}][id]`, faq.id || '');
      data.append(`faq_data[${index}][service_faq_heading]`, faq.service_faq_heading);
      data.append(`faq_data[${index}][service_faq_description]`, faq.service_faq_description);
      data.append(`faq_data[${index}][service_faq_status]`, faq.service_faq_status);
    });

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
            toast.success(res.data?.msg || "Update successful");
            navigate(`/service?page=${pageNo}`);
          } else {
            setLoading(false);
            setIsButtonDisabled(false);
            toast.error(res.data?.msg || "Duplicate entry");
          }
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Error updating service");
          setLoading(false);
          setIsButtonDisabled(false);
        });
    }
  };

  const websiteOptions = serviceShowWebsite.map((item) => ({
    value: item.id,
    label: item.name,
    id: item.id,
  }));

  const selectedWebsiteValues = websiteOptions.filter((option) =>
    services.service_show_website.includes(option.id)
  );

  const imageUrl = services.service_image
    ? `${SERVICE_IMAGE_URL}/${services.service_image}`
    : `${NO_IMAGE_URL}`;

  return (
    <Layout>
      <MasterFilter />
      <div className="textfields-wrapper">
        <PageHeader title={"Edit Service"} onClick={handleBack} />
        {fetchloading ? (
          <LoaderComponent />
        ) : (
          <Card className="p-6 mt-2">
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
                <div className="p-2 ">
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
                      required
                    >
                      {superservice.map((item) => (
                        <MenuItem key={item.id} value={String(item.id)}>
                          {item.serviceSuper}
                        </MenuItem>
                      ))}
                    </SelectMaterial>
                  </FormControl>{" "}
                  <div className="my-6">
                    <Input
                      label="Service"
                      type="text"
                      name="service"
                      value={services.service}
                      onChange={onInputChange}
                      required
                      disabled
                      labelProps={{
                        className: "!text-gray-600   ",
                      }}
                    />
                  </div>
                  <div className="mb-6">
                    <Input
                      label="Image"
                      type="file"
                      name="service_image"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="w-full border border-gray-700 rounded-md"
                    />
                  </div>
                  <div className="mb-4">
                    <FormControl fullWidth>
                      <InputLabel id="service-select-label">
                        <span className="text-sm relative bottom-[6px]">
                          Status <span className="text-red-700">*</span>
                        </span>
                      </InputLabel>
                      <MuiSelect
                        sx={{ height: "40px", borderRadius: "5px" }}
                        labelId="service-select-label"
                        id="service-select"
                        name="service_status"
                        value={services.service_status}
                        onChange={onInputChange}
                        label="Status *"
                        required
                      >
                        {statusOptions.map((data) => (
                          <MenuItem key={data.value} value={String(data.value)}>
                            {data.label}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      placeholder="Select options..."
                    />
                  </div>
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
              {/* FAQ Section */}
              <div className="mb-6 mt-1">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">FAQ  <span className=" text-xs px-1">(max -5)</span></h3>
              
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
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <FormControl fullWidth>
                              <MuiSelect
                                sx={{ height: "40px", borderRadius: "5px", minWidth: "120px" }}
                                name={`faq_status_${index}`}
                                value={faq.service_faq_status || "Active"}
                                onChange={(e) => handleFaqChange(index, 'service_faq_status', e.target.value)}
                              >
                                {faqStatusOptions.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </MuiSelect>
                            </FormControl>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
  <button
    type="button"
    onClick={() => faq.id ? handleOpenDialog(faq.id, index) : handleRemoveFaq(index)}
    className="text-red-600 hover:text-red-900 flex items-center gap-1"
  >
    {faq.id ? (
      <TrashIcon className="h-5 w-5" />
    ) : (
      <MinusCircleIcon className="h-5 w-5" />
    )}
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
                    disabled={services.faq_data.length === 5}
                    className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2
                      ${services.faq_data.length === 5
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'}
                    `}
                  >
                    <PlusCircleIcon className="h-5 w-5" />
                    Add FAQ
                  </button>
              </div>

              {/* Confirmation Dialog */}
              <Dialog open={openDialog} handler={() => setOpenDialog(false)}>
                <DialogHeader>Confirm Deletion</DialogHeader>
                <DialogBody>
                  Are you sure you want to delete this FAQ? This action cannot be undone.
                </DialogBody>
                <DialogFooter>
                  <Button
                    variant="text"
                    color="red"
                    onClick={() => setOpenDialog(false)}
                    className="mr-1"
                  >
                    <span>Cancel</span>
                  </Button>
                  <Button
                    variant="gradient"
                    color="red"
                    onClick={confirmDeleteFaq}
                  >
                    <span>Confirm</span>
                  </Button>
                </DialogFooter>
              </Dialog>

              <div className="flex justify-center space-x-4 my-2">
                <ButtonConfigColor
                  type="edit"
                  buttontype="submit"
                  label="Update"
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
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ServiceEditMaster;