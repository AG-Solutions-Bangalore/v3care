import { Card, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const ClientsCreateMaster = () => {
  const [clients, setClients] = useState({
    client_name: "",
    client_image: "",
    client_sort: "",
  });
  
  const [clientNameError, setClientNameError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  UseEscapeKey();
  const navigate = useNavigate();
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo = storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/clients?page=${pageNo}`);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "client_name") {
   
      if (value.includes('/') || value.includes('\\')) {
        setClientNameError("Client name cannot contain slashes ( / or \\ )");
        return;
      } else {
        setClientNameError("");
      }
    }
    
    setClients({
      ...clients,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

 
    if (clientNameError) {
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("client_name", clients.client_name);
    data.append("client_sort", clients.client_sort);
    
    if (selectedFile) {
      data.append("client_image", selectedFile);
    }

    const form = document.getElementById("addIndiv");
    if (form.checkValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: `${BASE_URL}/api/panel-create-client`,
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success(res.data?.msg || "Client created successfully");
            navigate(`/clients?page=${pageNo}`);
          } else {
            toast.error(res.data?.msg || "Error creating client");
          }
        })
        .catch((error) => {
          console.error("Create error:", error);
          toast.error(error.response?.data?.message || "An error occurred");
        })
        .finally(() => {
          setIsButtonDisabled(false);
          setLoading(false);
        });
    }
  };

  return (
    <Layout>
      <MasterFilter />
      <div className="textfields-wrapper">
        <PageHeader title={"Create Client"} onClick={handleBack} />

        <Card className="p-6 mt-2">
          <form
            id="addIndiv"
            autoComplete="off"
            onSubmit={onSubmit}
            className="p-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div>
                <div className="space-y-6">
                  <div>
                    <Input
                      label="Client Name"
                      type="text"
                      name="client_name"
                      value={clients.client_name}
                      onChange={onInputChange}
                      required
                      labelProps={{
                        className: "!text-gray-600",
                      }}
                      error={!!clientNameError}
                    />
                    {clientNameError && (
                      <p className="mt-1 text-sm text-red-500">
                        {clientNameError}
                      </p>
                    )}
                   
                  </div>

                  <div>
                    <Input
                      label="Client Sort Order"
                      type="number"
                      name="client_sort"
                      value={clients.client_sort}
                      onChange={onInputChange}
                      required
                      labelProps={{
                        className: "!text-gray-600",
                      }}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Lower numbers appear first
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Image <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      required
                      accept="image/*"
                      name="client_image"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Recommended size: 300x200px
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Image Preview */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-xs p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-medium text-center mb-4">
                    Logo Preview
                  </h3>
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={imagePreview}
                        alt="Client logo preview"
                        className="h-40 object-contain mb-4"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-sm"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="h-40 flex flex-col items-center justify-center bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
                    <p className="text-gray-400 mb-2">No image selected</p>
                    <p className="text-xs text-red-400">Image is required</p>
                  </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <ButtonConfigColor
                type="submit"
                buttontype="submit"
                label="Create Client"
                disabled={isButtonDisabled || clientNameError}
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
      </div>
    </Layout>
  );
};

export default ClientsCreateMaster;