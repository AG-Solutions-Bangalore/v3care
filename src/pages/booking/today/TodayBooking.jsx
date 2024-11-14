import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { CiSquarePlus } from "react-icons/ci";
import Moment from "moment";
import BookingFilter from "../../../components/BookingFilter";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const TodayBooking = () => {
  const [todayBookingData, setTodayBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();

  UseEscapeKey();
  useEffect(() => {
    const fetchTodayData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-today-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTodayBookingData(response.data?.booking);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "order_ref",
      label: "ID",
      options: {
        filter: false,
        display:"exclude",
        searchable: true,
        sort: false,
      },
    },
    {
      name: "branch_name",
      label: "Branch",
      options: {
        filter: true,
        display:"exclude",
        searchable: true,
        sort: true,
      },
    },
    {
      name: "order_branch",
      label: "Order/Branch",
      options: {
        filter: true,
        sort: false,
        customBodyRender:  (value,tableMeta) => {
          const brancName = tableMeta.rowData[1]
          const orderRef = tableMeta.rowData[0]
          return (
            <div className=" flex flex-col w-32">
             <span>{orderRef}</span>
             <span>{brancName}</span>
            </div>
          );
        },
      },
    },

    {
      name: "order_customer",
      label: "Customer",
      options: {
        filter: false,
        display:"exclude",
        searchable: true,
        sort: false,
      },
    },
    {
      name: "order_customer_mobile",
      label: "Mobile",
      options: {
        filter: true,
        display:"exclude",
        searchable: true,
        sort: false,
      },
    },
    {
      name: "customer_mobile",
      label: "Customer/Mobile",
      options: {
        filter: true,
        sort: false,
        customBodyRender:  (value,tableMeta) => {
          const customeName = tableMeta.rowData[3]
          const mobileNo = tableMeta.rowData[4]
          return (
            <div className=" flex flex-col w-32">
             <span>{customeName}</span>
             <span>{mobileNo}</span>
            </div>
          );
        },
      },
    },
    {
      name: "order_date",
      label: "Booking Date",
      options: {
        filter: true,
        sort: false,
        display:"exclude",
        searchable:true,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "order_service_date",
      label: "Service Date",
      options: {
        filter: true,
        sort: false,
        display:"exclude",
        searchable:true,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "booking_service_date",
      label: "Booking/Service",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value ,tableMeta) => {
          const bookingDate = tableMeta.rowData[6]
          const serviceDate = tableMeta.rowData[7]
          return (
            <div className=" flex flex-col justify-center">
              <span>{Moment(bookingDate).format("DD-MM-YYYY")}</span>
              <span>{Moment(serviceDate).format("DD-MM-YYYY")}</span>
              </div>
          )
        },
      },
    },
    {
      name: "order_service",
      label: "Service",
      options: {
        filter: false,
        display:"exclude",
        searchable:true,
        sort: false,
      },
    },
    {
      name: "order_amount",
      label: "Price",
      options: {
        filter: false,
        display:"exclude",
        searchable:true,
        sort: false,
      },
    },
    {
      name: "service_price",
      label: "Service/Price",
      options: {
        filter: true,
        sort: false,
        customBodyRender:  (value,tableMeta) => {
          const service = tableMeta.rowData[9]
          const price = tableMeta.rowData[10]
          return (
            <div className=" flex flex-col w-32">
             <span>{service}</span>
             <span>{price}</span>
            </div>
          );
        },
      },
    },
    {
      name: "order_no_assign",
      label: "No of Assign",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "updated_by",
      label: "Confirm By",
      options: {
        filter: false,
        display:"exclude",
        searchable:true,
        sort: false,
      },
    },
    {
      name: "order_status",
      label: "Status",
      options: {
        filter: true,
        display:"exclude",
        searchable:true,
        sort: false,
      },
    },
    {
      name: "confirm/status",
      label: "Confirm By/Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender:  (value,tableMeta) => {
          const confirmBy = tableMeta.rowData[13]
          const status = tableMeta.rowData[14]
          return (
            <div className=" flex flex-col ">
             <span>{confirmBy}</span>
             <span>{status}</span>
            </div>
          );
        },
      },
    },
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
                  onClick={() => navigate(`/edit-booking/${id}`)}
                  title="edit booking"
                  className="h-5 w-5 cursor-pointer"
                />
              )}

              <MdOutlineRemoveRedEye
                onClick={() => navigate(`/view-booking/${id}`)}
                title="View Cylinder Info"
                className="h-5 w-5 cursor-pointer"
              />
            </div>
          );
        },
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive:"standard",
    viewColumns: true,
    download: false,
    print: false,
    
    setRowProps: (rowData) => {
      const orderStatus = rowData[14];
      let backgroundColor = "";
      if (orderStatus === "Confirmed") {
        backgroundColor = "#d4edda"; // light green
      } else if (orderStatus === "Completed") {
        backgroundColor = "#fff3cd"; // light yellow
      } else if (orderStatus === "Inspection") {
        backgroundColor = "#e2e3e5"; // light gray
      } else if (orderStatus === "Pending") {
        backgroundColor = "#f8d7da"; // light red
      } else if (orderStatus === "Cancel") {
        backgroundColor = "#ADD8E6"; // light  blue
      } else if (orderStatus === "On the way") {
        backgroundColor = "#b68dee"; // light  purple
      }

      return {
        style: {
          backgroundColor: backgroundColor,
          borderBottom: "5px solid #f1f7f9",
        },
      };
    },
  };
  //sajid hussain
  return (
    <Layout>
      <BookingFilter />
    
      <div className="mt-5">
        <MUIDataTable
          title={"Today Booking List"}
          data={todayBookingData ? todayBookingData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default TodayBooking;
