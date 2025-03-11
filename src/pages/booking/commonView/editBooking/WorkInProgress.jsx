import React from "react";
import Layout from "../../../../layout/Layout";
import BookingFilter from "../../../../components/BookingFilter";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import { FaHome, FaClipboardList, FaInfoCircle } from "react-icons/fa"; // Icons for the tabs
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Option,
  Select,
  Textarea,
} from "@material-tailwind/react";
import BASE_URL from "../../../../base/BaseUrl";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";

const WorkInProgress = () => {
  const { id } = useParams();
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var midate = "04/04/2022";
  var todayback = yyyy + "-" + mm + "-" + dd;
  var d = document.getElementById("order_service_date");
  if (d) {
    document
      .getElementById("order_service_date")
      .setAttribute("min", todayback);
  }
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [followup, setFollowUp] = useState([]);
  const [orderref, setOrderRef] = useState([]);
  const [open, setOpen] = useState(false);

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

  const [booking, setBooking] = useState({});
  // new design
  const [activeTab, setActiveTab] = useState("bookingDetails");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // Validation function
  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt);

  // Input change handler
  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (["order_amount", "order_payment_amount", "order_comm"].includes(name)) {
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
  useEffect(() => {
    fetchBookingData();
  }, []);

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
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    let data = {
      order_service_date: booking.order_service_date,
      order_amount: booking.order_amount,
      order_time: booking.order_time,
      order_year: "2024-25",
      order_comm: booking.order_comm,
      order_comment: booking.order_comment,
    };

    setIsButtonDisabled(true);

    try {
      const response = await axios.put(
        `${BASE_URL}/api/panel-create-booking-reschedule/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === "200") {
        toast.success(response.data?.msg || "Reschedule Creating Success");
        navigate("/today");
      } else {
        toast.error(response.data?.msg || "Network Error");
      }
    } catch (error) {
      toast.error("An error occurred while rescheduling");
    } finally {
      setLoading(false);
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
                <strong>Customer Name:</strong> {booking.order_customer}
              </Typography>
              <Typography className="text-black">
                <strong>Mobile:</strong> {booking.order_customer_mobile}
              </Typography>
              <Typography className="text-black">
                <strong>Email:</strong> {booking.order_customer_email}
              </Typography>
              e is not defined
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
                <strong>Booking Confirmed By:</strong> {booking.updated_by}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Service:</strong>{" "}
                {booking.order_custom_price <= "1"
                  ? booking.order_service
                  : booking.order_custom}
              </Typography>
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
      default:
        return null;
    }
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
      <PageHeader title={"Resechedule Booking"} />

      <div className="flex gap-4 mt-2">
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
          <Card className="mb-6">
            {/* here booking assign table  */}
            <CardBody>
              {/* <form id="addIdniv"> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="form-group">
                    <Input
                      fullWidth
                      required
                      id="order_service_date"
                      label="Service Date"
                      type="date"
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

                <div className="col-span-2">
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

                <div className="col-span-4">
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
              </div>

           

              <div className="flex justify-center space-x-4 my-2">
                <ButtonConfigColor
                  type="edit"
                  buttontype="submit"
                  label="Update"
                  disabled={isButtonDisabled}
                  loading={loading}
                  onClick={(e) => onSubmit(e)}
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

export default WorkInProgress;
