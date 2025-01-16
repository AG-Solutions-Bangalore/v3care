import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { CiSquarePlus } from "react-icons/ci";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Moment from "moment";
import MUIDataTable from "mui-datatables";
import BookingFilter from "../../../components/BookingFilter";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const PendingBooking = () => {
  const [pendingBookData, setPendingBookData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  UseEscapeKey();
  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPendingBookData(response.data?.booking);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "order_ref",
      label: "ID",
      options: {
        filter: false,
        display:"exclude",
        searchable:true,
        viewColumns: false,
        sort: false,
      },
    },
    {
      name: "branch_name",
      label: "Branch",
      options: {
        filter: true,
        display:"exclude",
        searchable:true,
        viewColumns: false,
        sort: true,
      },
    },
    {
      name: "order_branch",
      label: "Order/Branch",
      options: {
        filter: false,
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
        searchable:true,
        viewColumns: false,
        sort: false,
      },
    },
    {
      name: "order_customer_mobile",
      label: "Mobile",
      options: {
        filter: true,
        viewColumns: false,
        display:"exclude",
        searchable:true,
        sort: false,
      },
    },
    {
      name: "customer_mobile",
      label: "Customer/Mobile",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const customeName = tableMeta.rowData[3];
          const mobileNo = tableMeta.rowData[4];
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
        viewColumns: false,
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
        display:"exclude",
        viewColumns: false,
        searchable:true,
        sort: false,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "booking_service_date",
      label: "Booking/Service",
      options: {
        filter: false,
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
        viewColumns: false,
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
        viewColumns: false,
        searchable:true,
        sort: false,
      },
    },
    {
      name: "order_custom",
      label: "Custom",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    {
      name: "service_price",
      label: "Service/Price",
      options: {
        filter: false,
        sort: false,
        customBodyRender:  (value,tableMeta) => {
          const service = tableMeta.rowData[9]
          const price = tableMeta.rowData[10]
          const customeDetails = tableMeta.rowData[11];
          if (service == "Custom") {
            return (
              <div className="flex flex-col  w-36">
                <span>{customeDetails}</span>
                <span>{price}</span>
              </div>
            );
          }
          return (
            <div className=" flex flex-col w-36">
             <span>{service}</span>
             <span>{price}</span>
            </div>
          );
        },
      },
    },
    

    {
      name: "order_status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
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
                title="Booking Info"
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
 
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "5px solid #f1f7f9",
        },
      };
    },
  };
  return (
    <Layout>
      <BookingFilter />
     
      <div className="mt-5">
        <MUIDataTable
          title={"Pending Booking List"}
          data={pendingBookData ? pendingBookData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default PendingBooking;
