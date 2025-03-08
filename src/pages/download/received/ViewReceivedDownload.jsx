import React, { useEffect, useState, useRef } from "react";
import Layout from "../../../layout/Layout";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { Download } from "lucide-react";
import moment from "moment";
import { Button } from "@material-tailwind/react";

const ViewReceivedDownload = () => {
  const [receivedPayments, setReceivedPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef();

  const bookingDateFrom = localStorage.getItem("booking_date_from");
  const bookingDateTo = localStorage.getItem("booking_date_to");

  useEffect(() => {
    const fetchReceivedPayments = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
          `${BASE_URL}/api/panel-fetch-received-payment-report`,
          {
            booking_date_from: bookingDateFrom,
            booking_date_to: bookingDateTo,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReceivedPayments(response.data.booking);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReceivedPayments();
  }, [bookingDateFrom, bookingDateTo]);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/panel-download-received-payment`,
        {
          booking_date_from: bookingDateFrom,
          booking_date_to: bookingDateTo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "received_payment_report.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error downloading report:", err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout>
      <div ref={containerRef}>
        {/* Header */}
        <div className="flex justify-between items-center p-2 rounded-lg mb-5 mt-2 bg-gradient-to-r from-white to-gray-100 shadow-sm border border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">Received Payment Report</h1>
          <div className="flex flex-row items-center gap-4 font-medium text-gray-700">
            <span className="text-sm bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
              From - {moment(bookingDateFrom).format("DD-MMM-YYYY")}
            </span>
            <span className="text-sm bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
              To - {moment(bookingDateTo).format("DD-MMM-YYYY")}
            </span>
            <Button
              className="ml-2 print-hide flex flex-row items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" /> <span>Download</span>
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto border-l border-r border-black bg-white">
          <div
            className="grid bg-white text-[11px] min-w-[1200px]"
            style={{
              gridTemplateColumns:
                "minmax(100px, auto) minmax(100px, auto) minmax(150px, auto) minmax(150px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto) minmax(100px, auto)",
            }}
          >
            {/* Header */}
            {[
              "Booking Id",
              "Branch Name",
              "Customer",
              "Mobile",
              "Email",
              "Order Date",
              "Service Date",
              "Time",
              "Service",
              "Sub Service",
              "Price For",
              "Price",
              "Custom",
              "Custom Price",
              "Flat",
              "Building",
              "Landmark",
              "KM",
              "Discount",
              "Amount",
              "Payment Type",
              "Payment Amount",
              "Transaction Details",
              "Comment",
              "Remarks",
              "Status",
            ].map((header, idx) => (
              <div
                key={idx}
                className="p-1 text-center font-bold border-b border-t border-r border-black text-gray-900"
              >
                {header}
              </div>
            ))}
            {/* Data Rows */}
            {receivedPayments.map((payment, index) => (
              <React.Fragment key={index}>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_ref}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.branch_name}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_customer}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_customer_mobile}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_customer_email || "N/A"}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {moment(payment.order_date).format("DD-MMM-YYYY")}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {moment(payment.order_service_date).format("DD-MMM-YYYY")}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_time}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_service}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_service_sub || "N/A"}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_service_price_for}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_service_price}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_custom || "N/A"}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_custom_price || "N/A"}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_flat}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_building || "N/A"}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_landmark}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_km || "N/A"}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_discount || "N/A"}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_amount}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_payment_type}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_payment_amount}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_transaction_details || "N/A"}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_comment || "N/A"}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_remarks || "N/A"}
                </div>
                <div className="p-2 border-b border-r border-black">
                  {payment.order_status}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewReceivedDownload;