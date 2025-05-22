import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {BASE_URL} from "../../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import { CiSquarePlus } from "react-icons/ci";
import Moment from "moment";
import BookingFilter from "../../../components/BookingFilter";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import OrderRefModal from "../../../components/OrderRefModal";
import { Spinner } from "@material-tailwind/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import LoaderComponent from "../../../components/common/LoaderComponent";

const TodayBooking = () => {
  const [todayBookingData, setTodayBookingData] = useState(null);
  const [assignmentData, setAssignmentData] = useState({});
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
        navigate(`/today?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();

  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderRef, setSelectedOrderRef] = useState(null);
  const [loadingAssignment, setLoadingAssignment] = useState(null);

  const fetchAssignmentData = async (orderRef) => {
    try {
      setLoadingAssignment(orderRef);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-booking-assign-by-view/${orderRef}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignmentData((prev) => ({
        ...prev,
        [orderRef]: response.data?.bookingAssign,
      }));
    } catch (error) {
      console.error("Error fetching assignment data", error);
    } finally {
      setLoadingAssignment(null);
    }
  };

  const handleOpenModal = (orderRef) => {
    setSelectedOrderRef(orderRef);
    setIsModalOpen(true);
    // fetchAssignmentData(orderRef);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderRef(null);
  };
  useEffect(() => {
    const fetchTodayData = async () => {
      try {
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

        response.data?.booking.forEach((item) => {
          if (item.order_no_assign > 0) {
            fetchAssignmentData(item.order_ref);
          }
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayData();
    // setLoading(false);
  }, []);
  const handleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    // localStorage.setItem("page-no", pageParam);
    navigate(`/edit-booking/${id}`);
  };
  const handleView = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    // localStorage.setItem("page-no", pageParam);
    navigate(`/view-booking/${id}`);
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
            </div>
          );
        },
      },
    },
    //1
    {
      name: "order_ref",
      label: "Order/Branch",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (order_ref, tableMeta) => {
          const branchName = tableMeta.rowData[2];
          return (
            <div className="flex flex-col w-32">
              <span>{order_ref}</span>
              <span>{branchName}</span>
            </div>
          );
        },
      },
    },
    //2
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
    //3
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
    //4
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
    //5
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
    //6
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
    //7
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
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    //8
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
    //9
    {
      name: "order_service",
      label: "Service",
      options: {
        filter: false,
        viewColumns: false,
        display: "exclude",
        searchable: true,
        sort: false,
      },
    },
    //10
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
    //11
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
    //12
    {
      name: "service_price",
      label: "Service/Price",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const service = tableMeta.rowData[9];
          const price = tableMeta.rowData[10];
          const customeDetails = tableMeta.rowData[11];
          if (service == "Custom") {
            return (
              <div className="flex flex-col w-32">
                <span>{customeDetails}</span>
                <span>{price}</span>
              </div>
            );
          }
          return (
            <div className=" flex flex-col w-32">
              <span>{service}</span>
              <span>{price}</span>
            </div>
          );
        },
      },
    },
    //13
    {
      name: "order_time",
      label: "Time/Area",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const area = tableMeta.rowData[22];
          return (
            <div className=" flex flex-col w-32">
              <span>{value}</span>
              <span style={{ fontSize: "9px" }}>{area}</span>
            </div>
          );
        },
      },
    },
   //14
{
  name: "order_no_assign",
  label: "No of Assign",
  options: {
    filter: false,
    sort: false,
    customBodyRender: (value, tableMeta) => {
      const order_ref = tableMeta.rowData[1];
      const assignments = assignmentData[order_ref];
      
      
      const validAssignments = assignments 
        ? assignments.filter(a => a.order_assign_status !== "Cancel")
        : [];
      
      const pendingCount = validAssignments.length;

      return pendingCount > 0 ? (
        <div className="flex flex-col w-32">
          <button
            className=" w-16  hover:bg-red-200 border border-gray-200  rounded-lg shadow-lg bg-green-200 text-black cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(order_ref);
            }}
            disabled={loadingAssignment === order_ref}
          >
            {loadingAssignment === order_ref ? (
              <span className="flex justify-center items-center">
                <svg
                  className="animate-spin h-4 w-4 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            ) : (
              pendingCount
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col w-32">
          <span>{pendingCount}</span>
        </div>
      );
    },
  },
},
//15
{
  name: "assignment_details",
  label: "Assign Details",
  options: {
    filter: false,
    sort: false,
    customBodyRender: (value, tableMeta) => {
      const orderRef = tableMeta.rowData[1];
      const orderNoAssign = tableMeta.rowData[14];
      const assignments = assignmentData[orderRef];

      if (!orderNoAssign || orderNoAssign <= 0 || !assignments) {
        return "-";
      }
            
      
      const validAssignments = assignments.filter(
        (assignment) => assignment.order_assign_status !== "Cancel"
      );

      if (validAssignments.length === 0) {
        return "-";
      }

      return (
        <div className="w-48 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <tbody className="flex flex-wrap h-[40px] boredr-2 border-black w-48">
              <tr>
                <td className="text-xs px-[2px] leading-[12px]">
                  {validAssignments
                    .map((assignment) => assignment.name.split(" ")[0])
                    .join(", ")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    },
  },
},
    //16
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
    //17
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
    //18
    {
      name: "amount_type",
      label: "Paid Amount/Type",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const service = tableMeta.rowData[17];
          const price = tableMeta.rowData[16];
          return (
            <div className=" flex flex-col w-32">
              <span>{service}</span>
              <span>{price}</span>
            </div>
          );
        },
      },
    },
    //19
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
    //20
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
    //21
    {
      name: "confirm/status",
      label: "Confirm By/Status",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const confirmBy = tableMeta.rowData[19];
          const status = tableMeta.rowData[20];
          return (
            <div className=" flex flex-col ">
              <span>{confirmBy}</span>
              <span>{status}</span>
            </div>
          );
        },
      },
    },
    //22
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
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,

    count: todayBookingData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/today?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta, e) => {
      const id = todayBookingData[rowMeta.dataIndex].id;
      handleView(e, id)();
    },

    setRowProps: (rowData) => {
      const orderStatus = rowData[20];
      let backgroundColor = "";
      if (orderStatus === "Confirmed") {
        backgroundColor = "#F7D5F1"; // light pink
      } else if (orderStatus === "Completed") {
        backgroundColor = "#F0A7FC"; // light
      } else if (orderStatus === "Inspection") {
        backgroundColor = "#B9CCF4"; // light blue
      } else if (orderStatus === "RNR") {
        backgroundColor = "#B9CCF4"; // light blue
      } else if (orderStatus === "Pending") {
        backgroundColor = "#fff"; // white
      } else if (orderStatus === "Cancel") {
        backgroundColor = "#F76E6E"; // light  red
      } else if (orderStatus === "On the way") {
        backgroundColor = "#fff3cd"; // light  yellow
      } else if (orderStatus === "In Progress") {
        backgroundColor = "#A7FCA7"; // light  green
      } else if (orderStatus === "Vendor") {
        backgroundColor = "#F38121"; // light  ornage
      }

      return {
        style: {
          backgroundColor: backgroundColor,
          borderBottom: "5px solid #f1f7f9",
          cursor: "pointer", // Add pointer cursor to indicate clickable rows
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
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title={"Today Booking List"}
            data={todayBookingData ? todayBookingData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
      <OrderRefModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        orderRef={selectedOrderRef}
      />
    </Layout>
  );
};

export default TodayBooking;
