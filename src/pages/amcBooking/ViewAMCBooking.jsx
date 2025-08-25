import { Card, CardBody, Typography } from "@material-tailwind/react";
import axios from "axios";
import { default as moment, default as Moment } from "moment";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { FaClipboardList, FaInfoCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../base/BaseUrl";
import BookingFilter from "../../components/BookingFilter";
import LoaderComponent from "../../components/common/LoaderComponent";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import Layout from "../../layout/Layout";
import UseEscapeKey from "../../utils/UseEscapeKey";
import { CiSquarePlus } from "react-icons/ci";
import { ContextPanel } from "../../utils/ContextPanel";
const ViewAMCBooking = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState({});
  const [order, setOrderUp] = useState([]);
  const rowsPerPage = 10;
  const navigate = useNavigate();
  const { userType } = useContext(ContextPanel);
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
      setBooking(response.data?.booking || {});
      setOrderUp(response.data?.order || []);
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
                <strong>ID:</strong> {booking.order_ref} (
                {booking.order_status_amc})
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
  const handleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-booking/${id}`);
  };
  const columns = [
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <CiSquarePlus
                  onClick={(e) => handleEdit(e, id)}
                  title="edit booking"
                  className="h-6 w-6 hover:w-8 hover:h-8 hover:text-blue-900 cursor-pointer"
                />
              )}
            </div>
          );
        },
      },
    },
    //1
    {
      name: "order_ref",
      label: "Order/BookTime",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (order_ref, tableMeta) => {
          const bookTime = tableMeta.rowData[16];
          return (
            <div className="flex flex-col w-32">
              <span>{order_ref}</span>
              <span>{bookTime}</span>
            </div>
          );
        },
      },
    },
    //2
    {
      name: "order_customer",
      label: "Customer",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //3
    {
      name: "order_customer_mobile",
      label: "Mobile",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //4
    {
      name: "order_date",
      label: "Booking Date",
      options: {
        filter: true,
        sort: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        customBodyRender: (value) => {
          return Moment(value).format("DD MMM YYYY");
        },
      },
    },
    //5
    {
      name: "order_service_date",
      label: "Service Date",
      options: {
        filter: true,
        sort: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        customBodyRender: (value) => {
          return Moment(value).format("DD MMM YYYY");
        },
      },
    },
    //6
    {
      name: "booking_service_date",
      label: "Booking/Service",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const bookingDate = tableMeta.rowData[4];
          const serviceDate = tableMeta.rowData[5];
          return (
            <div className=" flex flex-col justify-center">
              <span>{Moment(bookingDate).format("DD MMM YYYY")}</span>
              <span>{Moment(serviceDate).format("DD MMM YYYY")}</span>
            </div>
          );
        },
      },
    },
    //7
    {
      name: "order_amount",
      label: "Price",
      options: {
        filter: false,
        searchable: true,
        sort: false,
      },
    },
    //8
    {
      name: "order_time",
      label: "Time",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          return (
            <div className=" flex flex-col w-32">
              <span>{value}</span>
            </div>
          );
        },
      },
    },
    //9
    {
      name: "order_payment_amount",
      label: "Amount",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: true,
      },
    },
    //10
    {
      name: "order_payment_type",
      label: "Type",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: true,
      },
    },
    //11
    {
      name: "amount_type",
      label: "Paid Amount/Type",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const service = tableMeta.rowData[9];
          const price = tableMeta.rowData[10];
          return (
            <div className=" flex flex-col w-32">
              <span>{service}</span>
              <span>{price}</span>
            </div>
          );
        },
      },
    },
    //12
    {
      name: "updated_by",
      label: "Confirm By",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //13
    {
      name: "order_status",
      label: "Status",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //14
    {
      name: "confirm/status",
      label: "Confirm By/Status",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const confirmBy = tableMeta.rowData[12];
          const status = tableMeta.rowData[13];
          return (
            <div className=" flex flex-col ">
              <span>{confirmBy}</span>
              <span>{status}</span>
            </div>
          );
        },
      },
    },
    //15
    {
      name: "order_address",
      label: "Address",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //16
    {
      name: "order_booking_time",
      label: "Book Time",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,

    count: order?.length || 0,
    rowsPerPage: rowsPerPage,
    setRowProps: (rowData) => {
      const orderStatus = rowData[13];
      let backgroundColor = "";
      if (orderStatus == "Confirmed") {
        backgroundColor = "#F7D5F1"; // light pink
      } else if (orderStatus == "Completed") {
        backgroundColor = "#F0A7FC"; // light
      } else if (orderStatus == "Inspection") {
        backgroundColor = "#B9CCF4"; // light blue
      } else if (orderStatus == "RNR") {
        backgroundColor = "#B9CCF4"; // light blue
      } else if (orderStatus == "Pending") {
        backgroundColor = "#fff"; // white
      } else if (orderStatus == "Cancel") {
        backgroundColor = "#F76E6E"; // light  red
      } else if (orderStatus == "On the way") {
        backgroundColor = "#fff3cd"; // light  yellow
      } else if (orderStatus == "In Progress") {
        backgroundColor = "#A7FCA7"; // light  green
      } else if (orderStatus == "Vendor") {
        backgroundColor = "#F38121"; // light  ornage
      }
      return {
        style: {
          backgroundColor: backgroundColor,
        },
      };
    },
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
          <MUIDataTable
            title="Order"
            data={order ? order : []}
            columns={columns}
            options={options}
          />
        </>
      )}
    </Layout>
  );
};

export default ViewAMCBooking;
