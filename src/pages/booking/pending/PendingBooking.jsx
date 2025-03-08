import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { CiSquarePlus } from "react-icons/ci";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Moment from "moment";
import MUIDataTable from "mui-datatables";
import BookingFilter from "../../../components/BookingFilter";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import { Spinner } from "@material-tailwind/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const PendingBooking = () => {
  const [pendingBookData, setPendingBookData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");
  useEffect(() => {
    if (pageParam) {
      setPage(parseInt(pageParam) - 1);
    } else {
      const storedPageNo = localStorage.getItem("page-no");
      if (storedPageNo) {
        setPage(parseInt(storedPageNo) - 1);
        navigate(`/pending?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
  useEffect(() => {
    const fetchPendingData = async () => {
      try {
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
    // setLoading(false);
  }, []);
  const handleEdit = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
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
                  // onClick={(e) => {
                  //   e.stopPropagation(); // Prevent row click event
                  //   navigate(`/edit-booking/${id}`);
                  // }}
                  onClick={(e) => handleEdit(e, id)}
                  title="edit booking"
                  className="h-6 w-6 hover:w-8 hover:h-8 hover:text-blue-900 cursor-pointer"
                />
              )}
              {/* <MdOutlineRemoveRedEye
                onClick={() => navigate(`/view-booking/${id}`)}
                title="Booking Info"
                className="h-5 w-5 cursor-pointer"
              /> */}
            </div>
          );
        },
      },
    },
    {
      name: "order_ref",
      label: "ID",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        viewColumns: false,
        sort: false,
      },
    },
    {
      name: "branch_name",
      label: "Branch",
      options: {
        filter: true,
        display: "exclude",
        searchable: true,
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
        customBodyRender: (value, tableMeta) => {
          const brancName = tableMeta.rowData[2];
          const orderRef = tableMeta.rowData[1];
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
        display: "exclude",
        searchable: true,
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
        display: "exclude",
        searchable: true,
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
          const customeName = tableMeta.rowData[4];
          const mobileNo = tableMeta.rowData[5];
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
        display: "exclude",
        viewColumns: false,
        searchable: true,
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
        display: "exclude",
        viewColumns: false,
        searchable: true,
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
        customBodyRender: (value, tableMeta) => {
          const bookingDate = tableMeta.rowData[7];
          const serviceDate = tableMeta.rowData[8];
          return (
            <div className=" flex flex-col justify-center">
              <span>{Moment(bookingDate).format("DD-MM-YYYY")}</span>
              <span>{Moment(serviceDate).format("DD-MM-YYYY")}</span>
            </div>
          );
        },
      },
    },
    {
      name: "order_service",
      label: "Service",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    {
      name: "order_amount",
      label: "Price",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
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
        customBodyRender: (value, tableMeta) => {
          const service = tableMeta.rowData[10];
          const price = tableMeta.rowData[11];
          const customeDetails = tableMeta.rowData[12];
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
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,

    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    count: pendingBookData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/pending?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta) => {
      const id = pendingBookData[rowMeta.dataIndex].id;
      navigate(`/view-booking/${id}`);
    },
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "5px solid #f1f7f9",
          cursor: "pointer",
        },
      };
    },
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
      return (
        <div className="flex justify-end items-center p-4">
          <span className="mx-4">
            <span className="text-red-600">{page + 1}</span>-{rowsPerPage} of{" "}
            {Math.ceil(count / rowsPerPage)}
          </span>
          <IoIosArrowBack
            onClick={page === 0 ? null : () => changePage(page - 1)}
            className={`w-6 h-6 cursor-pointer ${
              page === 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
            }  hover:text-red-600`}
          />
          <IoIosArrowForward
            onClick={
              page >= Math.ceil(count / rowsPerPage) - 1
                ? null
                : () => changePage(page + 1)
            }
            className={`w-6 h-6 cursor-pointer ${
              page >= Math.ceil(count / rowsPerPage) - 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600"
            }  hover:text-red-600`}
          />
        </div>
      );
    },
  };
  return (
    <Layout>
      <BookingFilter />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner className="h-10 w-10" color="red" />
        </div>
      ) : (
        <div className="mt-5">
          <MUIDataTable
            title={"Pending Booking List"}
            data={pendingBookData ? pendingBookData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default PendingBooking;
