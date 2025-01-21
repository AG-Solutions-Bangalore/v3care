import React from "react";
import Layout from "../../../../layout/Layout";
import BookingFilter from "../../../../components/BookingFilter";
import { useNavigate, useParams } from "react-router-dom";
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
  Button,
  Select,
} from "@material-tailwind/react";
import BASE_URL from "../../../../base/BaseUrl";
import { toast } from "react-toastify";

const PostponeBooking = () => {
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
  const [booking, setBooking] = useState({});
  // new design
  const [activeTab, setActiveTab] = useState("bookingDetails");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // Validation function
  const validateOnlyDigits = (inputtxt) => /^\d*$/.test(inputtxt);

  //   Input change handler
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
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };
  useEffect(() => {
    fetchBookingData();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    // const form = document.getElementById("addIdniv");

    // if (!form.checkValidity()) {
    //   toast.error("Fill all the filled");
    //   return;
    // }
    let data = {
      order_service_date: booking.order_service_date,
      order_time: booking.order_time,

      order_comm: booking.order_comm,
      order_comment: booking.order_comment,
      order_postpone_reason: booking.order_postpone_reason,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + "/api/panel-update-booking-postpone/" + id,
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "200") {
        toast.success("PostPone Created Successfully");
        navigate("/today");
      } else {
        toast.error("Network error");
      }
    });
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
  return (
    <Layout>
      <BookingFilter />
      <div className="container mx-auto p-4">
        <Typography variant="h4" color="gray" className="mb-6">
          Postpone Booking
        </Typography>

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

                {/* Booking Overview Button */}
                <button
                  onClick={() => setActiveTab("customerInfo")}
                  className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
                    activeTab === "customerInfo"
                      ? "border-green-500 bg-green-100 text-green-600"
                      : "border-transparent hover:bg-green-50"
                  }`}
                >
                  <FaClipboardList />
                  Booking Overview
                </button>

                {/* Other Details Button */}
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

              {/* Main Content Based on Active Tab */}
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
                        label="Commission"
                        name="order_comm"
                        value={booking.order_comm}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-span-4">
                    <div className="form-group">
                      <Input
                        fullWidth
                        label="Comment"
                        multiline
                        name="order_comment"
                        value={booking.order_comment}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="form-group">
                      <Input
                        fullWidth
                        label="Postpone Reason"
                        multiline
                        name="order_postpone_reason"
                        value={booking.order_postpone_reason}
                        onChange={(e) => onInputChange(e)}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <Button
                    type="sumbit"
                    onClick={(e) => onSubmit(e)}
                    className="mr-2 mb-2"
                    color="primary"
                    // disabled={isButtonDisabled}
                  >
                    Update
                  </Button>
                </div>
                {/* </form> */}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostponeBooking;
