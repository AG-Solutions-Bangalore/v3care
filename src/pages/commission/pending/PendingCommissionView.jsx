import React, { useContext } from "react";
import Layout from "../../../layout/Layout";
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
  Select,
  Option,
  Button,
  Textarea,
} from "@material-tailwind/react";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import { ContextPanel } from "../../../utils/ContextPanel";
import { ArrowLeft } from "lucide-react";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
const CommissionBy = [
  {
    value: "Vendor",
    label: "Vendor",
  },
  {
    value: "V3 Care",
    label: "V3 Care",
  },
];
const PendingCommissionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  UseEscapeKey();
  const [booking, setBooking] = useState({});
  const [payment, setPayment] = useState({
    order_comm_remark: "",
    order_comm_received_by: "",
  });
  const { userType } = useContext(ContextPanel);
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  // no need check at once and remove it
  const [bookingAssign, setBookingAssign] = useState({});
  // no need check at once and remove it
  const [vendor, setVendor] = useState({});
  // new design
  const [activeTab, setActiveTab] = useState("bookingDetails");

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

  useEffect(() => {
    fetchBookingData();
  }, []);

  const onInputChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };
  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/commission-pending?page=${pageNo}`);
  };
  const updateData = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(
        `${BASE_URL}/api/panel-update-payment-status/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.code === "200") {
        toast.success("Received Updated Successfully");
        navigate("/received-payment");
      } else {
        toast.error("Network Error");
      }
    } catch (error) {
      console.error("Error updating received status:", error);
      toast.error("Error updating received status");
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
            {/* Adjust to 3 columns */}
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
                <strong>Amount:</strong> {booking?.order_payment_amount}
              </Typography>
              <Typography className="text-black">
                <strong>Type:</strong> {booking.order_payment_type}
              </Typography>
              <Typography className="text-black">
                <strong>Transaction Details:</strong>{" "}
                {booking.order_transaction_details}
              </Typography>
              <Typography className="text-black">
                <strong>Vendor:</strong> {vendor.vendor_company}
              </Typography>
              <Typography className="text-black">
                <strong>Commission:</strong> {booking.order_comm}
              </Typography>
            </div>
          </div>
        );
      case "additionalInfo":
      case "location":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            {/* Adjust to 3 columns */}
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Remarks:</strong> {booking.order_remarks}
              </Typography>
              <Typography className="text-black">
                <strong>Comment:</strong> {booking.order_comment}
              </Typography>
              <Typography className="text-black">
                <strong>Postpone Reason:</strong>{" "}
                {booking.order_postpone_reason}
              </Typography>
            </div>
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
      <PageHeader title={"View Pending Commission"} onClick={handleBack} />

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

            {/* Main Content Based on Active Tab */}
            <Card className="mt-2">
              <CardBody>{renderActiveTabContent()}</CardBody>
            </Card>
          </div>

          {/* Payment Card */}
          {userType !== "4" && (
            <Card className="mb-6">
              <CardBody>
                <form onSubmit={updateData}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                      <Select
                        label={
                          <>
                            Select Commission received By{" "}
                            <span className="text-red-500 ml-1">*</span>
                          </>
                        }
                        name="order_comm_received_by"
                        value={payment.order_comm_received_by || ""}
                        required
                      >
                        {CommissionBy.map((mode) => (
                          <Option
                            key={mode.value}
                            value={mode.value}
                            onChange={onInputChange}
                          >
                            {mode.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div className="md:col-span-8">
                      {" "}
                      <Textarea
                        label="Commission Remarks"
                        name="order_comm_remark"
                        value={payment.order_comm_remark}
                        onChange={onInputChange}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4 my-2">
                    <ButtonConfigColor
                      type="edit"
                      buttontype="submit"
                      label="Receive Commission"
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
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PendingCommissionView;
