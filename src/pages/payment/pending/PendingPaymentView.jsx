import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../layout/Layout";

import {
  Card,
  CardBody,
  CardHeader,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FaHome, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const PendingPaymentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  UseEscapeKey();
  const [booking, setBooking] = useState({});
  const [payment, setPayment] = useState({
    order_check_payment_type: "",
    order_check_payment_details: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchloading, setFetchLoading] = useState(false);

  const { userType } = useContext(ContextPanel);
  const [paymentModes, setPaymentModes] = useState([]);
  const [activeTab, setActiveTab] = useState("bookingDetails");
  const storedPageNo = localStorage.getItem("page-no");
  const pageNo =
    storedPageNo === "null" || storedPageNo === null ? "1" : storedPageNo;
  const fetchBookingData = async () => {
    setFetchLoading(true);
    try {
      const response = await axios({
        url: `${BASE_URL}/api/panel-fetch-booking-view-by-id/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooking(response.data?.booking);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    } finally {
      setFetchLoading(false);
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
      setPaymentModes(response.data?.paymentMode);
    } catch (error) {
      console.error("Error fetching payment modes:", error);
    }
  };

  useEffect(() => {
    fetchBookingData();
    fetchPaymentModes();
  }, []);

  const onInputChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };
  const handleBack = (e) => {
    e.preventDefault();
    navigate(`/pending-payment?page=${pageNo}`);
  };
  const updateData = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const res = await axios.put(
        `${BASE_URL}/api/panel-update-payment-status/${id}`,
        payment,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.code == "200") {
        toast.success(res.data?.msg || "Payment Updated Successfully");
        navigate(`/pending-payment?page=${pageNo}`);
      } else {
        toast.error(res.data?.msg || "Network Error");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Error updating payment status");
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
      <PageHeader title={"View Pending Payment"} onClick={handleBack} />
      {fetchloading ? (
        <LoaderComponent />
      ) : (
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
            {userType !== "4" && (
              <Card className="mb-6">
                <CardHeader floated={false} className="h-16 p-4">
                  <Typography variant="h5" color="blue-gray">
                    Receive Payment
                  </Typography>
                </CardHeader>
                <CardBody>
                  <form onSubmit={updateData}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-4">
                        {/* <Select
                          label="Select Payment Mode"
                          name="order_check_payment_type"
                          value={payment.order_check_payment_type || ""}
                        >
                          {paymentModes.map((mode) => (
                            <Option
                              key={mode.payment_mode}
                              value={mode.payment_mode}
                              onClick={() =>
                                setPayment({
                                  ...payment,
                                  order_check_payment_type: mode.payment_mode,
                                })
                              }
                            >
                              {mode.payment_mode}
                            </Option>
                          ))}
                        </Select> */}
                        <FormControl fullWidth>
                          <InputLabel id="order_check_payment_type-label">
                            <span className="text-sm relative bottom-[6px]">
                              Payment Mode
                              <span className="text-red-700">*</span>
                            </span>
                          </InputLabel>
                          <Select
                            sx={{ height: "40px", borderRadius: "5px" }}
                            labelId="order_check_payment_type"
                            id="id"
                            name="order_check_payment_type"
                            value={payment.order_check_payment_type || ""}
                            onChange={onInputChange}
                            label="Payment Mode *"
                            required
                          >
                            {paymentModes.map((item) => (
                              <MenuItem
                                key={item.id}
                                value={String(item.payment_mode)}
                              >
                                {item.payment_mode}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>{" "}
                      </div>
                      <div className="md:col-span-8">
                        {" "}
                        <Textarea
                          label="Referral Number / Remarks"
                          name="order_check_payment_details"
                          value={payment.order_check_payment_details}
                          onChange={onInputChange}
                          maxLength={980}
                        />
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4 my-2">
                      <ButtonConfigColor
                        type="edit"
                        buttontype="submit"
                        label="Receive Payment"
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
      )}
    </Layout>
  );
};

export default PendingPaymentView;
