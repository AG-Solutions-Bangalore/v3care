import React, { useEffect, useState, useRef } from "react";
import Layout from "../../../layout/Layout";
import axios from "axios";
import {BASE_URL} from "../../../base/BaseUrl";
import { Download, FileText, Calendar } from "lucide-react";
import moment from "moment";
import { Button } from "@material-tailwind/react";
import { useReactToPrint } from "react-to-print";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";

const ViewAllBooking = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef();

  const bookingDateFrom = localStorage.getItem("booking_date_from");
  const bookingDateTo = localStorage.getItem("booking_date_to");
  const branchId = localStorage.getItem("branch_id");
  const branchName = localStorage.getItem("branch_name") || "All Branches";

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
          `${BASE_URL}/api/panel-fetch-all-booking-count-report`,
          {
            booking_date_from: bookingDateFrom,
            booking_date_to: bookingDateTo,
            branch_id: branchId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookingData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingDateFrom, bookingDateTo, branchId]);

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Booking_Report",
    pageStyle: `
            @page {
              size: A4 landscape;
              margin: 5mm;
            }
            @media print {
              body {
                border: 0px solid #000;
                font-size: 12px; 
                margin: 0mm;
                padding: 0mm;
                min-height: 100vh;
              }
              table {
                font-size: 11px;
              }
              .print-hide {
                display: none;
              }
            }
          `,
  });

  if (loading) {
    return (
      <Layout>
        <LoaderComponent />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-gray-100 p-4 mt-5 rounded-lg border border-gray-300 text-gray-700">
          <p className="font-semibold">Error encountered:</p>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  if (!bookingData) {
    return (
      <Layout>
        <div className="bg-gray-100 p-4 rounded-lg mt-5 border border-gray-300 text-gray-700">
          <p>No data available for the selected date range.</p>
        </div>
      </Layout>
    );
  }

  // Calculate the pending amount
  const pendingAmount =
    bookingData.booking_total_amount -
    (bookingData.booking_total_v3_receied_amount +
      bookingData.booking_total_v3_pending_amount +
      bookingData.booking_total_v3_process_amount +
      bookingData.booking_total_v3_others_amount);

  return (
    <Layout>
      <div>
        <PageHeader
          title={"Booking Summary Report"}
          label2={
            <span className="flex justify-between space-x-4">
              <span className="text-sm bg-white px-3 py-1 rounded-md shadow-sm border border-gray-300 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {moment(bookingDateFrom).format("DD-MMM-YYYY")}
              </span>
              <span className="text-sm bg-white px-3 py-1 rounded-md shadow-sm border border-gray-300 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {moment(bookingDateTo).format("DD-MMM-YYYY")}
              </span>
              <ButtonConfigColor
                type="print"
                label="Print"
                onClick={handlePrintPdf}
              />
            </span>
          }
        />

        <div
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-300 mt-2"
          ref={containerRef}
        >
          <div className="text-center mb-4 pb-3 border-b border-gray-300">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              BOOKING ANALYTICS REPORT
            </h1>
            <p className="text-sm text-gray-700">
              {branchName} | {moment(bookingDateFrom).format("DD MMM YYYY")} -{" "}
              {moment(bookingDateTo).format("DD MMM YYYY")}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Report Generated: {moment().format("DD MMM YYYY, h:mm A")}
            </p>
          </div>

          {/* Booking Status Section */}
          <div className="mb-4">
            <h2 className="text-md font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
              {" "}
              OVERVIEW
            </h2>
            <div className="overflow-x-auto border border-black bg-white">
              <div
                className="grid bg-white text-[14px]"
                style={{
                  gridTemplateColumns: "repeat(4, minmax(100px, 1fr))",
                }}
              >
                {/* Headers */}
                <div className="p-2 text-center font-bold border-b border-r border-black text-gray-900 bg-gray-100">
                  Total Bookings
                </div>
                <div className="p-2 text-center font-bold border-b border-r border-black text-gray-900 bg-gray-100">
                  Pending Bookings
                </div>
                <div className="p-2 text-center font-bold border-b border-r border-black text-gray-900 bg-gray-100">
                  Confirmed Bookings
                </div>

                <div className="p-2 text-center font-bold border-b border-r border-black text-gray-900 bg-gray-100">
                  Cancel Bookings
                </div>

                {/* Values */}
                <div className="p-2 text-center border-b border-r border-black text-black font-bold bg-white">
                  {bookingData.booking_total_count}
                </div>
                <div className="p-2 text-center border-b border-r border-black text-black font-bold bg-white">
                  {bookingData.booking_total_pending_count}
                </div>
                <div className="p-2 text-center border-b border-r border-black text-black font-bold bg-white">
                  {bookingData.booking_total_Confirmed_count}
                </div>

                <div className="p-2 text-center border-b border-r border-black text-black font-bold bg-white">
                  {bookingData.booking_cancel_count}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Distribution Section */}
          <div className="mb-4">
            <h2 className="text-md font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
              BOOKING DISTRIBUTION
            </h2>
            <div className="overflow-x-auto border border-black bg-white">
              <div
                className="grid bg-white text-[14px]"
                style={{
                  gridTemplateColumns: "repeat(8, minmax(100px, 1fr))",
                }}
              >
                {/* Headers */}
                <div className="p-2 text-center font-bold border-b border-r border-black text-gray-900 bg-gray-100">
                  Source
                </div>
                <div className="p-2 text-center font-bold border-b border-r border-black text-gray-900 bg-gray-100">
                  Confirmed
                </div>
                <div className="p-2 text-center font-bold border-b border-r border-black text-gray-900 bg-gray-100">
                  Postponed
                </div>
                <div className="p-2 text-center font-bold border-b border-r border-black text-gray-900 bg-gray-100">
                  RNR
                </div>
                <div className="p-2 text-center font-bold border-b border-r border-black text-gray-900 bg-gray-100">
                  Inspection
                </div>
                <div className="p-2 text-center font-bold border-b border-r border-black text-gray-900 bg-gray-100">
                  On the Way
                </div>
                <div className="p-2 text-center font-bold border-b border-r border-black text-gray-900 bg-gray-100">
                  In Progress
                </div>
                <div className="p-2 text-center font-bold border-b border-r border-black text-gray-900 bg-gray-100">
                  Completed
                </div>

                {/* V3 Values */}
                <div className="p-2 text-center border-b border-r border-black font-medium bg-white">
                  V3 - {bookingData.booking_total_Confirmed_v3_count}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_confirmed_count}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_postpone_count}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_rnr_count}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_inspection_count}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_on_the_way_count}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_in_progress_count}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_completed_count}
                </div>

                {/* Vendor Values */}
                <div className="p-2 text-center border-b border-r border-black font-medium bg-white">
                  Vendor - {bookingData.booking_total_Confirmed_vendor_count}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_confirmed_vendor_count}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_postpone_vendor_count || 0}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_rnr_vendor_count || 0}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_inspection_vendor_count || 0}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_on_the_way_vendor_count}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_in_progress_vendor_count}
                </div>
                <div className="p-2 text-center border-b border-r border-black bg-white">
                  {bookingData.booking_completed_vendor_count}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary and Payment Methods in Grid */}
          <div className="grid grid-cols-1 print:grid-cols-2 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h2 className="text-md font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
                FINANCIAL SUMMARY
              </h2>
              <div className="overflow-x-auto border border-black bg-white">
                <div className="p-3 text-sm">
                  <div className="border border-gray-300 p-3 bg-white rounded">
                    <div className="text-center font-semibold mb-2 border-b pb-1 text-gray-800">
                      Amount Calculation
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Total Amount:</span>
                      <span className="font-medium">
                        ₹ {bookingData.booking_total_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className=" font-semibold">Deduction:</span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span>V3 Received Amount:</span>
                      <span className="font-medium">
                        ₹{" "}
                        {bookingData.booking_total_v3_receied_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>V3 Pending Amount:</span>
                      <span className="font-medium">
                        ₹{" "}
                        {bookingData.booking_total_v3_pending_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>V3 Process Amount:</span>
                      <span className="font-medium">
                        ₹{" "}
                        {bookingData.booking_total_v3_process_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>V3 Other Amount:</span>
                      <span className="font-medium">
                        ₹{" "}
                        {bookingData.booking_total_v3_others_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-gray-300 my-1"></div>
                    <div className="flex justify-between font-bold">
                      <span>Pending Amount:</span>
                      <span>₹ {pendingAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-md font-semibold text-gray-800 mb-2 border-b border-gray-300 pb-1">
                PAYMENT METHODS
              </h2>
              <div className="overflow-x-auto border border-black bg-white">
                <div className="p-3 text-sm">
                  <div className="border border-gray-300 p-3 bg-white rounded">
                    <div className="text-center font-semibold mb-2 border-b pb-1 text-gray-800">
                      Payment Breakdown
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span>GPay:</span>
                        <span className="font-medium">
                          ₹{" "}
                          {bookingData.booking_receied_amount_gpay.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>PhonePe:</span>
                        <span className="font-medium">
                          ₹{" "}
                          {bookingData.booking_receied_amount_ppay.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Paytm:</span>
                        <span className="font-medium">
                          ₹{" "}
                          {bookingData.booking_receied_amount_paytm.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Cash:</span>
                        <span className="font-medium">
                          ₹{" "}
                          {bookingData.booking_receied_amount_cash.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Bank:</span>
                        <span className="font-medium">
                          ₹{" "}
                          {bookingData.booking_receied_amount_bank.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Other:</span>
                        <span className="font-medium">
                          ₹{" "}
                          {bookingData.booking_receied_amount_other.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="font-medium">
                          ₹{" "}
                          {bookingData.booking_receied_amount_pending.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewAllBooking;
