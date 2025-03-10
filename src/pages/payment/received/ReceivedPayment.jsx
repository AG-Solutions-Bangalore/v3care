import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import PaymentFilter from "../../../components/PaymentFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import MUIDataTable from "mui-datatables";

import Moment from "moment";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ReceivedPayment = () => {
  const [receivedData, setReceivedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
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
        navigate(`/received-payment?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
  useEffect(() => {
    const fetchReceivedData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-payment-received-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReceivedData(response.data?.booking);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReceivedData();
    setLoading(false);
  }, []);
  const handleEdit = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/pending-received-view/${id}`);
  };
  const columns = [
    {
      name: "order_ref",
      label: "ID",
      options: {
        filter: false,
        display: "exclude",
        serchable: true,
        sort: true,
        viewColumns: false,
      },
    },
    {
      name: "branch_name",
      label: "Branch",
      options: {
        filter: true,
        display: "exclude",
        serchable: true,
        sort: true,
        viewColumns: false,
      },
    },
    {
      name: "order_branch",
      label: "Order/Branch",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const brancName = tableMeta.rowData[1];
          const orderRef = tableMeta.rowData[0];
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
      name: "order_area",
      label: "Area",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "order_customer",
      label: "Customer",
      options: {
        filter: true,
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,
      },
    },
    {
      name: "order_customer_mobile",
      label: "Mobile",
      options: {
        filter: true,
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,
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
            <div className=" flex flex-col w-40">
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
        sort: true,
        display: "exclude",
        serchable: true,
        viewColumns: false,

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
        sort: true,
        display: "exclude",
        serchable: true,
        viewColumns: false,

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
          const bookingDate = tableMeta.rowData[6];
          const serviceDate = tableMeta.rowData[7];
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
        filter: true,
        sort: true,
        display: "exclude",
        viewColumns: false,

        searchable: true,
      },
    },

    {
      name: "order_amount",
      label: "Price",
      options: {
        filter: true,
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
          return (
            <div className=" flex flex-col w-40">
              <span>{service}</span>
              <span>{price}</span>
            </div>
          );
        },
      },
    },
    {
      name: "order_payment_amount",
      label: "Paid Amount",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        viewColumns: false,

        sort: false,
      },
    },
    {
      name: "order_payment_type",
      label: "Paid Type",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,

        searchable: true,
        sort: false,
      },
    },
    {
      name: "amount_type",
      label: "Paid Amount/Type",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const amountType = tableMeta.rowData[13];
          const paidType = tableMeta.rowData[14];
          return (
            <div className=" flex flex-col w-32 ">
              <span>{amountType}</span>
              <span>{paidType}</span>
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
            <div
              // onClick={() => navigate(`/pending-received-view/${id}`)}
              onClick={(e) => handleEdit(e, id)}
              className="flex items-center space-x-2"
            >
              <MdOutlineRemoveRedEye
                title="View pending Info"
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
    // rowsPerPage: 5,
    // rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,

    count: receivedData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/received-payment?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta) => {
      const id = receivedData[rowMeta.dataIndex].id;
      navigate(`/pending-received-view/${id}`);
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
      <PaymentFilter />
      {/* <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Payment Received List
        </h3>
      </div> */}
      <div className="mt-5">
        <MUIDataTable
          title="Payment Received List"
          data={receivedData ? receivedData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default ReceivedPayment;
