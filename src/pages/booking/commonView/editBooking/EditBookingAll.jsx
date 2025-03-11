import React from "react";
import Layout from "../../../../layout/Layout";
import BookingFilter from "../../../../components/BookingFilter";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import {
  FaHome,
  FaClipboardList,
  FaInfoCircle,
  FaCommentDots,
} from "react-icons/fa"; // Icons for the tabs
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Option,
  Spinner,
  Textarea,
} from "@material-tailwind/react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import BASE_URL from "../../../../base/BaseUrl";
// import SelectOption from "@material-tailwind/react/components/Select/SelectOption";
import { toast } from "react-toastify";
import MUIDataTable from "mui-datatables";
import { MdEdit } from "react-icons/md";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";

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

  today = mm + "/" + dd + "/" + yyyy;
  var midate = "04/04/2022";
  var todayback = yyyy + "-" + mm + "-" + dd;
  const navigate = useNavigate();
  const [booking, setBooking] = useState({
    order_status: "",
    order_payment_type: "",
    order_payment_amount: "",
  });

  const [paymentmode, setPaymentMode] = useState([]);
  // new design
  const [activeTab, setActiveTab] = useState("bookingDetails");
  const [loading, setLoading] = useState(false);
  const [followup, setFollowUp] = useState([]);
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
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
  const [orderref, setOrderRef] = useState([]);
  const [open, setOpen] = useState(false);

  const [branch, setBranch] = useState([
    {
      id: "",
      branch_name: "",
    },
  ]);

  // console.log(booking.order_followup_date);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // Validation function
  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt);

  // Input change handler
  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (
      [
        "order_amount",
        "order_advance",
        "order_payment_amount",
        "order_comm",
      ].includes(name)
    ) {
      if (validateOnlyDigits(value)) {
        setBooking((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setBooking((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchBookingData = async () => {
    try {
      const response = await axios({
        url: `${BASE_URL}/api/panel-fetch-booking-by-id/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooking(response.data?.booking);
      setOrderRef(response.data?.booking.order_ref);
      setFollowUp(response.data?.bookingFollowup);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  const fetchpaymentData = async () => {
    try {
      const response = await axios({
        url: `${BASE_URL}/api/panel-fetch-payment-mode`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPaymentMode(response.data?.paymentMode);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };
  const fetchBranchData = async () => {
    try {
      const response = await axios({
        url: `${BASE_URL}/api/panel-fetch-branch`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBranch(response.data?.branch);
    } catch (error) {
      console.error("Error fetching bracnh data:", error);
    }
  };
  // console.log(orderref, "man");
  useEffect(() => {
    fetchBranchData();
    fetchBookingData();
    fetchpaymentData();
  }, []);
  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsButtonDisabled(true);

    const data = {
      order_service_date: booking.order_service_date,
      order_amount: booking.order_amount,
      order_advance: booking.order_advance,
      order_time: booking.order_time,
      order_status: booking.order_status,
      order_comm: booking.order_comm,
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
        }
      );

      if (response.data.code === "200") {
        toast.success(response.data?.msg || "Booking Updated Successfully");
        navigate(`/today?page=${pageNo}`);
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
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9", // Adds a bottom border to rows
        },
      };
    },

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
            {loading ? (
              <div className="flex justify-center items-center h-screen">
                <Spinner className="h-10 w-10" color="red" />
              </div>
            ) : (
              <div className="mt-5">
                <MUIDataTable
                  // title={"Followup"}
                  data={followup ? followup : []}
                  columns={columns}
                  options={options}
                />
              </div>
            )}
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
          fetchBookingData();

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
  return (
    <Layout>
      <BookingFilter />
      <PageHeader title={"Edit Booking"} />

      <div className="container mx-auto p-4 ">
        <div className="flex gap-4">
          <div className="flex-grow">
            <div className="mb-2">
              <div className="flex justify-start space-x-4 ">
                {/* Home Deep Cleaning Button */}
                <button
                  onClick={() => setActiveTab("bookingDetails")}
                  className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${activeTab === "bookingDetails"
                      ? "border-blue-500 bg-blue-100 text-blue-600"
                      : "border-transparent hover:bg-blue-50"
                    }`}
                >
                  <FaHome />
                  {booking?.order_service}
                </button>

                <button
                  onClick={() => setActiveTab("additionalInfo")}
                  className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${activeTab === "additionalInfo"
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
                              booking.order_status
                            )}
                          >
                            {branch.map((data, key) => (
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
                      <div className="form-group">
                        <Input
                          fullWidth
                          required
                          label="Time Slot"
                          type="time"
                          name="order_time"
                          value={booking.order_time}
                          onChange={(e) => onInputChange(e)}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="form-group">
                        <Input
                          fullWidth
                          required
                          label="Commission (%)"
                          name="order_comm"
                          value={booking.order_comm}
                          onChange={(e) => onInputChange(e)}
                        />
                      </div>
                    </div>

                    <div>
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

                    <div>
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
                          <InputLabel id="service-select-label">
                            <span className="text-sm relative bottom-[6px]">
                              Payment Mode{" "}
                              <span className="text-red-700">*</span>
                            </span>
                          </InputLabel>
                          <Select
                            sx={{ height: "40px", borderRadius: "5px" }}
                            labelId="service-select-label"
                            id="service-select"
                            name="order_payment_type"
                            value={booking.order_payment_type}
                            onChange={(e) => onInputChange(e)}
                            label="Payment Mode *"
                            required
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
                      />
                    </div>
                  </div>

                  {/* <div className="text-center mt-6">
                    <Button
                      type="sumbit"
                      onClick={(e) => onSubmit(e)}
                      className="mr-2 mb-2"
                      color="primary"
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => navigate(`/booking-reschedule/${id}`)}
                      className="mr-2 mb-2"
                      color="primary"
                    >
                      Work in Progress
                    </Button>
                    <Button
                      onClick={() => navigate(`/postpone-booking/${id}`)}
                      className="mb-2"
                      color="primary"
                    >
                      Postpone
                    </Button>
                  </div> */}

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
                      type="submit"
                      buttontype="button"
                      label="Postpone"
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
                      label="Cancel"
                      onClick={() => navigate(-1)}
                    />
                  </div>
                </CardBody>
              </Card>
            </div>
            <Card className="mb-6">
              <CardHeader floated={false} className=" flex h-12 items-center flex-row justify-between p-4">
                <Typography variant="h6" color="blue-gray">
                  Follow Up
                </Typography>
                <Link
                  onClick={handleClickOpen}
                  className="btn btn-primary text-center text-sm md:text-right text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-md"
                >
                  + Follow up
                </Link>
              </CardHeader>
              {/* here booking assign table  */}
              <CardBody>
                {loading ? (
                  <div className="flex justify-center items-center h-screen">
                    <Spinner className="h-10 w-10" color="red" />
                  </div>
                ) : (
                  <div className="mt-5">
                    <MUIDataTable
                      // title={"Followup"}
                      data={followup ? followup : []}
                      columns={columns}
                      options={options}
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        {/* <DialogTitle>Follow Up</DialogTitle> */}
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
              <Input
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
          <button
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
          </button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default EditBookingAll;
