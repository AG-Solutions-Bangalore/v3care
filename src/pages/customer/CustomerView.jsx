import { Divider } from "@mui/material";
import axios from "axios";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiBook,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiHelpCircle,
  FiLoader,
  FiMapPin,
  FiPhone,
  FiSearch,
  FiTrendingUp,
  FiTruck,
  FiUser,
  FiXCircle
} from "react-icons/fi";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../base/BaseUrl";
import LoaderComponent from "../../components/common/LoaderComponent";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import Layout from "../../layout/Layout";

const CustomerView = () => {
  const { customer_name, customer_mobile } = useParams();
  const [customerListData, setCustomerListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [customerSince, setCustomerSince] = useState(null);

  useEffect(() => {
    const fetchcustomerListData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${BASE_URL}/api/panel-fetch-customer-booking-order-list`,
          {
            order_customer: customer_name,
            order_customer_mobile: customer_mobile
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCustomerListData(response.data?.booking);
        
        if (response.data?.booking?.length > 0) {
          const firstBooking = response.data.booking[0];
          setCustomerInfo({
            name: firstBooking.order_customer,
            mobile: firstBooking.order_customer_mobile,
            address: firstBooking.order_address,
            firstBookingDate: firstBooking.order_date,
            totalBookings: response.data.booking.length,
            completedBookings: response.data.booking.filter(b => b.order_status === "Completed").length,
            cancelledBookings: response.data.booking.filter(b => b.order_status === "Cancel").length
          });
        }
        if (response.data?.booking?.length > 0) {
          const lastBooking = response.data.booking[response.data.booking.length - 1];
          setCustomerSince({
        
            lastBookingDate: lastBooking.order_date,
            
          });
        }
      } catch (error) {
        console.error("Error fetching customer list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchcustomerListData();
  }, [customer_name, customer_mobile]);

  const columns = [
    {
      name: "order_ref",
      label: "REFERENCE",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
          <span className="font-medium text-blue-600">{value}</span>
        )
      }
    },
    {
      name: "order_service_date",
      label: "DATE",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
          <div className="flex items-center justify-center">
            {/* <FiCalendar className="mr-1 text-gray-500" size={14} /> */}
            <span>{moment(value).format("DD-MMM-YY")}</span>
          </div>
        )
      }
    },
    {
      name: "order_service",
      label: "SERVICE",
      options: {
        filter: true,
        sort: true,
      }
    },
    
    {
      name: "order_amount",
      label: "AMOUNT",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value,tableMeta) => {
          const amount = tableMeta.rowData[3];

          return(
          <div className="flex items-center justify-center">
          
            <span className="font-medium "> ₹&nbsp;{amount ? amount : 0}  </span>
          </div>
          )
        }
      }
    },
    {
      name: "order_advance",
      label: "ADVANCED AMOUNT",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value,tableMeta) => {
          const advancedAmount = tableMeta.rowData[4];
          return (
          <div className="flex items-center justify-center">
          
            <span className="font-medium text-center">₹&nbsp;{advancedAmount ? advancedAmount : 0} </span>
          </div>
          )
      }
      }
    },
    {
      name: "order_payment_amount",
      label: "PAID AMOUNT",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value,tableMeta) => {
          const paidAmount = tableMeta.rowData[5];
          return (
          <div className="flex items-center justify-center">
          
            <span className="font-medium text-center">₹&nbsp;{paidAmount ? paidAmount : 0} </span>
          </div>
          )
      }
      }
    },
    {
      name: "order_status",
      label: "STATUS",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          let color = "";
          let icon = null;
          
          switch (value) {
            case "Pending":
              color = "bg-yellow-100 text-yellow-900";
              icon = <FiClock className="mr-1" size={14} />;
              break;
            case "RNR":
              color = "bg-purple-100 text-purple-800";
              icon = <FiAlertCircle className="mr-1" size={14} />;
              break;
            case "Inspection":
              color = "bg-blue-100 text-blue-800";
              icon = <FiSearch className="mr-1" size={14} />;
              break;
            case "Confirmed":
              color = "bg-teal-100 text-teal-800";
              icon = <FiCheck className="mr-1" size={14} />;
              break;
            case "On the way":
              color = "bg-indigo-100 text-indigo-800";
              icon = <FiTruck className="mr-1" size={14} />;
              break;
            case "In Progress":
              color = "bg-orange-100 text-orange-800";
              icon = <FiLoader className="mr-1" size={14} />;
              break;
            case "Completed":
              color = "bg-green-100 text-green-800";
              icon = <FiCheckCircle className="mr-1" size={14} />;
              break;
            case "Vendor":
              color = "bg-cyan-100 text-cyan-800";
              icon = <FiUser className="mr-1" size={14} />;
              break;
            case "Cancel":
              color = "bg-red-100 text-red-800";
              icon = <FiXCircle className="mr-1" size={14} />;
              break;
            default:
              color = "bg-gray-100 text-gray-800";
              icon = <FiHelpCircle className="mr-1" size={14} />;
          }
          
          return (
            <span className={`text-xs px-2 py-1 rounded-full ${color} flex items-center justify-center`}>
              {icon}
              {value}
            </span>
          );
        }
      }
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "simple",
    viewColumns: false,
    download: false,
    print: false,
    filter: false,
    search: false,
    setRowProps: () => ({
      style: {
        borderBottom: "1px solid #f3f4f6",
        cursor: "pointer",
      }
    }),
    textLabels: {
      body: {
        noMatch: loading ? (
          <LoaderComponent />
        ) : (
          'No records found'
        ),
      }
    },
    tableBodyHeight: 'calc(100vh - 300px)',
    fixedHeader: true
  };

  return (
    <Layout>
      <PageHeader title="Customer Profile" />
      
      {loading ? (
        <div className="mt-1">
          <LoaderComponent />
        </div>
      ) : (
        <div className=" bg-white  rounded-lg p-1  flex flex-col lg:flex-row  mt-4">
          {/* Left Side  */}
          <div className="w-full lg:w-[30%]">
            <div className="  border-r border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-blue-600">
                    <FiUser size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{customerInfo?.name}</h2>
                    <p className="flex items-center text-gray-600 text-sm mt-1">
                      <FiPhone className="mr-2" size={14} /> {customerInfo?.mobile}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                    <FiMapPin className="mr-2" size={14} /> Address
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {customerInfo?.address || "No address available"}
                  </p>
                </div>
                
                <Divider className="my-4" />
                
                <div className="grid grid-cols-3 gap-3 mt-4 mb-4">
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Total</h4>
                    <p className="text-lg font-semibold">{customerInfo?.totalBookings || 0}</p>
                  </div>
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Completed</h4>
                    <p className="text-lg font-semibold text-green-600">{customerInfo?.completedBookings || 0}</p>
                  </div>
                  <div className="p-3 border border-gray-100 rounded-lg">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">Cancelled</h4>
                    <p className="text-lg font-semibold text-red-600">{customerInfo?.cancelledBookings || 0}</p>
                  </div>
                </div>
                
                <Divider className="my-4" />
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-2 mb-3 flex items-center">
                    <FiBook className="mr-2" size={14} /> Recent Services
                  </h3>
                  <div className="space-y-3">
                    {customerListData?.slice(0, 3).map((booking, index) => (
                      <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">{booking.order_service}</p>
                          <p className="text-xs text-gray-500 flex items-center">
                            <FiCalendar className="mr-1" size={12} />
                            {moment(booking.order_service_date).format("DD MMM YYYY")}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.order_status === "Completed" ? "bg-green-100 text-green-800" :
                          booking.order_status === "Cancel" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {booking.order_status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side  */}
          <div className="w-full lg:w-[70%]">
            <div className="  border-l border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Booking History</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {customerListData?.length || 0} records
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FiTrendingUp className="mr-1" size={14} />
                  <span>Customer since {customerSince?.lastBookingDate ? 
                    moment(customerSince.lastBookingDate).format("MMM YYYY") : "N/A"}</span>
                </div>
              </div>
              
              <div className="p-1">
                <MUIDataTable
                  data={customerListData ? customerListData : []}
                  columns={columns}
                  options={options}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CustomerView;