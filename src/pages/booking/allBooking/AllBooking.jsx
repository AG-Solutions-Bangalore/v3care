import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { CiSquarePlus } from "react-icons/ci";
import Moment from "moment";
import BookingFilter from "../../../components/BookingFilter";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import { Spinner } from "@material-tailwind/react";
import { TextField } from "@mui/material";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import LoaderComponent from "../../../components/common/LoaderComponent";
import AssignDetailsModal from "../../../components/AssignDetailsModal";
import GroupBookingView from "../commonView/GroupBookingView";

const AllBooking = () => {
  const [allBookingData, setAllBookingData] = useState(null);

  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredBookingData, setFilteredBookingData] = useState([]);
  const location = useLocation();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");
  const [uniqueDates, setUniqueDates] = useState([]);
  const [uniqueDate, setUniqueDate] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAssignDetails, setSelectedAssignDetails] = useState([]);
  useEffect(() => {
    if (pageParam) {
      setPage(parseInt(pageParam) - 1);
    } else {
      const storedPageNo = localStorage.getItem("page-no");
      if (storedPageNo) {
        setPage(parseInt(storedPageNo) - 1);
        navigate(`/all-booking?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    localStorage.setItem("filteredDate", date);

    if (date) {
      const filteredData = allBookingData.filter((item) => {
        const itemDate = new Date(item.order_service_date);
        const selectedDateObj = new Date(date);
        return itemDate.toDateString() === selectedDateObj.toDateString();
      });
      setFilteredBookingData(filteredData);
    } else {
      setFilteredBookingData(allBookingData);
    }
  };
  useEffect(() => {
    const storedDate = localStorage.getItem("filteredDate");

    if (storedDate && allBookingData) {
      const filteredData = allBookingData.filter((item) => {
        const itemDate = new Date(item.order_service_date);
        const selectedDateObj = new Date(storedDate);
        return itemDate.toDateString() === selectedDateObj.toDateString();
      });

      setSelectedDate(storedDate);
      setFilteredBookingData(filteredData);
    } else {
      setFilteredBookingData(allBookingData);
    }
  }, [allBookingData]);
  UseEscapeKey();

  useEffect(() => {
    const fetchTodayData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-list-all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAllBookingData(response.data?.booking);
        setFilteredBookingData(response.data?.booking);

        // Extract unique dates, convert to YYYY-MM-DD for sorting
        const dates = [
          ...new Set(
            response.data?.booking.map((item) =>
              Moment(item.order_date, "YYYY-MM-DD").format("YYYY-MM-DD")
            )
          ),
        ].sort(
          (a, b) =>
            Moment(b, "YYYY-MM-DD").valueOf() -
            Moment(a, "YYYY-MM-DD").valueOf()
        );
        const date = [
          ...new Set(
            response.data?.booking.map((item) =>
              Moment(item.order_service_date, "YYYY-MM-DD").format("YYYY-MM-DD")
            )
          ),
        ].sort(
          (a, b) =>
            Moment(b, "YYYY-MM-DD").valueOf() -
            Moment(a, "YYYY-MM-DD").valueOf()
        );

        // Convert back to DD-MM-YYYY format after sorting
        const formattedDates = dates.map((date) =>
          Moment(date, "YYYY-MM-DD").format("DD-MM-YYYY")
        );
        // Convert back to DD-MM-YYYY format after sorting
        const formattedDate = date.map((date) =>
          Moment(date, "YYYY-MM-DD").format("DD-MM-YYYY")
        );

        setUniqueDates(formattedDates);
        setUniqueDate(formattedDate);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayData();
  }, []);

  const handleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/edit-booking/${id}`);
  };

  const handleView = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/view-booking/${id}`);
  };
  const handleReset = () => {
    setSelectedDate(null);
    setFilteredBookingData(allBookingData);
    localStorage.removeItem("filteredDate");
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
                  title="Edit Boking"
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
        sort: true,
        viewColumns: false,
      },
    },
    //3
    {
      name: "order_customer",
      label: "Customer",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
    //4
    {
      name: "order_customer_mobile",
      label: "Mobile",
      options: {
        filter: true,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
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

        filterOptions: {
          names: [...uniqueDates]
            .map((date) => Moment(date, "DD-MM-YYYY"))
            .sort((a, b) => b.valueOf() - a.valueOf())
            .map((date) => date.format("YYYY-MM-DD"))
            .reverse(),

          fullWidth: true,
          renderValue: (value) =>
            Moment(value, "YYYY-MM-DD").format("DD-MMM-YYYY"),
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
        searchable: true,
        viewColumns: false,

        filterOptions: {
          names: [...uniqueDate]
            .map((date) => Moment(date, "DD-MM-YYYY"))
            .sort((a, b) => b.valueOf() - a.valueOf())
            .map((date) => date.format("YYYY-MM-DD"))
            .reverse(),
          fullWidth: true,
          renderValue: (value) =>
            Moment(value, "YYYY-MM-DD").format("DD-MMM-YYYY"),
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
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
    //10
    {
      name: "order_amount",
      label: "Price",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
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
      name: "order_assign",
      label: "Order Assign",
      options: {
        filter: false,
        sort: false,
        display: "exclude",
        viewColumns: false,
      },
    },
    //15
    {
      name: "order_no_assign",
      label: "No of Assign",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const orderAssign = tableMeta.rowData[14];

          const activeAssignments = orderAssign.filter(
            (assign) => assign.order_assign_status !== "Cancel"
          );
          const count = activeAssignments.length;

          if (count > 0) {
            return (
              <button
                className="w-16 hover:bg-red-200 border border-gray-200 rounded-lg shadow-lg bg-green-200 text-black cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAssignDetails(activeAssignments);
                  setOpenModal(true);
                }}
              >
                {count}
              </button>
            );
          }
          return <span>{count}</span>;
        },
      },
    },
    // 16
    {
      name: "assignment_details",
      label: "Assign Details",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const orderAssign = tableMeta.rowData[14];

          const activeAssignments = orderAssign.filter(
            (assign) => assign.order_assign_status !== "Cancel"
          );

          if (activeAssignments.length === 0) {
            return <span>-</span>;
          }

          return (
            <div className="w-48 overflow-x-auto">
              <table className="min-w-full table-auto border-collapse text-sm">
                <tbody className="flex flex-wrap h-[40px] border-1 border-black w-48">
                  <tr>
                    <td className="text-xs px-[2px] leading-[12px]">
                      {activeAssignments
                        .map((assign) => assign.user.name)
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
    //17
    {
      name: "order_payment_amount",
      label: "Amount",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,
      },
    },
    //18
    {
      name: "order_payment_type",
      label: "Type",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,
      },
    },
    //19
    {
      name: "amount_type",
      label: "Paid Amount/Type",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const service = tableMeta.rowData[18];
          const price = tableMeta.rowData[17];
          return (
            <div className=" flex flex-col w-32">
              <span>{service}</span>
              <span>{price}</span>
            </div>
          );
        },
      },
    },
    //20
    {
      name: "updated_by",
      label: "Confirm By",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
    //21
    {
      name: "order_status",
      label: "Status",
      options: {
        filter: true,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
    //22
    {
      name: "confirm/status",
      label: "Confirm By/Status",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const confirmBy = tableMeta.rowData[20];
          const status = tableMeta.rowData[21];
          return (
            <div className=" flex flex-col ">
              <span>{confirmBy}</span>
              <span>{status}</span>
            </div>
          );
        },
      },
    },
    //23
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

    onRowClick: (rowData, rowMeta, e) => {
      const id = allBookingData[rowMeta.dataIndex].id;

      handleView(e, id)();
    },
    count: allBookingData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/all-booking?page=${currentPage + 1}`);
    },
    setRowProps: (rowData) => {
      const orderStatus = rowData[21];
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
        backgroundColor = "#F38121"; // light  orange
      }

      return {
        style: {
          backgroundColor: backgroundColor,
          borderBottom: "5px solid #f1f7f9",
          cursor: "pointer",
        },
      };
    },

    // Custom Toolbar with Date Input
    customToolbar: () => {
      return (
        <>
          <TextField
            label="Filter by Date"
            type="date"
            value={selectedDate || ""}
            onChange={handleDateChange}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            className="mr-4"
          />

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-black rounded-md ml-4"
          >
            Reset
          </button>
        </>
      );
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
            title={"All Booking List"}
            data={filteredBookingData}
            columns={columns}
            options={options}
          />
        </div>
      )}
      <AssignDetailsModal
        open={openModal}
        handleOpen={setOpenModal}
        assignDetails={selectedAssignDetails}
      />
    </Layout>
  );
};

export default AllBooking;
