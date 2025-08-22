import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../layout/Layout";

import { Card, CardBody, Typography } from "@material-tailwind/react";
import { FaClipboardList, FaInfoCircle } from "react-icons/fa"; // Icons for the tabs
import { BASE_URL } from "../../base/BaseUrl";
import BookingFilter from "../../components/BookingFilter";
import LoaderComponent from "../../components/common/LoaderComponent";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import UseEscapeKey from "../../utils/UseEscapeKey";
const ViewAMCBooking = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState({});
  UseEscapeKey();
  const [activeTab, setActiveTab] = useState("bookingDetails");
  const [loading, setLoading] = useState(false);
  const fetchBookingData = async () => {
    try {
      setLoading(true);

      const response = await axios({
        url: `${BASE_URL}/api/panel-fetch-amcbooking-by-id/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooking(response.data?.booking || []);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [id]);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "bookingDetails":
      case "customerInfo":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>ID:</strong> {booking.order_ref} ({booking.order_status_amc}
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
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Service Date:</strong>{" "}
                {moment(booking.order_service_date).format("DD-MM-YYYY")}
              </Typography>
              <Typography className="text-black">
                <strong>Slot Time:</strong> {booking.order_time}
              </Typography>
              <Typography className="text-black">
                <strong>Service:</strong> {booking.order_service}
              </Typography>
              <Typography className="text-black">
                <strong>Booked Time:</strong> {booking.order_booking_time}
              </Typography>
            </div>
            <div className="space-y-2">
              {booking.order_service == "Custom" && (
                <Typography className="text-black">
                  <strong>Custom:</strong> {booking.order_custom}
                </Typography>
              )}
              {booking.order_service !== "Custom" &&
                booking.order_service_sub && (
                  <Typography className="text-black">
                    <strong>Sub Service:</strong> {booking.order_service_sub}
                  </Typography>
                )}

              <Typography className="text-black">
                <strong>Booking Amount:</strong> {booking?.order_amount}
              </Typography>
              <Typography className="text-black">
                <strong>Booking Type:</strong> {booking.order_type}
              </Typography>
              <Typography className="text-black">
                <strong>From Date:</strong>

                {booking.order_from_date
                  ? moment(booking.order_from_date).format("DD-MM-YYYY")
                  : ""}
              </Typography>
              <Typography className="text-black">
                <strong>To Date:</strong>{" "}
                {booking.order_to_date
                  ? moment(booking.order_to_date).format("DD-MM-YYYY")
                  : ""}
              </Typography>
            </div>
          </div>
        );
      case "additionalInfo":
      case "location":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <PageHeader
        title={
          <>
            Booking for{" "}
            <span className="text-[#F44336]">{booking?.order_service}</span>
          </>
        }
      />
      {loading ? (
        <LoaderComponent />
      ) : (
        <>
          <div className="container mx-auto mt-2">
            <div className="flex gap-4">
              <div className="flex-grow">
                <div className="mb-2">
                  <div className="flex justify-start space-x-4 ">
                    <button
                      onClick={() => setActiveTab("bookingDetails")}
                      className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
                        activeTab === "bookingDetails"
                          ? "border-green-500 bg-green-100 text-green-600"
                          : "border-transparent hover:bg-green-50"
                      }`}
                    >
                      <FaClipboardList />
                      Booking Overview
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
                </div>
                {activeTab == "bookingDetails" ||
                activeTab == "additionalInfo" ? (
                  <>
                    <Card className="my-2 ">
                      <CardBody>{renderActiveTabContent()}</CardBody>
                    </Card>
                    <div></div>
                  </>
                ) : (
                  <div className="w-full overflow-x-auto px-2"></div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default ViewAMCBooking;
