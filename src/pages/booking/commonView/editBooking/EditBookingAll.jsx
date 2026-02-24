import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookingFilter from "../../../../components/BookingFilter";
import Layout from "../../../../layout/Layout";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
} from "@material-tailwind/react";

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import { FaEdit, FaHome, FaInfoCircle, FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../../base/BaseUrl";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../../components/common/LoaderComponent";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";

const status = [
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "RNR",
    label: "RNR",
  },
  {
    value: "Inspection",
    label: "Inspection",
  },
  {
    value: "Confirmed",
    label: "Confirmed",
  },
  {
    value: "On the way",
    label: "On the way",
  },
  {
    value: "In Progress",
    label: "In Progress",
  },
  {
    value: "Completed",
    label: "Completed",
  },
  {
    value: "Vendor",
    label: "Vendor",
  },
  {
    value: "Cancel",
    label: "Cancel",
  },
];
const EditBookingAll = () => {
  const { id } = useParams();
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  const [openReassignPopup, setOpenReassignPopup] = useState(false);
  const [openEditService, setOpenEditService] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);

  today = mm + "/" + dd + "/" + yyyy;
  const navigate = useNavigate();
  const [booking, setBooking] = useState({
    order_status: "",
    order_person_contact_no: "",
    order_person_name: "",
    order_payment_type: "",
    order_payment_amount: "",
    order_vendor_id: "",
    order_amount: 0,
  });

  const [serviceData, setServiceData] = useState({
    order_service: "",
    order_service_sub: "",
    order_service_price_for: "",
    order_service_price: "",
    order_custom: "",
    order_custom_price: "",
  });

  const [serdata, setSerData] = useState([]);
  const [serdatasub, setSerDataSub] = useState([]);
  const [pricedata, setPriceData] = useState([]);
  const [paymentmode, setPaymentMode] = useState([]);
  const [activeTab, setActiveTab] = useState("bookingDetails");
  const [loading, setLoading] = useState(false);
  const [fetchloading, setFetchLoading] = useState(false);
  const [bookingAssign, setBookingAssign] = useState({});
  const [vendor, setVendor] = useState({});
  const [followup, setFollowUp] = useState([]);
  const [followups, setFollowUps] = useState({
    order_followup_date: moment().format("YYYY-MM-DD"),
    order_followup_description: "",
  });

  const onInputChange1 = (e) => {
    const { name, value } = e.target;
    setFollowUps((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [orderref, setOrderRef] = useState([]);
  const [open, setOpen] = useState(false);

  const [branch, setBranch] = useState([
    {
      id: "",
      branch_name: "",
    },
  ]);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (
      [
        "order_amount",
        "order_discount",
        "order_vendor_amount",
        "order_advance",
        "order_payment_amount",
        "order_comm",
        "order_comm_percentage",
        "order_payment_amount",
      ].includes(name)
    ) {
      if (validateOnlyDigits(value)) {
        setBooking((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setBooking((prev) => ({ ...prev, [name]: value }));
    }
  };
  // Fetch services data for dropdown
  const fetchServices = async () => {
    try {
      const theLoginToken = localStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + theLoginToken,
        },
      };

      const response = await fetch(
        BASE_URL + "/api/panel-fetch-service",
        requestOptions,
      );
      const data = await response.json();
      setSerData(data.service);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Fetch sub-services based on selected service
  const fetchSubServices = async (serviceId) => {
    if (!serviceId) return;

    try {
      const theLoginToken = localStorage.getItem("token");
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + theLoginToken,
        },
      };

      const response = await fetch(
        `${BASE_URL}/api/panel-fetch-service-sub/${serviceId}`,
        requestOptions,
      );
      const data = await response.json();
      setSerDataSub(data.servicesub || []);
    } catch (error) {
      console.error("Error fetching sub-services:", error);
      setSerDataSub([]);
    }
  };

  // Fetch price data
  const fetchPriceData = async (serviceId, subServiceId, priceFor = "") => {
    try {
      let data = {
        order_service: serviceId,
        order_service_sub: subServiceId,
        branch_id: booking.branch_id,
        order_service_date: booking.order_service_date,
      };

      const response = await axios({
        url: BASE_URL + "/api/panel-fetch-service-price",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPriceData(response.data.serviceprice || []);

      // If priceFor is provided, set the price
      if (priceFor && response.data.serviceprice) {
        const selectedPrice = response.data.serviceprice.find(
          (item) => item.id === priceFor,
        );
        if (selectedPrice) {
          setServiceData((prev) => ({
            ...prev,
            order_service_price: selectedPrice.service_price_amount,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching price data:", error);
      setPriceData([]);
    }
  };
  const fetchAllData = async () => {
    setFetchLoading(true);

    try {
      const [bookingRes, paymentRes, branchRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/panel-fetch-booking-by-id/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get(`${BASE_URL}/api/panel-fetch-payment-mode`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get(`${BASE_URL}/api/panel-fetch-branch`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);
      const bookingData = {
        ...bookingRes.data?.booking,
        order_comm: bookingRes.data?.booking?.order_comm || "0",
        order_amount: bookingRes.data?.booking?.order_amount || 0,
      };
      setBooking(bookingData);
      setVendor(bookingRes.data.vendor);
      setBookingAssign(bookingRes.data.bookingAssign);
      setOrderRef(bookingRes.data?.booking?.order_ref);
      setFollowUp(bookingRes.data?.bookingFollowup);
      setPaymentMode(paymentRes.data?.paymentMode);
      setBranch(branchRes.data?.branch);
      setServiceData({
        order_service: bookingRes.data?.booking?.order_service || "",
        order_service_sub: bookingRes.data?.booking?.order_service_sub || "",
        order_service_price_for:
          bookingRes.data?.booking?.order_service_price_for || "",
        order_service_price:
          bookingRes.data?.booking?.order_service_price || "",
        order_custom: bookingRes.data?.booking?.order_custom || "",
        order_custom_price: bookingRes.data?.booking?.order_custom_price || "",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFetchLoading(false);
    }
  };
  const [timeslot, setTimeSlot] = useState([]);
  useEffect(() => {
    fetch(BASE_URL + "/api/panel-fetch-timeslot-out")
      .then((response) => response.json())
      .then((data) => setTimeSlot(data.timeslot));
  }, []);

  useEffect(() => {
    fetchAllData();
    fetchServices();
  }, [id]);
  useEffect(() => {
    if (serviceData.order_service) {
      fetchSubServices(serviceData.order_service);

      // If there's existing sub-service and priceFor, fetch price data
      if (
        serviceData.order_service_sub &&
        serviceData.order_service_price_for
      ) {
        fetchPriceData(
          serviceData.order_service,
          serviceData.order_service_sub,
          serviceData.order_service_price_for,
        );
      } else {
        fetchPriceData(
          serviceData.order_service,
          serviceData.order_service_sub,
        );
      }
    }
  }, [serviceData.order_service]);

  // When sub-service changes in modal
  useEffect(() => {
    if (serviceData.order_service && serviceData.order_service_sub) {
      fetchPriceData(serviceData.order_service, serviceData.order_service_sub);
    }
  }, [serviceData.order_service_sub]);

  // Handle price for change in modal
  const handlePriceForChange = (e) => {
    const { value } = e.target;
    setServiceData((prev) => ({
      ...prev,
      order_service_price_for: value,
    }));

    // Find and set the price
    const selectedPrice = pricedata.find((item) => item.id === value);
    if (selectedPrice) {
      setServiceData((prev) => ({
        ...prev,
        order_service_price: selectedPrice.service_price_amount,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const missingFields = [];

    if (booking.order_amount === undefined || booking.order_amount === null) {
      missingFields.push("Amount");
    }
    if (!booking.order_comm_percentage && booking.order_vendor_id) {
      missingFields.push("Commission (%) or Vendor ID");
    }
    if (!booking.order_comm && booking.order_vendor_id) {
      missingFields.push("Commission Amount or Vendor ID");
    }
    if (!booking.order_time) {
      missingFields.push("Time Slot");
    }
    if (!booking.branch_id) {
      missingFields.push("Branch");
    }
    if (!booking.order_status) {
      missingFields.push("Status");
    }

    if (missingFields.length > 0) {
      toast.error(
        `Please fill the following required fields: ${missingFields.join(", ")}`,
      );
      return;
    }

    setLoading(true);
    setIsButtonDisabled(true);

    const data = {
      order_service_date: booking.order_service_date,
      order_amount: booking.order_amount,
      order_person_contact_no: booking.order_person_contact_no,
      order_person_name: booking.order_person_name,
      order_advance: booking.order_advance,
      order_time: booking.order_time,
      order_status: booking.order_status,
      order_discount: booking.order_discount,
      order_vendor_amount: booking.order_vendor_amount,
      order_comm: booking.order_comm,
      order_comm_percentage: booking.order_comm_percentage,
      order_comment: booking.order_comment,
      order_payment_amount: booking.order_payment_amount,
      order_payment_type: booking.order_payment_type,
      order_transaction_details: booking.order_transaction_details,
      branch_id: booking.branch_id,
      order_area: booking.order_area,
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-booking/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.code == "200") {
        toast.success(response.data?.msg || "Booking Updated Successfully");
        navigate(-1);
      } else {
        toast.error(response.data?.msg || "Network Error");
      }
    } catch (error) {
      console.error("Error updating booking", error);
      toast.error("Error updating booking");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateService = async () => {
    if (!serviceData.order_service) {
      toast.error("Please select a service");
      return;
    }

    if (serviceData.order_service === "1") {
      if (!serviceData.order_custom || !serviceData.order_custom_price) {
        toast.error("Please fill custom service details");
        return;
      }
    } else {
      if (
        !serviceData.order_service_price_for ||
        !serviceData.order_service_price
      ) {
        toast.error("Please fill service price details");
        return;
      }
    }

    setServiceLoading(true);

    try {
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-booking-service/${id}`,
        serviceData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.code == "200") {
        toast.success(response.data?.msg || "Service updated successfully");
        setOpenEditService(false);
        // Refresh the booking data
        fetchAllData();
      } else {
        toast.error(response.data?.msg || "Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Error updating service");
    } finally {
      setServiceLoading(false);
    }
  };
  const columns = [
    {
      name: "order_followup_date",
      label: " Date ",
      options: {
        filter: false,
        sort: false,

        customBodyRender: (value) => {
          return moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "order_followup_description",
      label: " Comment ",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: false,
    download: false,
    print: false,
    search: false,
    filter: false,
    setRowProps: () => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
        },
      };
    },
    customToolbar: () => {
      return (
        <>
          <>
            <ButtonConfigColor
              type="create"
              label="Follow Up"
              onClick={handleClickOpen}
            />
          </>
        </>
      );
    },
  };
  const handleShareAction = async (type) => {
    let url = "";

    switch (type) {
      case "reschedule":
        url = `${BASE_URL}/api/panel-send-whatsapp-reschedule-booking/${id}`;
        break;
      case "postpone":
        url = `${BASE_URL}/api/panel-send-whatsapp-postpone-booking/${id}`;
        break;
      case "feedback":
        url = `${BASE_URL}/api/panel-send-whatsapp-feedback-booking/${id}`;
        break;
      case "reconfirmed":
        url = `${BASE_URL}/api/panel-send-whatsapp-reconfirmed-booking/${id}`;
        break;
      default:
        return;
    }

    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data?.code === 200) {
        toast.success(res.data?.msg || "Message sent successfully");
      } else {
        toast.error(res.data?.msg || "Something went wrong");
      }
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "bookingDetails":
      case "customerInfo":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>ID:</strong> {booking.order_ref} ({booking.order_status}
                )
              </Typography>
              <Typography className="text-black">
                <strong>Name:</strong> {booking.order_customer}
              </Typography>
              <Typography className="text-black">
                <strong>Mobile:</strong> {booking.order_customer_mobile}
              </Typography>
              <Typography className="text-black">
                <strong>Alternative Mobile:</strong>{" "}
                {booking.order_customer_alt_mobile}
              </Typography>
              <Typography className="text-black">
                <strong>Email:</strong> {booking.order_customer_email}
              </Typography>
              <Typography className="text-black">
                <strong>Booking Created By:</strong> {booking.created_by}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Date:</strong>{" "}
                {moment(booking.order_date).format("DD-MM-YYYY")}
              </Typography>
              <Typography className="text-black">
                <strong>Service Date:</strong>{" "}
                {moment(booking.order_service_date).format("DD-MM-YYYY")}
              </Typography>
              <Typography className="text-black">
                <strong>Slot Time:</strong> {booking.order_time}
              </Typography>
              <Typography className="text-black">
                <strong>Service:</strong>{" "}
                {booking.order_custom_price <= "1"
                  ? booking.order_service
                  : booking.order_custom}
              </Typography>
              <Typography className="text-black">
                <strong>Booking Confirmed By:</strong> {booking.updated_by}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Sub-service:</strong>{" "}
                {booking.order_custom_price <= "1"
                  ? booking.order_service_sub
                  : ""}
              </Typography>
              <Typography className="text-black">
                <strong>Booked Price:</strong> {booking.order_service_price_for}{" "}
                -{" "}
                {booking.order_custom_price <= "1"
                  ? booking.order_service_price
                  : booking.order_custom_price}
              </Typography>
              <Typography className="text-black">
                <strong>Current Price:</strong>{" "}
                {booking.order_service_price_for} - {booking.order_amount}
              </Typography>
              {booking.order_vendor_id !== null && (
                <Typography className="text-black">
                  <strong>Vendor:</strong> {vendor.vendor_company}
                </Typography>
              )}
              <button
                onClick={() => setOpenEditService(true)}
                className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                <FaEdit size={14} />
                Edit Service
              </button>
            </div>
          </div>
        );
      case "additionalInfo":
      case "location":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Area:</strong> {booking.order_area}
              </Typography>
              <Typography className="text-black">
                <strong>Branch:</strong> {booking.branch_name}
              </Typography>
              <Typography className="text-black">
                <strong>Address:</strong> {booking.order_flat},{" "}
                {booking.order_building}, {booking.order_landmark},{" "}
                {booking.order_address}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Remarks:</strong> {booking.order_remarks}
              </Typography>
              <Typography className="text-black">
                <strong>Advanced:</strong> {booking.order_advance}
              </Typography>
              <Typography className="text-black">
                <strong>Distance:</strong> {booking.order_km} Km
              </Typography>
            </div>
          </div>
        );
      case "followUp":
      case "followUplocation":
        return (
          <div>
            <div className="mt-5">
              <MUIDataTable
                data={followup ? followup : []}
                columns={columns}
                options={options}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  const disabledStatuses = [
    "On the way",
    "In Progress",
    "Completed",
    "Vendor",
    "Cancel",
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFollowUps({
      order_followup_description: "",
      order_followup_date: moment().format("YYYY-MM-DD"),
    });
  };

  const onSubmitFollowup = (e) => {
    e.preventDefault();
    if (!followups.order_followup_description.trim()) {
      toast.error("Order Follow-up Description is required");
      return;
    }
    setIsButtonDisabled(true);
    const data = {
      order_ref: orderref,
      order_followup_date: followups.order_followup_date,
      order_followup_description: followups.order_followup_description,
    };
    axios
      .post(`${BASE_URL}/api/panel-create-booking-followup`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.code == "200") {
          toast.success(res.data?.msg || "Followup Created Successfully");
          handleClose();
          fetchAllData();

          setFollowUps({
            order_followup_description: "",
            order_followup_date: moment().format("YYYY-MM-DD"),
          });
        } else {
          toast.error(res.data?.msg || "Network Error");
        }
      })
      .catch((err) => {
        console.error("Error updating Followup", err);
        toast.error("Error updating Followup");
      });
  };

  // const autoCommissionCalc =
  //   Math.round((booking.order_amount * booking.order_comm_percentage) / 100) ||
  //   0;

   
const autoCommissionCalc = 
  booking.order_vendor_amount && parseFloat(booking.order_vendor_amount) > 0 
    ? Math.round((parseFloat(booking.order_vendor_amount) * parseFloat(booking.order_comm_percentage)) / 100) 
    : 0;
  return (
    <Layout>
      <BookingFilter />
      <PageHeader title={"Edit Booking"} />
      {fetchloading ? (
        <LoaderComponent />
      ) : (
        <div className="container mx-auto p-4 ">
          <div className="flex gap-4">
            <div className="flex-grow">
              <div className="mb-2">
                <div className="flex justify-start space-x-4 ">
                  {/* Home Deep Cleaning Button */}
                  <button
                    onClick={() => setActiveTab("bookingDetails")}
                    className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
                      activeTab === "bookingDetails"
                        ? "border-blue-500 bg-blue-100 text-blue-600"
                        : "border-transparent hover:bg-blue-50"
                    }`}
                  >
                    <FaHome />
                    {booking?.order_service}
                  </button>

                  <button
                    onClick={() => setActiveTab("additionalInfo")}
                    className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
                      activeTab === "additionalInfo"
                        ? "border-red-500 bg-red-100 text-red-600"
                        : "border-transparent hover:bg-red-50"
                    }`}
                  >
                    <FaInfoCircle />
                    Other Details
                  </button>
                </div>

                <Card className="mt-2">
                  <CardBody>{renderActiveTabContent()}</CardBody>
                </Card>
              </div>

              {/* Payment Card */}
              <div className={`${activeTab === "followUp" ? "hidden" : ""}`}>
                <Card className="mb-6">
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                      <div className="form-group">
                        <Input
                          label="Person Name"
                          name="order_person_name"
                          value={booking.order_person_name}
                          onChange={(e) => onInputChange(e)}
                        />
                      </div>
                      <div className="form-group">
                        <Input
                          label="Person Contact No"
                          name="order_person_contact_no"
                          value={booking.order_person_contact_no}
                          onChange={(e) => onInputChange(e)}
                          minLength={10}
                          maxLength={10}
                          onKeyDown={(e) => {
                            if (
                              [
                                "Backspace",
                                "Delete",
                                "Tab",
                                "Escape",
                                "Enter",
                                "ArrowLeft",
                                "ArrowRight",
                                "Home",
                                "End",
                              ].includes(e.key)
                            ) {
                              return;
                            }

                            if (!/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <div>
                          <FormControl fullWidth>
                            <InputLabel id="service-select-label">
                              <span className="text-sm relative bottom-[6px]">
                                Status <span className="text-red-700">*</span>
                              </span>
                            </InputLabel>
                            <Select
                              sx={{ height: "40px", borderRadius: "5px" }}
                              labelId="service-select-label"
                              id="service-select"
                              name="order_status"
                              value={booking.order_status}
                              onChange={(e) => onInputChange(e)}
                              label="Status *"
                              required
                            >
                              {status.map((data) => (
                                <MenuItem key={data.value} value={data.value}>
                                  {data.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                      <div>
                        <div>
                          <FormControl fullWidth>
                            <InputLabel id="service-select-label">
                              <span className="text-sm relative bottom-[6px]">
                                Branch <span className="text-red-700">*</span>
                              </span>
                            </InputLabel>
                            <Select
                              sx={{ height: "40px", borderRadius: "5px" }}
                              labelId="service-select-label"
                              id="service-select"
                              name="branch_id"
                              value={booking?.branch_id || ""}
                              onChange={(e) => onInputChange(e)}
                              label="Branch *"
                              required
                              disabled={disabledStatuses.includes(
                                booking.order_status,
                              )}
                            >
                              {branch.map((data) => (
                                <MenuItem key={data.id} value={data.id}>
                                  {data.branch_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>

                      <div>
                        <div className="form-group">
                          <Input
                            fullWidth
                            required
                            id="order_service_date"
                            label="Service Date"
                            type="date"
                            disabled
                            labelProps={{
                              className: "!text-gray-600 ",
                            }}
                            min={today}
                            name="order_service_date"
                            value={booking.order_service_date}
                            onChange={(e) => onInputChange(e)}
                          />
                        </div>
                      </div>

                      <div>
                        <FormControl fullWidth>
                          <InputLabel id="order_time-label">
                            <span className="text-sm relative bottom-[6px]">
                              Time Slot<span className="text-red-700">*</span>
                            </span>
                          </InputLabel>
                          <Select
                            sx={{ height: "40px", borderRadius: "5px" }}
                            labelId="order_time-label"
                            id="order_time"
                            name="order_time"
                            value={booking.order_time}
                            onChange={(e) => onInputChange(e)}
                            label="Time Slot *"
                            required
                          >
                            {timeslot.map((data) => (
                              <MenuItem
                                key={data.value}
                                value={data?.time_slot}
                              >
                                {data?.time_slot}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      {/* {booking?.order_vendor_id !== null && (
                        <>
                          <div className="form-group relative">
                            <Input
                              fullWidth
                              required={booking.order_vendor_id}
                              label="Commission (%)"
                              name="order_comm_percentage"
                              value={booking.order_comm_percentage}
                              onChange={(e) => onInputChange(e)}
                            />
                            <span
                              className="absolute right-2 bottom-2 text-gray-500 cursor-pointer hover:text-blue-500"
                              onClick={() => {
                                setBooking((prev) => ({
                                  ...prev,
                                  order_comm: autoCommissionCalc,
                                }));
                              }}
                            >
                              (₹{autoCommissionCalc})
                            </span>
                          </div>

                          <div>
                            <div className="form-group ">
                              <Input
                                fullWidth
                                required={booking.order_vendor_id}
                                label="Commission Amount"
                                name="order_comm"
                                value={booking.order_comm}
                                onChange={(e) => onInputChange(e)}
                              />
                            </div>
                          </div>
                        </>
                      )} */}


{booking?.order_vendor_id !== null && (
  <>
    <div className="form-group relative">
      <Input
        fullWidth
        required={booking.order_vendor_id}
        label="Commission (%)"
        name="order_comm_percentage"
        value={booking.order_comm_percentage}
        onChange={(e) => onInputChange(e)}
      />
      <span
        className="absolute right-2 bottom-2 text-gray-500 cursor-pointer hover:text-blue-500"
        onClick={() => {
          setBooking((prev) => ({
            ...prev,
            order_comm: booking.order_vendor_amount && parseFloat(booking.order_vendor_amount) > 0 
              ? Math.round((parseFloat(booking.order_vendor_amount) * parseFloat(prev.order_comm_percentage)) / 100)
              : 0,
          }));
        }}
      >
        (₹{
          booking.order_vendor_amount && parseFloat(booking.order_vendor_amount) > 0 && booking.order_comm_percentage
            ? Math.round((parseFloat(booking.order_vendor_amount) * parseFloat(booking.order_comm_percentage)) / 100)
            : 0
        })
      </span>
    </div>

    <div>
      <div className="form-group ">
        <Input
          fullWidth
          required={booking.order_vendor_id}
          label="Commission Amount"
          name="order_comm"
          value={booking.order_comm}
          onChange={(e) => onInputChange(e)}
        />
      </div>
    </div>
  </>
)}
                      <div
                        className={`${
                          booking?.order_vendor_id == null ? " col-span-2" : ""
                        }`}
                      >
                        <div className="form-group">
                          <Input
                            fullWidth
                            required
                            label="Amount"
                            name="order_amount"
                            value={booking.order_amount}
                            onChange={(e) => onInputChange(e)}
                          />
                        </div>
                      </div>
                      <div
                        className={`${
                          booking?.order_vendor_id == null ? " col-span-2" : ""
                        }`}
                      >
                        <div className="form-group">
                          <Input
                            fullWidth
                            label="Vendor Amount"
                            name="order_vendor_amount"
                            value={booking.order_vendor_amount}
                            onChange={(e) => onInputChange(e)}
                          />
                        </div>
                      </div>

                      <div
                        className={`${
                          booking?.order_vendor_id == null ? " col-span-2" : ""
                        }`}
                      >
                        <div className="form-group">
                          <Input
                            fullWidth
                            label="Advance"
                            name="order_advance"
                            value={booking.order_advance}
                            onChange={(e) => onInputChange(e)}
                          />
                        </div>
                      </div>
                      <div
                        className={`${
                          booking?.order_vendor_id == null ? " col-span-2" : ""
                        }`}
                      >
                        <div className="form-group">
                          <Input
                            fullWidth
                            label="Discount"
                            name="order_discount"
                            value={booking.order_discount}
                            onChange={(e) => onInputChange(e)}
                          />
                        </div>
                      </div>

                      <div
                        className={`${
                          booking?.order_vendor_id == null ? " col-span-2" : ""
                        }`}
                      >
                        <div className="form-group">
                          <Input
                            fullWidth
                            label="Balance"
                            name="order_balance"
                            labelProps={{
                              className: "!text-gray-600 ",
                            }}
                            value={
                              (parseFloat(booking.order_amount) || 0) -
                              ((parseFloat(booking.order_advance) || 0) +
                                (parseFloat(booking.order_discount) || 0))
                            }
                            disabled
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-4">
                      <div className="md:col-span-8">
                        <div className="form-group">
                          <Textarea
                            fullWidth
                            label="Comment"
                            multiline
                            name="order_comment"
                            value={booking.order_comment}
                            onChange={(e) => onInputChange(e)}
                            maxLength={980}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-4 space-y-3">
                        <div>
                          <div className="form-group">
                            <Input
                              fullWidth
                              label="Paid Amount"
                              name="order_payment_amount"
                              value={booking.order_payment_amount}
                              onChange={(e) => onInputChange(e)}
                            />
                          </div>
                        </div>

                        <div className="col-span-3">
                          <FormControl fullWidth>
                            <InputLabel id="order_payment_type-label">
                              <span className="text-sm relative bottom-[6px]">
                                Payment Mode{" "}
                              </span>
                            </InputLabel>
                            <Select
                              sx={{ height: "40px", borderRadius: "5px" }}
                              labelId="order_payment_type-label"
                              id="service-order_payment_type"
                              name="order_payment_type"
                              value={booking.order_payment_type}
                              onChange={(e) => onInputChange(e)}
                              label="Payment Mode"
                            >
                              {paymentmode.map((data) => (
                                <MenuItem
                                  key={data.payment_mode}
                                  value={data.payment_mode}
                                >
                                  {data.payment_mode}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="form-group">
                        <Textarea
                          fullWidth
                          label="Transaction Details"
                          name="order_transaction_details"
                          value={booking.order_transaction_details}
                          onChange={(e) => onInputChange(e)}
                          maxLength={980}
                        />
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4 my-2">
                      <ButtonConfigColor
                        type="edit"
                        buttontype="submit"
                        label="Update"
                        disabled={isButtonDisabled}
                        loading={loading}
                        onClick={onSubmit}
                      />
                      <ButtonConfigColor
                        type="edit"
                        buttontype="button"
                        label="Reassign / Add Service"
                        onClick={() => setOpenReassignPopup(true)}
                      />

                      <ButtonConfigColor
                        type="submit"
                        buttontype="button"
                        label="Cancel / Postponed"
                        onClick={() => navigate(`/postpone-booking/${id}`)}
                      />
                      <ButtonConfigColor
                        type="submit"
                        label="Work in Progress"
                        onClick={() => navigate(`/booking-reschedule/${id}`)}
                      />

                      <ButtonConfigColor
                        type="back"
                        buttontype="button"
                        label="Back"
                        onClick={() => navigate(-1)}
                      />
                      <Popover placement="bottom-start" offset={10}>
                        <PopoverHandler>
                          <div className="inline-block">
                            <Button
                              color="green"
                              className="flex items-center gap-2"
                            >
                              <FaWhatsapp size={18} />
                              Share
                            </Button>
                          </div>
                        </PopoverHandler>

                        <PopoverContent className="flex flex-col gap-2 w-64">
                          <Button
                            fullWidth
                            onClick={() => handleShareAction("reschedule")}
                          >
                            Reschedule Booking
                          </Button>

                          <Button
                            fullWidth
                            onClick={() => handleShareAction("postpone")}
                          >
                            Postpone Booking
                          </Button>

                          <Button
                            fullWidth
                            onClick={() => handleShareAction("feedback")}
                          >
                            Feedback Booking
                          </Button>

                          <Button
                            fullWidth
                            onClick={() => handleShareAction("reconfirmed")}
                          >
                            Reconfirmed Booking
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <Card className="mb-6">
                <CardHeader floated={false} className="h-12 p-4">
                  <Typography variant="h6" color="blue-gray">
                    Booking Assign
                  </Typography>
                </CardHeader>
                <CardBody>
                  {bookingAssign.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full table-auto border-collapse ">
                        <thead>
                          <tr className="bg-gray-200 text-left ">
                            <th className="p-3 border border-gray-700">
                              <span className="text-gray-700">Full Name</span>
                            </th>
                            <th className="p-3 border border-gray-700">
                              <span className="text-gray-700">Start Time</span>
                            </th>
                            <th className="p-3 border border-gray-700">
                              <span className="text-gray-700">
                                On the Way Time
                              </span>
                            </th>
                            <th className="p-3 border border-gray-700">
                              <span className="text-gray-700">End Time</span>
                            </th>
                            <th className="p-3 border border-gray-700">
                              <span className="text-gray-700">Remarks</span>
                            </th>
                            <th className="p-3 border border-gray-700">
                              <span className="text-gray-700">Status</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingAssign.map((dataSumm, key) => (
                            <tr
                              key={key}
                              className="bg-white border-b hover:bg-gray-50"
                            >
                              <td className="p-3 border border-gray-700">
                                <span className="text-gray-900">
                                  {dataSumm.name}
                                </span>
                              </td>
                              <td className="p-3 border border-gray-700">
                                <span className="text-gray-900">
                                  {dataSumm.order_start_time}
                                </span>
                              </td>
                              <td className="p-3 border border-gray-700">
                                <span className="text-gray-900">
                                  {dataSumm.order_way_time}
                                </span>
                              </td>
                              <td className="p-3 border border-gray-700">
                                <span className="text-gray-900">
                                  {dataSumm.order_end_time}
                                </span>
                              </td>
                              <td className="p-3 border border-gray-700">
                                <span className="text-gray-900">
                                  {dataSumm.order_assign_remarks}
                                </span>
                              </td>
                              <td className="p-3 border border-gray-700">
                                <span
                                  className={`${
                                    dataSumm.order_assign_status === "Completed"
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  {dataSumm.order_assign_status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <h1 className="text-gray-700 text-lg">
                        No Data Available
                      </h1>
                    </div>
                  )}
                </CardBody>
              </Card>
              <Card className="mb-6">
                <CardBody>
                  <MUIDataTable
                    title={"Followup"}
                    data={followup ? followup : []}
                    columns={columns}
                    options={options}
                  />
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogContent>
          <div className="mb-5">
            <h1 className="font-bold text-xl"> Create Follow Up</h1>
          </div>
          <div className="space-y-4">
            <div>
              <Input
                fullWidth
                label="Order Follow up Date"
                name="order_followup_date"
                value={followups.order_followup_date}
                onChange={(e) => onInputChange(e)}
                type="date"
                disabled
                labelProps={{
                  className: "!text-gray-900",
                }}
                required
              />
            </div>
            <div>
              <Textarea
                type="text"
                fullWidth
                label="Order Follow up"
                name="order_followup_description"
                value={followups.order_followup_description}
                onChange={onInputChange1}
                required
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          {/* <button
            onClick={handleClose}
            className="btn btn-primary text-center md:text-right text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
            type="sumbit"
            onClick={(e) => onSubmitFollowup(e)}
          >
            Submit
          </button> */}

          <div className="flex justify-center space-x-4 my-2">
            <ButtonConfigColor
              type="back"
              buttontype="button"
              label="Cancel"
              onClick={handleClose}
            />
            <ButtonConfigColor
              type="submit"
              buttontype="submit"
              label="Submit"
              loading={loading}
              onClick={(e) => onSubmitFollowup(e)}
            />
          </div>
        </DialogActions>
      </Dialog>
      {/* Edit Service Modal */}
      {/* <Dialog
        open={openEditService}
        onClose={() => setOpenEditService(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          <div className="mb-5">
            <h1 className="font-bold text-xl">Edit Service Details</h1>
          </div>

          <div className="space-y-4">
       
            <div>
              <FormControl fullWidth>
                <InputLabel id="order_service-label">
                  <span className="text-sm relative bottom-[6px]">
                    Service <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="order_service-label"
                  id="order_service"
                  name="order_service"
                  value={serviceData.order_service}
                  onChange={(e) => onServiceChange(e)}
                  label="Service *"
                  required
                >
                  {serdata.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.service}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

           
            {serviceData.order_service !== "1" && serdatasub.length > 0 && (
              <div>
                <FormControl fullWidth>
                  <InputLabel id="order_service_sub-label">
                    <span className="text-sm relative bottom-[6px]">
                      Service Sub <span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="order_service_sub-label"
                    id="order_service_sub"
                    name="order_service_sub"
                    value={serviceData.order_service_sub}
                    onChange={(e) => onServiceChange(e)}
                    label="Service Sub *"
                    required
                  >
                    {serdatasub.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.service_sub}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

         
            {serviceData.order_service !== "1" && pricedata.length > 0 && (
              <div>
                <FormControl fullWidth>
                  <InputLabel id="order_service_price_for-label">
                    <span className="text-sm relative bottom-[6px]">
                      Price For <span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="order_service_price_for-label"
                    id="order_service_price_for"
                    name="order_service_price_for"
                    value={serviceData.order_service_price_for}
                    onChange={handlePriceForChange}
                    label="Price For *"
                    required
                  >
                    {pricedata.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.service_price_for} - {data.service_price_rate}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}

          
            {serviceData.order_service !== "1" && (
              <div>
                <Input
                  fullWidth
                  label="Service Price"
                  name="order_service_price"
                  value={serviceData.order_service_price}
                  onChange={(e) => onServiceChange(e)}
                  required
                />
              </div>
            )}

           
            {serviceData.order_service === "1" && (
              <>
                <div>
                  <Input
                    fullWidth
                    label="Custom Service"
                    name="order_custom"
                    value={serviceData.order_custom}
                    onChange={(e) => onServiceChange(e)}
                    required
                  />
                </div>
                <div>
                  <Input
                    fullWidth
                    label="Custom Price"
                    name="order_custom_price"
                    value={serviceData.order_custom_price}
                    onChange={(e) => onServiceChange(e)}
                    required
                  />
                </div>
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex justify-center space-x-4 my-2">
            <ButtonConfigColor
              type="back"
              buttontype="button"
              label="Cancel"
              onClick={() => setOpenEditService(false)}
            />
            <ButtonConfigColor
              type="submit"
              buttontype="submit"
              label="Update Service"
              loading={serviceLoading}
              onClick={handleUpdateService}
            />
          </div>
        </DialogActions>
      </Dialog> */}
{/* Edit Service Modal */}
<Dialog
  open={openEditService}
  onClose={() => setOpenEditService(false)}
  fullWidth
  maxWidth="md"
>
  <DialogContent>
    <div className="mb-5">
      <h1 className="font-bold text-xl">Edit Service Details</h1>
    </div>

    <div className="space-y-4">

      <div>
        <FormControl fullWidth>
          <InputLabel id="order_service-label">
            <span className="text-sm relative bottom-[6px]">
              Service <span className="text-red-700">*</span>
            </span>
          </InputLabel>
          <Select
            sx={{ height: "40px", borderRadius: "5px" }}
            labelId="order_service-label"
            id="order_service"
            name="order_service"
            value={serviceData.order_service}
            onChange={(e) => onServiceChange(e)}
            label="Service *"
            required
          >
            {serdata.map((data) => (
              <MenuItem key={data.id} value={data.id}>
                {data.service}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      
      {serviceData.order_service == "1" ? (
        <>
          <div>
            <Input
              fullWidth
              label="Custom Service"
              name="order_custom"
              value={serviceData.order_custom}
              onChange={(e) => onServiceChange(e)}
              required
              placeholder="Enter custom service name"
            />
          </div>
          <div>
            <Input
              fullWidth
              label="Custom Price"
              name="order_custom_price"
              value={serviceData.order_custom_price}
              onChange={(e) => onServiceChange(e)}
              required
              placeholder="Enter custom price"
            />
          </div>
        </>
      ) : (
      
        <>
      
          {serdatasub.length > 0 && (
            <div>
              <FormControl fullWidth>
                <InputLabel id="order_service_sub-label">
                  <span className="text-sm relative bottom-[6px]">
                    Service Sub <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="order_service_sub-label"
                  id="order_service_sub"
                  name="order_service_sub"
                  value={serviceData.order_service_sub}
                  onChange={(e) => onServiceChange(e)}
                  label="Service Sub *"
                  required
                >
                  {serdatasub.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.service_sub}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

         
          {pricedata.length > 0 && (
            <div>
              <FormControl fullWidth>
                <InputLabel id="order_service_price_for-label">
                  <span className="text-sm relative bottom-[6px]">
                    Price For <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="order_service_price_for-label"
                  id="order_service_price_for"
                  name="order_service_price_for"
                  value={serviceData.order_service_price_for}
                  onChange={handlePriceForChange}
                  label="Price For *"
                  required
                >
                  {pricedata.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.service_price_for} - {data.service_price_rate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

        
          <div>
            <Input
              fullWidth
              label="Service Price"
              name="order_service_price"
              value={serviceData.order_service_price}
              onChange={(e) => onServiceChange(e)}
              required
            />
          </div>
        </>
      )}
    </div>
  </DialogContent>
  <DialogActions>
    <div className="flex justify-center space-x-4 my-2">
      <ButtonConfigColor
        type="back"
        buttontype="button"
        label="Cancel"
        onClick={() => setOpenEditService(false)}
      />
      <ButtonConfigColor
        type="submit"
        buttontype="submit"
        label="Update Service"
        loading={serviceLoading}
        onClick={handleUpdateService}
      />
    </div>
  </DialogActions>
</Dialog>
      <Dialog
        open={openReassignPopup}
        onClose={() => setOpenReassignPopup(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogContent>
          <h2 className="text-lg font-semibold mb-4">Reassign / Add Service</h2>
          <p className="text-gray-700">Please select the appropriate</p>
        </DialogContent>

        <DialogActions>
          <div className="flex justify-center space-x-4 my-2">
            <ButtonConfigColor
              type="submit"
              buttontype="button"
              label="Reassign the service"
              onClick={() => {
                setOpenReassignPopup(false);
                navigate(`/add-booking-reassign/${id}`);
              }}
            />
            <ButtonConfigColor
              type="edit"
              buttontype="button"
              label="Add Service"
              onClick={() => {
                setOpenReassignPopup(false);
                navigate(`/add-booking-reassign-wo-service/${id}`);
              }}
            />
          </div>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default EditBookingAll;
