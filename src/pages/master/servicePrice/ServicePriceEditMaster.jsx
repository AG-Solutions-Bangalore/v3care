import { Card, Input } from "@material-tailwind/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
// import { BiStatus } from "react-icons/bi";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const ServicePriceEditMaster = () => {
  const { id } = useParams();
  const location = useLocation();
  const { service_id, service_sub_id } = location.state || {};
  UseEscapeKey();
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const [servicesname, setServiceName] = useState({});
  const [servicesupdatestatus, setServiceUpdateStatus] = useState({
    service_id: "",
    service_sub_id: "",
    service_price_status: "",
  });

  const [services, setService] = useState([
    {
      id: "",
      service_price_for: "",
      service_price_rate: "",
      service_price_amount: "",
      service_price_status: "",
      branch_name: "",
      service_weekend_amount: "",
      service_holiday_amount: "",
    },
  ]);
  console.log(servicesupdatestatus, "servicesupdatestatus");
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loadingstatus, setLoadingStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchloading, setFetchLoading] = useState(false);
  const onInputChangeStatus = (event) => {
    const { name, value } = event.target;
    setServiceUpdateStatus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onInputChange = (eventOrValue, rowId, fieldName) => {
    const value = eventOrValue?.target?.value ?? eventOrValue;

    if (
      ["service_price_rate", "service_price_amount"].includes(fieldName) &&
      !/^\d*$/.test(value)
    ) {
      console.log("Invalid input. Only digits are allowed.");
      return;
    }

    const updatedData = services.map((item) =>
      item.id === rowId ? { ...item, [fieldName]: value } : item
    );

    setService(updatedData);
  };

  useEffect(() => {
    const fetchServiceData = async () => {
      setFetchLoading(true);
      setServiceUpdateStatus((prev) => ({
        ...prev,
        service_id: service_id,
        service_sub_id: service_sub_id,
      }));

      try {
        const response = await axios.post(
          `${BASE_URL}/api/panel-fetch-service-price-by-new`,
          {
            service_id,
            service_sub_id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = response.data.serviceprice;
        setServiceName(data[0]);
        const mappedData = Array.isArray(data)
          ? data.map((sub) => ({
              id: sub.id || "",
              service_price_for: sub.service_price_for || "",
              service_price_rate: sub.service_price_rate || "",
              service_price_amount: sub.service_price_amount || "",
              service_price_status: sub.service_price_status || "",
              branch_name: sub.branch_name || "",
              service_weekend_amount: sub.service_weekend_amount || "",
              service_holiday_amount: sub.service_holiday_amount || "",
            }))
          : [
              {
                id: "",
                service_price_for: "",
                service_price_rate: "",
                service_price_amount: "",
                service_price_status: "",
                branch_name: "",
                service_weekend_amount: "",
                service_holiday_amount: "",
              },
            ];

        setService(mappedData);
      } catch (error) {
        console.error("Error fetching service price:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchServiceData();
  }, [service_id, service_sub_id]);

  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/service-price?page=${pageNo}`);
  };
  const onSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    const form = document.getElementById("editServiceForm");

    if (!form.checkValidity()) {
      toast.error("Fill all required");
    } else {
      setIsButtonDisabled(true);

      try {
        const response = await axios.put(
          `${BASE_URL}/api/panel-update-service-price-new/1`,
          { service_price_data: services },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.code == "200") {
          toast.success(response.data?.msg || "update succesfull");
          navigate(`/service-price?page=${pageNo}`);
        } else {
          toast.error(response.data?.msg || "duplicate entry");
        }
      } catch (error) {
        console.error("Error updating service price:", error);
        alert("err, updating service price ");
        setLoading(false);
        setIsButtonDisabled(false);
      } finally {
        setLoading(false);
        setIsButtonDisabled(false);
      }
    }
  };
  const onSubmitStatus = async (e) => {
    setLoadingStatus(true);
    e.preventDefault();
    if (!servicesupdatestatus.service_price_status) {
      setLoadingStatus(false);

      toast.error("Fill The Status");
      return;
    }
    try {
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-service-price-status-all-new/1`,
        servicesupdatestatus,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == "200") {
        toast.success(response.data?.msg || "update succesfull");
        navigate(`/service-price?page=${pageNo}`);
      } else {
        toast.error(response.data?.msg || "duplicate entry");
      }
    } catch (error) {
      console.error("Error updating service price:", error);
      setLoadingStatus(false);
    } finally {
      setLoadingStatus(false);
    }
  };

  const groupedServices = (services || [])
    .filter((item) => item && typeof item === "object" && item.branch_name)
    .reduce((acc, curr) => {
      if (!acc[curr.branch_name]) {
        acc[curr.branch_name] = [];
      }
      acc[curr.branch_name].push(curr);
      return acc;
    }, {});

  return (
    <Layout>
      <MasterFilter />
      <PageHeader
        title={"Edit Service Price"}
        onClick={handleBack}
        label2={
          <div className="flex space-x-3">
            <div>
              <FormControl fullWidth>
                <InputLabel>
                  <span className="text-sm">Status</span>
                </InputLabel>
                <Select
                  name="service_price_status"
                  label="Status"
                  value={servicesupdatestatus.service_price_status || ""}
                  onChange={onInputChangeStatus}
                  sx={{
                    minWidth: 200,
                    width: "100%",
                    height: 36,
                    ".MuiSelect-select": {
                      padding: "8px 12px",
                    },
                  }}
                  size="small"
                  required
                >
                  {statusOptions.map((data) => (
                    <MenuItem key={data.value} value={data.value}>
                      {data.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <ButtonConfigColor
              type="edit"
              buttontype="submit"
              onClick={onSubmitStatus}
              label="Update Status"
              loading={loadingstatus}
            />
          </div>
        }
      />
      {fetchloading ? (
        <LoaderComponent />
      ) : (
        <Card className="p-4 sm:p-6 lg:px-8 mt-2">
          <div className="flex justify-between">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0">
              <h2 className="text-base">
                <span className="font-bold text-black mr-2">Service:</span>
                {servicesname?.service}
              </h2>
              <h2 className="text-base">
                <span className="font-bold text-black mr-2">
                  Service Price:
                </span>
                {servicesname?.service_sub}
              </h2>
            </div>

            <div className="flex justify-center space-x-4 my-2">
              <ButtonConfigColor
                type="edit"
                buttontype="submit"
                onClick={onSubmit}
                label="Update"
                disabled={isButtonDisabled}
                loading={loading}
              />

              <ButtonConfigColor
                type="back"
                buttontype="button"
                label="Cancel"
                onClick={handleBack}
              />
            </div>
          </div>
          <form id="editServiceForm">
            {Object.entries(groupedServices).map(([branchName, rows]) => (
              <div
                key={branchName}
                className="mb-8 border border-gray-300 rounded-md p-4 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-blue-600 mb-4">
                  {branchName}
                </h2>

                {rows.map((row) => (
                  <div key={row.id} className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                      <Input
                        label="Price For"
                        type="text"
                        name="service_price_for"
                        value={row.service_price_for}
                        onChange={(e) =>
                          onInputChange(e, row.id, "service_price_for")
                        }
                        required
                        containerProps={{
                          className: "min-w-0 w-full",
                        }}
                        className="!w-full"
                      />

                      {/* Original Price */}
                      <Input
                        label="Original"
                        type="text"
                        name="service_price_rate"
                        value={row.service_price_rate}
                        onChange={(e) =>
                          onInputChange(e, row.id, "service_price_rate")
                        }
                        required
                        containerProps={{
                          className: "min-w-0 w-full",
                        }}
                        className="!w-full"
                      />

                      {/* Discount Price */}
                      <Input
                        label="Discount"
                        type="text"
                        name="service_price_amount"
                        value={row.service_price_amount}
                        onChange={(e) =>
                          onInputChange(e, row.id, "service_price_amount")
                        }
                        required
                        containerProps={{
                          className: "min-w-0 w-full",
                        }}
                        className="!w-full"
                      />

                      {/* Holiday Price */}
                      <Input
                        label="Holiday"
                        type="text"
                        name="service_holiday_amount"
                        value={row.service_holiday_amount}
                        onChange={(e) =>
                          onInputChange(e, row.id, "service_holiday_amount")
                        }
                        required
                        containerProps={{
                          className: "min-w-0 w-full",
                        }}
                        className="!w-full"
                      />

                      {/* Weekend Price */}
                      <Input
                        label="Weekend"
                        type="text"
                        name="service_weekend_amount"
                        value={row.service_weekend_amount}
                        onChange={(e) =>
                          onInputChange(e, row.id, "service_weekend_amount")
                        }
                        required
                        containerProps={{
                          className: "min-w-0 w-full",
                        }}
                        className="!w-full"
                      />

                      <FormControl
                        fullWidth
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <InputLabel id={`status-select-${row.id}`}>
                          <span className="text-sm">Status</span>
                        </InputLabel>
                        <Select
                          labelId={`status-select-${row.id}`}
                          id={`status-${row.id}`}
                          name="service_price_status"
                          label="Status"
                          value={row.service_price_status}
                          onChange={(e) =>
                            onInputChange(e, row.id, "service_price_status")
                          }
                          sx={{
                            height: "40px",
                            fontSize: "14px",
                          }}
                          required
                        >
                          {statusOptions.map((data) => (
                            <MenuItem key={data.value} value={data.value}>
                              {data.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </form>
        </Card>
      )}
    </Layout>
  );
};

export default ServicePriceEditMaster;
