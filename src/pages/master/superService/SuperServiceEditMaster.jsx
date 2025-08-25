import { Card, Input, Textarea } from "@material-tailwind/react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BASE_URL,
  NO_IMAGE_URL,
  SUPER_SERVICE_IMAGE_URL,
} from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";
const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const SuperServiceEditMaster = () => {
  const { id } = useParams();
  const [superService, setSuperService] = useState({
    serviceSuper: "",
    serviceSuper_status: "",
    serviceSuper_image: "",
    serviceSuper_url: "",
    serviceSuper_sort: "",
    serviceSuper_meta_title: "",
    serviceSuper_meta_description: "",
    serviceSuper_meta_tags: "",
    serviceSuper_keywords: "",
  });
  UseEscapeKey();
  const navigate = useNavigate();
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchloading, setFetchLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [serviceSuperError,setServiceSuperError]=useState(null)

  useEffect(() => {
    const fetchSuperServiceData = async () => {
      setFetchLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-super-service-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setSuperService(
          response.data.servicesuper || {
            serviceSuper: "",
            serviceSuper_status: "",
            serviceSuper_image: "",
            serviceSuper_url: "",
            serviceSuper_sort: "",
            serviceSuper_meta_title: "",
            serviceSuper_meta_description: "",
            serviceSuper_meta_tags: "",
            serviceSuper_keywords: "",
          }
        );
      } catch (error) {
        console.error("Error fetching super service:", error);
        toast.error(error.response.data.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchSuperServiceData();
  }, [id]);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/super-service?page=${pageNo}`);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "serviceSuper") {
   
      if (value.includes('/') || value.includes('\\')) {
        setServiceSuperError("Service Super name cannot contain slashes ( / or \\ )");
        return;
      } else {
        setServiceSuperError("");
      }
    }
    setSuperService({
      ...superService,
      [name]: value,
    });
  };

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    if (serviceSuperError) {
      setLoading(false);
      return;
    }
    const data = new FormData();
    data.append("serviceSuper", superService.serviceSuper);

    data.append("serviceSuper_image", selectedFile);
    data.append(
      "serviceSuper_meta_title",
      superService.serviceSuper_meta_title
    );
    data.append(
      "serviceSuper_meta_description",
      superService.serviceSuper_meta_description
    );
    data.append("serviceSuper_meta_tags", superService.serviceSuper_meta_tags);
    data.append("serviceSuper_keywords", superService.serviceSuper_keywords);
    data.append("serviceSuper_url", superService.serviceSuper_url);
    data.append("serviceSuper_sort", superService.serviceSuper_sort);
    data.append("serviceSuper_status", superService.serviceSuper_status);

    const form = document.getElementById("addIndiv");
    if (form.checkValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: `${BASE_URL}/api/panel-update-super-service/${id}?_method=PUT`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success(res.data?.msg || "Update successful");
            navigate(`/super-service?page=${pageNo}`);
          } else {
            toast.error(res.data?.msg || "Duplicate entry");
          }
        })
        .catch((error) => {
          console.error("Update error:", error);
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setIsButtonDisabled(false);
          setLoading(false);
        });
    }
  };

  const imageUrl = superService.serviceSuper_image
    ? `${SUPER_SERVICE_IMAGE_URL}/${superService.serviceSuper_image}`
    : NO_IMAGE_URL;

  return (
    <Layout>
      <MasterFilter />
      <div className="textfields-wrapper">
        <PageHeader title={"Edit Super Service"} onClick={handleBack} />
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
                {/* Super Service Image */}
                <div className="flex flex-col items-center">
                  <img
                    src={imageUrl}
                    alt="Super Service"
                    className="w-52 h-52 mb-4 object-cover"
                  />
                </div>

                {/* Super Service Fields */}
                <div className="p-2">
                  <div className="mb-6">
                    <Input
                      label="Super Service Name"
                      type="text"
                      name="serviceSuper"
                      value={superService.serviceSuper}
                      onChange={onInputChange}
                      required
                      labelProps={{
                        className: "!text-gray-600",
                      }}
                    />
                       {serviceSuperError && (
                      <p className="mt-1 text-sm text-red-500">
                        {serviceSuperError}
                      </p>
                    )}
                  </div>
                  <div className="mb-6">
                    <Input
                      label="Super Service Url"
                      type="text"
                      name="serviceSuper_url"
                      value={superService.serviceSuper_url}
                      onChange={onInputChange}
                      required
                      labelProps={{
                        className: "!text-gray-600",
                      }}
                    />
                  </div>
                  <div className="mb-6">
                    <Input
                      label="Super Service Sort"
                      type="text"
                      name="serviceSuper_sort"
                      value={superService.serviceSuper_sort}
                      onChange={onInputChange}
                      required
                      labelProps={{
                        className: "!text-gray-600",
                      }}
                    />
                  </div>
                  <div className="mb-6">
                    <Input
                      label="Image"
                      type="file"
                      accept="image/*"
                      name="serviceSuper_image"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      className="w-full border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <FormControl fullWidth>
                      <InputLabel id="super-service-status-label">
                        Status
                      </InputLabel>
                      <MuiSelect
                        sx={{ height: "40px", borderRadius: "5px" }}
                        labelId="super-service-status-label"
                        id="super-service-status"
                        name="serviceSuper_status"
                        value={superService.serviceSuper_status}
                        onChange={onInputChange}
                        label="Status"
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
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <Textarea
                  label="Meta Title"
                  value={superService?.serviceSuper_meta_title}
                  name="serviceSuper_meta_title"
                  onChange={onInputChange}
                />
                <Textarea
                  label="Meta Description"
                  value={superService?.serviceSuper_meta_description}
                  name="serviceSuper_meta_description"
                  onChange={onInputChange}
                />
                <Textarea
                  label="Meta Tags"
                  value={superService?.serviceSuper_meta_tags}
                  name="serviceSuper_meta_tags"
                  onChange={onInputChange}
                />
                <Textarea
                  label="Keywords"
                  value={superService?.serviceSuper_keywords}
                  name="serviceSuper_keywords"
                  onChange={onInputChange}
                />
              </div>
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

export default SuperServiceEditMaster;
