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
} from "@material-tailwind/react";
import BASE_URL from "../../../base/BaseUrl";
import BookingFilter from "../../../components/BookingFilter";
import { toast } from "react-toastify";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import { ContextPanel } from "../../../utils/ContextPanel";
const ViewBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState({});
  UseEscapeKey();
  const { userType } = useContext(ContextPanel);

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

  const notifyUpdate = async () => {
    e.preventDefault();
    let vendor_service =
      booking.order_custom_price <= "1"
        ? booking.order_service
        : booking.order_custom;
    let order_ref = booking.order_ref;
    let area = booking.order_area;

    let data = {
      vendor_service: vendor_service,
      area: area,
      order_ref: order_ref,
    };
    const res = await axios.post(
      `${BASE_URL}/api/panel-create-booking-vendor-notification`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (res.data.code == "200") {
      toast.success("Notification Sent Successfully");
    } else {
      toast.error("Network Error");
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
              {/* add condition  */}
              <Typography className="text-black">
                <strong>Vendor:</strong> {vendor.vendor_company}
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
      <BookingFilter />
      <div className="container mx-auto p-4">
        <div className="flex justify-between">
          <Typography variant="h4" color="gray" className="mb-6">
            View Booking
          </Typography>
          <div>
            {/* + Assign V3 Button */}
            {!(
              booking.order_status === "Pending" ||
              booking.order_status === "Completed" ||
              booking.order_status === "Cancel" ||
              booking.order_status === "Vendor"
            ) && (
              <Button
                color="red"
                className="mr-4"
                onClick={() => navigate(`/booking-assign/${id}`)}
              >
                + Assign V3
              </Button>
            )}

            {/* + Assign Vendor Button */}
            {(booking.order_status === "Confirmed" ||
              booking.order_status === "Vendor") && (
              <Button
                color="red"
                className="mr-4"
                onClick={() => navigate(`/assign-vendor/${id}`)}
              >
                + Assign Vendor
              </Button>
            )}

            {/* + Notify All Button */}
            {booking.order_status === "Confirmed" && userType !== "4" && (
              <Button onClick={() => notifyUpdate} color="red">
                + Notify All
              </Button>
            )}
          </div>
        </div>

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
              <CardHeader floated={false} className="h-16 p-4">
                <Typography variant="h5" color="blue-gray">
                  Booking Assign
                </Typography>
              </CardHeader>
              {/* here booking assign table  */}
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
                    <h1 className="text-gray-700 text-lg">No Data Available</h1>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewBooking;
