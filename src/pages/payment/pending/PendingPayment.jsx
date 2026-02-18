import axios from "axios";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { FaCircle, FaTimesCircle } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import PaymentFilter from "../../../components/PaymentFilter";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";

import Moment from "moment";
import LoaderComponent from "../../../components/common/LoaderComponent";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";

const PendingPayment = () => {
  const [pendingData, setPendingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");
  const [totals, setTotals] = useState({
    totalPrice: 0,
    totalPaid: 0,
    totalBalance: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    if (pageParam) {
      setPage(parseInt(pageParam) - 1);
    } else {
      const storedPageNo = localStorage.getItem("page-no");
      if (storedPageNo) {
        setPage(parseInt(storedPageNo) - 1);
        navigate(`/pending-payment?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);

  UseEscapeKey();

  const fetchPendingData = async () => {
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-final-payment-open-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const bookingData = response.data?.booking;
      setPendingData(bookingData);

      if (bookingData && bookingData.length > 0) {
        const totalPrice = bookingData.reduce(
          (sum, item) => sum + (parseFloat(item.order_amount) || 0),
          0,
        );
        const totalPaid = bookingData.reduce(
          (sum, item) => sum + (parseFloat(item.order_payment_amount) || 0),
          0,
        );
        const totalBalance = totalPrice - totalPaid;

        setTotals({
          totalPrice,
          totalPaid,
          totalBalance,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPendingData();
  }, []);



  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return (
          <FaTimesCircle className="text-green-600" title="close the job" />
        );
      case "Pending":
        return (
          <FaTimesCircle className="text-yellow-600" title="close the job" />
        );
      case "Cancel":
        return <FaTimesCircle className="text-red-600" title="close the job" />;
      default:
        return <FaCircle className="text-gray-400" title={status} />;
    }
  };
  const handleClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const columns = [
    //0
    {
      name: "order_ref",
      label: "ID",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,
      },
    },
    //1
    {
      name: "branch_name",
      label: "Branch",
      options: {
        filter: true,
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,
      },
    },
    //2
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
    //3
    {
      name: "order_locality",
      label: "Area",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta) => {
          const locality = tableMeta.rowData[20];
          const sublocality = tableMeta.rowData[19];
          return (
            <div className=" flex flex-col w-40">
              <span>{locality}</span>
              <span>{sublocality}</span>
            </div>
          );
        },
      },
    },
    //4
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
    //5
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
    //6
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
            <div className=" flex flex-col w-38">
              <span>{customeName}</span>
              <span>{mobileNo}</span>
            </div>
          );
        },
      },
    },
    //7
    {
      name: "order_date",
      label: "Booking Date",
      options: {
        filter: true,
        sort: true,
        display: "exclude",
        searchable: true,
        viewColumns: false,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    //8
    {
      name: "order_service_date",
      label: "Service Date",
      options: {
        filter: true,
        sort: true,
        display: "exclude",
        searchable: true,
        viewColumns: false,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    //9
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
    //10
    {
      name: "order_service",
      label: "Service",
      options: {
        filter: true,
        display: "exclude",
        searchable: true,
        viewColumns: false,
        sort: true,
      },
    },

    //11
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
    //12
    {
      name: "service_price",
      label: "Service/Price",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const service = tableMeta.rowData[10];
          const price = tableMeta.rowData[11];
          const custom = tableMeta.rowData[13];
          return (
            <div className=" flex flex-col w-40">
              <span>{service == "Custom" ? custom : service}</span>
              <span>{price}</span>
            </div>
          );
        },
      },
    },
    //13
    {
      name: "order_custom",
      label: "Custom Description",
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
      name: "order_payment_amount",
      label: "Paid Amount",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //15
    {
      name: "order_payment_type",
      label: "Paid Type",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
    //16
    {
      name: "amount_type",
      label: "Paid Amount/Type",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const amountType = tableMeta.rowData[14];
          const paidType = tableMeta.rowData[15];
          return (
            <div className=" flex flex-col ">
              <span>{amountType}</span>
              <span>{paidType}</span>
            </div>
          );
        },
      },
    },
    // 17

    {
      name: "balance",
      label: "Balance",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const price = parseFloat(tableMeta.rowData[11]) || 0;
          const paid = parseFloat(tableMeta.rowData[14]) || 0;
          const balance = price - paid;
          return (
            <span
              className={
                balance > 0
                  ? "text-red-600 font-semibold"
                  : "text-green-600 font-semibold"
              }
            >
              ₹{balance.toFixed(2)}
            </span>
          );
        },
      },
    },

    // 18
    {
      name: "order_status",
      label: "Status Changed",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          return (
            <div className="flex justify-center grayscale ">
              {getStatusIcon(value)}
            </div>
          );
        },
      },
    },
    //19
    {
      name: "order_sub_locality",
      label: "Sub Locality",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
    //20
    {
      name: "order_locality",
      label: "Locality",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
  ];
  const confirmPayment = async () => {
    if (!selectedId) return;

    try {
      const res = await axios.put(
        `${BASE_URL}/api/panel-update-final-payment-status/${selectedId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (res?.data?.code == "200") {
        toast.success(res.data?.msg || "Payment Updated successfully");
        setIsDialogOpen(false);
        fetchPendingData();
      } else {
        toast.error(res?.data?.msg || "Failed to Payment");
      }
    } catch (error) {
      setIsDialogOpen(false);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    count: pendingData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/pending-payment?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta, e) => {
      const id = pendingData[rowMeta.dataIndex].id;
      handleClick(e, id)();
    },
    setRowProps: () => {
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
            <span className="text-red-600">Page {page + 1}</span> of{" "}
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
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title={
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-semibold">Payments</span>
                <div className="flex items-center space-x-4 px-3 py-1 bg-blue-50 rounded-md">
                  <div className="flex items-end space-x-1">
                    <span className="text-xs text-gray-600">Total Amount:</span>
                    <span className="text-sm font-bold text-blue-600">
                      ₹{totals.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-600">Paid:</span>
                    <span className="text-sm font-bold text-green-600">
                      ₹{totals.totalPaid.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-600">Balance:</span>
                    <span className="text-sm font-bold text-red-600">
                      ₹{totals.totalBalance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            }
            data={pendingData ? pendingData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
      <Dialog open={isDialogOpen} handler={() => setIsDialogOpen(false)}>
        <DialogHeader>Confirm Payment</DialogHeader>
        <DialogBody>
          Do you want to Close this payment? <br />
          <span className="text-red-500 font-semibold">
            You cannot undo this action.
          </span>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            onClick={() => setIsDialogOpen(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button color="red" onClick={confirmPayment}>
            Yes
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

export default PendingPayment;
