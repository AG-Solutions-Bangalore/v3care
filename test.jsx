import React, { useEffect, useState, useRef } from 'react';
import Layout from '../../../layout/Layout';
import axios from 'axios';
import BASE_URL from '../../../base/BaseUrl';
import { Download, FileText, Calendar, DollarSign, BarChart, ClipboardList } from 'lucide-react';
import moment from 'moment';
import { Button } from '@material-tailwind/react';
import { useReactToPrint } from "react-to-print";

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
                font-size: 10px; 
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
        <div className="flex justify-center items-center mt-5 h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
        </div>
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
  const pendingAmount = bookingData.booking_total_amount - (bookingData.booking_total_v3_receied_amount + bookingData.booking_total_v3_pending_amount + bookingData.booking_total_v3_process_amount + bookingData.booking_total_v3_others_amount);

  return (
    <Layout>
      <div>
        {/* Header Section with improved styling */}
        <div className="flex justify-between items-center p-4 rounded-lg mb-4 mt-2 bg-white shadow-md border border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Booking Summary Report</h1>
          </div>
          <div className="flex flex-row items-center gap-3 font-medium text-gray-700">
            <span className="text-sm bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-300 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              {moment(bookingDateFrom).format("DD-MMM-YYYY")}
            </span>
            <span className="text-sm bg-white px-3 py-1.5 rounded-md shadow-sm border border-gray-300 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              {moment(bookingDateTo).format("DD-MMM-YYYY")}
            </span>
            <Button
              className="ml-2 print-hide flex flex-row items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all duration-300 ease-in-out shadow-sm"
              onClick={handlePrintPdf}
            >
              <Download className="h-4 w-4" /> <span>Print</span>
            </Button>
          </div>
        </div>

        {/* Main content with 70-30 split layout */}
        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200" ref={containerRef}>
          {/* Report Header */}
          <div className="text-center mb-5 pb-3 border-b border-gray-300">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">BOOKING ANALYTICS REPORT</h1>
            <p className="text-sm text-gray-700">
              {branchName} | {moment(bookingDateFrom).format("DD MMM YYYY")} - {moment(bookingDateTo).format("DD MMM YYYY")}
            </p>
            <p className="text-xs text-gray-600 mt-1">Report Generated: {moment().format("DD MMM YYYY, h:mm A")}</p>
          </div>

          {/* Content with 70-30 split */}
          <div className="flex flex-col md:flex-row print:flex-row gap-4">
            {/* Left Side - 70% width */}
            <div className="w-full md:w-[70%] print:w-[70%] space-y-4">
              {/* Booking Status Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-3">
                  <ClipboardList className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-md font-bold text-gray-800">OVERVIEW</h2>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-md bg-white">
                  <div className="grid bg-white text-[14px]"
                    style={{
                      gridTemplateColumns: "repeat(4, minmax(100px, 1fr))"
                    }}>
                    {/* Headers */}
                    <div className="p-3 text-center font-bold border-b border-r border-gray-300 text-gray-900 bg-gray-100">
                      Total Bookings
                    </div>
                    <div className="p-3 text-center font-bold border-b border-r border-gray-300 text-gray-900 bg-gray-100">
                      Pending Bookings
                    </div>
                    <div className="p-3 text-center font-bold border-b border-r border-gray-300 text-gray-900 bg-gray-100">
                      Confirmed Bookings
                    </div>
                    <div className="p-3 text-center font-bold border-b border-r border-gray-300 text-gray-900 bg-gray-100">
                      Cancel Bookings
                    </div>

                    {/* Values */}
                    <div className="p-3 text-center border-b border-r border-gray-300 text-black font-bold bg-white">
                      {bookingData.booking_total_count}
                    </div>
                    <div className="p-3 text-center border-b border-r border-gray-300 text-black font-bold bg-white">
                      {bookingData.booking_total_pending_count}
                    </div>
                    <div className="p-3 text-center border-b border-r border-gray-300 text-black font-bold bg-white">
                      {bookingData.booking_total_Confirmed_count}
                    </div>
                    <div className="p-3 text-center border-b border-r border-gray-300 text-black font-bold bg-white">
                      {bookingData.booking_cancel_count}
                    </div>
                  </div>
                </div>
              </div>

            

              {/* Payment Methods Section - Updated to be more sleek and classic */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-3">
                  <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-md font-semibold text-gray-800 border-b border-gray-300 pb-1 w-full">PAYMENT METHODS</h2>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-md bg-white">
                  <div className="p-3 text-sm">
                    <div className="border border-gray-300 p-3 bg-white rounded">
                      <div className="text-center font-semibold mb-2 border-b pb-1 text-gray-800">Payment Breakdown</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between">
                          <span>GPay:</span>
                          <span className="font-medium">₹ {bookingData.booking_receied_amount_gpay.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>PhonePe:</span>
                          <span className="font-medium">₹ {bookingData.booking_receied_amount_ppay.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Paytm:</span>
                          <span className="font-medium">₹ {bookingData.booking_receied_amount_paytm.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Cash:</span>
                          <span className="font-medium">₹ {bookingData.booking_receied_amount_cash.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Bank:</span>
                          <span className="font-medium">₹ {bookingData.booking_receied_amount_bank.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Other:</span>
                          <span className="font-medium">₹ {bookingData.booking_receied_amount_other.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pending:</span>
                          <span className="font-medium">₹ {bookingData.booking_receied_amount_pending.toLocaleString()}</span>
                        </div>

                       
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - 30% width - Financial Summary - Updated to fit content and removed chart */}
            <div className="w-full md:w-[30%]  print:w-[30%]">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-3">
                  <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-md font-bold text-gray-800">FINANCIAL SUMMARY</h2>
                </div>
                <div className="border-l-4 border-blue-500 rounded-lg p-4 bg-white shadow-sm">
                  <div className="text-center font-semibold mb-4 pb-2 border-b border-gray-200 text-blue-800">
                    Amount Calculation
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                      <span className="text-gray-700">Total Amount:</span>
                      <span className="font-bold text-blue-700">₹ {bookingData.booking_total_amount.toLocaleString()}</span>
                    </div>
                    
                    <div>
                      <div className="text-sm font-semibold text-gray-600 mb-1">Deductions:</div>
                      <div className="pl-2 border-l-2 border-gray-300 space-y-2 mb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">V3 Received Amount:</span>
                          <span className="font-medium text-green-600">₹ {bookingData.booking_total_v3_receied_amount.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">V3 Pending Amount:</span>
                          <span className="font-medium text-amber-600">₹ {bookingData.booking_total_v3_pending_amount.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">V3 Process Amount:</span>
                          <span className="font-medium text-blue-600">₹ {bookingData.booking_total_v3_process_amount.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">V3 Other Amount:</span>
                          <span className="font-medium text-purple-600">₹ {bookingData.booking_total_v3_others_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t-2 border-gray-200 pt-3 mt-2">
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-md border border-red-100">
                        <span className="font-bold text-red-700">Pending Amount:</span>
                        <span className="font-bold text-xl text-red-700">₹ {pendingAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
            {/* Booking Distribution Section */}
            <div className="bg-gray-50 rounded-lg p-4 mt-5 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-3">
                  <BarChart className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-md font-bold text-gray-800">BOOKING DISTRIBUTION</h2>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-md bg-white">
                  <div className="grid bg-white text-[14px]"
                    style={{
                      gridTemplateColumns: "repeat(8, minmax(100px, 1fr))"
                    }}>
                    {/* Headers */}
                    <div className="p-2 text-center font-bold border-b border-r border-gray-300 text-gray-900 bg-gray-100">
                      Source
                    </div>
                    <div className="p-2 text-center font-bold border-b border-r border-gray-300 text-gray-900 bg-gray-100">
                      Confirmed
                    </div>
                    <div className="p-2 text-center font-bold border-b border-r border-gray-300 text-gray-900 bg-gray-100">
                      Postponed
                    </div>
                    <div className="p-2 text-center font-bold border-b border-r border-gray-300 text-gray-900 bg-gray-100">
                      RNR
                    </div>
                    <div className="p-2 text-center font-bold border-b border-r border-gray-300 text-gray-900 bg-gray-100">
                      Inspection
                    </div>
                    <div className="p-2 text-center font-bold border-b border-r border-gray-300 text-gray-900 bg-gray-100">
                      On the Way
                    </div>
                    <div className="p-2 text-center font-bold border-b border-r border-gray-300 text-gray-900 bg-gray-100">
                      In Progress
                    </div>
                    <div className="p-2 text-center font-bold border-b border-r border-gray-300 text-gray-900 bg-gray-100">
                      Completed
                    </div>

                    {/* V3 Values */}
                    <div className="p-2 text-center border-b border-r border-gray-300 font-medium bg-blue-50">
                      V3
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_total_Confirmed_v3_count}
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_postpone_count}
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_rnr_count}
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_inspection_count}
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_on_the_way_count}
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_in_progress_count}
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_completed_count}
                    </div>

                    {/* Vendor Values */}
                    <div className="p-2 text-center border-b border-r border-gray-300 font-medium bg-green-50">
                      Vendor
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_total_Confirmed_vendor_count}
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_postpone_vendor_count || 0}
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_rnr_vendor_count || 0}
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_inspection_vendor_count || 0}
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_on_the_way_vendor_count}
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_in_progress_vendor_count}
                    </div>
                    <div className="p-2 text-center border-b border-r border-gray-300 bg-white">
                      {bookingData.booking_completed_vendor_count}
                    </div>
                  </div>
                </div>
              </div>

          {/* Signature Section */}
          <div className="mt-8 pt-4 border-t border-gray-300">
            <div className="flex justify-between text-sm text-gray-600">
              <div className="text-center">
                <div>_______________________</div>
                <div className="mt-1">Authorized Signature</div>
              </div>
              <div className="text-center">
                <div>_______________________</div>
                <div className="mt-1">Manager Approval</div>
              </div>
              <div className="text-center">
                <div>_______________________</div>
                <div className="mt-1">Date & Stamp</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-600 mt-6 pt-2 border-t border-gray-300">
            <p>This is an official document. Please retain for your records.</p>
            <p>© {new Date().getFullYear()} V3Care. All rights reserved.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewAllBooking;