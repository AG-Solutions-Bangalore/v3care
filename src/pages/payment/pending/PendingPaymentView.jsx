import { useParams } from "react-router-dom";
import Layout from "../../../layout/Layout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaCreditCard,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaFileAlt,
  FaCommentAlt,
  FaExclamationTriangle,
  FaDollarSign,
} from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import BASE_URL from "../../../base/BaseUrl";

const PendingPaymentView = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState({});
  const [payment, setPayment] = useState({
    order_check_payment_type: "",
    order_check_payment_details: "",
  });
  const [bookingAssign, setBookingAssign] = useState({});
  const [vendor, setVendor] = useState({});
  const [paymentModes, setPaymentModes] = useState([]);

  useEffect(() => {
    fetchBookingData();
    fetchPaymentModes();
  }, []);

  const fetchBookingData = async () => {
    try {
      const response = await axios({
        url: `${BASE_URL}/api/panel-fetch-booking-view-by-id/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooking(response.data?.booking);
      console.log("set booking", response.data?.booking);
      setBookingAssign(response.data.bookingAssign);
      console.log("setbooking assign", response.data?.bookingAssign);
      setVendor(response.data.vendor);
      console.log("vendor data", response.data?.vendor);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  const fetchPaymentModes = async () => {
    try {
      const response = await axios({
        url: `${BASE_URL}/api/panel-fetch-payment-mode`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPaymentModes(response.data.paymentMode);
    } catch (error) {
      console.error("Error fetching payment modes:", error);
    }
  };

  const onInputChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const onMap = (e) => {
    e.preventDefault();
    const mapurl = booking?.order_url;
    window.open(mapurl, "_blank");
  };

  const updateData = async (e) => {
    e.preventDefault();
    try {
      await axios({
        url: `${BASE_URL}/api/panel-update-payment-status/${id}`,
        method: "PUT",
        data: payment,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Data Updated Successfully");
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Error updating payment status");
    }
  };

  const InfoCard = ({ title, icon: Icon, children }) => (
    <Card className="h-full">
      <CardHeader floated={false} className="h-16 p-4">
        <div className="flex items-center justify-between">
          <Typography variant="h6" color="blue-gray" className="mb-1">
            {title}
          </Typography>
          <Icon className="h-5 w-5 text-purple-500" />
        </div>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <Typography variant="h4" color="gray" className="mb-6">
          View Pending Payment
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <InfoCard title="Booking Details" icon={FaCalendarAlt}>
            <Typography className="text-black">
              <strong>ID:</strong> {booking.order_ref} ({booking.order_status})
            </Typography>
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
          </InfoCard>
          <InfoCard title="Customer Information" icon={FaUser}>
            <Typography className="text-black">
              <strong>Name:</strong> {booking.order_customer}
            </Typography>
            <Typography className="text-black">
              <strong>Mobile:</strong> {booking.order_customer_mobile}
            </Typography>
            <Typography className="text-black">
              <strong>Email:</strong> {booking.order_customer_email}
            </Typography>
          </InfoCard>
          <InfoCard title="Service Details" icon={FaFileAlt}>
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
              <strong>Booked Price:</strong> {booking.order_service_price_for} -{" "}
              {booking.order_custom_price <= "1"
                ? booking.order_service_price
                : booking.order_custom_price}
            </Typography>
            <Typography className="text-black">
              <strong>Current Price:</strong> {booking.order_service_price_for}{" "}
              - {booking.order_amount}
            </Typography>
            <Typography className="text-black">
              <strong>Advanced:</strong> {booking.order_advance}
            </Typography>
            <Typography className="text-black">
              <strong>Distance:</strong> {booking.order_km} Km
            </Typography>
          </InfoCard>
          <InfoCard title="Location" icon={FaMapMarkerAlt}>
            <Typography className="text-black">
              <strong>Branch:</strong> {booking.branch_name}
            </Typography>
            <Typography className="text-black">
              <strong>Area:</strong> {booking.order_area}
            </Typography>
            <Typography className="text-black">
              <strong>Address:</strong> {booking.order_flat},{" "}
              {booking.order_building}, {booking.order_landmark},{" "}
              {booking.order_address}
            </Typography>
            <Button onClick={onMap} color="blue">
              View on Map
            </Button>
          </InfoCard>
          <InfoCard title="Additional Info" icon={FaCommentAlt}>
            <Typography className="text-black">
              <strong>Remarks:</strong> {booking.order_remarks}
            </Typography>
            <Typography className="text-black">
              <strong>Comment:</strong> {booking.order_comment}
            </Typography>
            <Typography className="text-black">
              <strong>Postpone Reason:</strong> {booking.order_postpone_reason}
            </Typography>
            <Typography className="text-black">
              <strong>Booking Created By:</strong> {booking.created_by}
            </Typography>
            <Typography className="text-black">
              <strong>Booking Confirmed By:</strong> {booking.updated_by}
            </Typography>
          </InfoCard>
          <InfoCard title="Payment" icon={FaCreditCard}>
            <Typography className="text-black">
              <strong>Amount:</strong> {booking?.order_payment_amount}
            </Typography>
            <Typography className="text-black">
              <strong>Type:</strong> {booking.order_payment_type}
            </Typography>
            <Typography className="text-black">
              <strong>Transaction Details:</strong>{" "}
              {booking.order_transaction_details}
            </Typography>
          </InfoCard>
        </div>

        <Card className="mb-6">
          <CardHeader floated={false} className="h-16 p-4">
            <Typography variant="h5" color="blue-gray">
              Receive Payment
            </Typography>
          </CardHeader>
          <CardBody>
            <form onSubmit={updateData} className="space-y-4">
              <Select
                label="Select Payment Mode"
                name="order_check_payment_type"
                value={payment.order_check_payment_type}
                onChange={(value) =>
                  setPayment({ ...payment, order_check_payment_type: value })
                }
              >
                {paymentModes.map((mode) => (
                  <Option key={mode.payment_mode} value={mode.payment_mode}>
                    {mode.payment_mode}
                  </Option>
                ))}
              </Select>
              <Input
                label="Referral Number / Remarks"
                name="order_check_payment_details"
                value={payment.order_check_payment_details}
                onChange={onInputChange}
              />
              <Button type="submit" color="blue">
                Receive Payment
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default PendingPaymentView;
