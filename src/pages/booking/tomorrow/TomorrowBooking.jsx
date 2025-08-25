import axios from "axios";
import Moment from "moment";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import BookingFilter from "../../../components/BookingFilter";
import LoaderComponent from "../../../components/common/LoaderComponent";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const TomorrowBooking = () => {
  const [tomBookingData, setTomBookingData] = useState(null);
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
        navigate(`/tomorrow?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
  useEffect(() => {
    const fetchTomData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-tom-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTomBookingData(response.data?.booking);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTomData();
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
    {
      name: "order_ref",
      label: "Order/Branch/BookTime",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (order_ref, tableMeta) => {
          const branchName = tableMeta.rowData[2];
          const bookTime = tableMeta.rowData[24];
          return (
            <div className="flex flex-col w-32">
              <span>{order_ref}</span>
              <span>{branchName}</span>
              <span>{bookTime}</span>
            </div>
          );
        },
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
      name: "order_customer",
      label: "Customer",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "order_customer_mobile",
      label: "Mobile",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "order_date",
      label: "Booking Date",
      options: {
        filter: true,
        sort: false,
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
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "order_service",
      label: "Service",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const customValue = tableMeta.rowData[8];
          return value == "Custom" ? ` (${customValue || "-"})` : value;
        },
      },
    },
    {
      name: "order_custom",
      label: "Custom",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
      },
    },
    {
      name: "order_amount",
      label: "Price",
      options: {
        filter: false,
        sort: false,
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
        sort: false,
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
    count: tomBookingData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/tomorrow?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta, e) => {
      const id = tomBookingData[rowMeta.dataIndex].id;

      handleView(e, id)();
    },
    setRowProps: (rowData) => {
      const orderStatus = rowData[12];
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
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title={"Tomorrow Booking List"}
            data={tomBookingData ? tomBookingData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default TomorrowBooking;
