import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Switch,
} from "@material-tailwind/react";
import axios from "axios";
import Moment from "moment";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../base/BaseUrl";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../components/common/LoaderComponent";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import UseEscapeKey from "../../utils/UseEscapeKey";

const AMCBookingList = () => {
  const [amcBookingData, setAmcBookingData] = useState(null);
  const [isDialogOpenEdit, setIsDialogOpenEdit] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userType } = useContext(ContextPanel);
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
        navigate(`/amc-booking?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();

  const fetchAMCBookingData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-amcbooking-list-all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAmcBookingData(response.data?.booking);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAMCBookingData();
  }, []);
  const handleView = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/view-amc-booking/${id}`);
  };

  const handleToggleStatus = async (e, id, currentStatus) => {
    const newStatus = currentStatus == "Active" ? "Inactive" : "Active";
    setAmcBookingData((prev) =>
      prev.map((row) =>
        row.id == id || row.order_id == id
          ? { ...row, order_status_amc: newStatus }
          : row
      )
    );

    try {
      const res = await axios.put(
        `${BASE_URL}/api/panel-update-amcbooking-status/${id}`,
        { order_status_amc: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res?.data?.code == "200") {
        toast.success(res.data?.msg || "Status updated successfully");
      } else {
        toast.error(res?.data?.msg || "Failed to update status");
        setAmcBookingData((prev) =>
          prev.map((row) =>
            row.id === id ? { ...row, order_status_amc: currentStatus } : row
          )
        );
      }
    } catch (error) {
      console.error("Update error:", error);
      setAmcBookingData((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, order_status_amc: currentStatus } : row
        )
      );
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  const handleUpdateClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setUpdateId(id);
    setIsDialogOpenEdit(true);
  };
  const confirmUpdate = async () => {
    if (!updateId) return;

    try {
      const res = await axios.put(
        `${BASE_URL}/api/panel-create-amcbooking-to-booking/${updateId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res?.data?.code == "200") {
        toast.success(res.data?.msg || "Booking converted successfully");
        fetchAMCBookingData();
        setIsDialogOpenEdit(false);
      } else {
        toast.error(res?.data?.msg || "Failed to convert booking");
      }
    } catch (error) {
      setIsDialogOpenEdit(false);
      console.error("Conversion error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
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
                  onClick={(e) => handleUpdateClick(e, id)}
                  title="edit amcbooking"
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
      label: "Order/Branch/BookTime",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (order_ref, tableMeta) => {
          const branchName = tableMeta.rowData[2];
          const bookTime = tableMeta.rowData[16];
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
      name: "order_type",
      label: "Type",
      options: {
        filter: true,
        searchable: true,
        sort: false,
      },
    },
    //7
    {
      name: "order_from_date",
      label: "From Date",
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
      name: "order_to_date",
      label: "To Date",
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
    //9
    {
      name: "booking_service_date",
      label: "From/To",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const fromDate = tableMeta.rowData[7];
          const toDate = tableMeta.rowData[8];
          return (
            <div className=" flex flex-col justify-center">
              <span>{Moment(fromDate).format("DD-MM-YYYY")}</span>
              <span>{Moment(toDate).format("DD-MM-YYYY")}</span>
            </div>
          );
        },
      },
    },
    //10
    {
      name: "order_service_date",
      label: "Next Service",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (order_service_date) => {
          return (
            <div className=" flex flex-col justify-center">
              <span>{Moment(order_service_date).format("DD-MM-YYYY")}</span>
            </div>
          );
        },
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
    //13
    {
      name: "order_status_amc",
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
      name: "order_status_amc",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const id = tableMeta.rowData[0];

          // find fresh status from state
          const row = amcBookingData.find(
            (r) => r.id == id || r.order_id == id
          );
          const status = row?.order_status_amc ?? value; // fallback to value

          return (
            <div onClick={(e) => e.stopPropagation()}>
              <Switch
                checked={status === "Active"}
                onChange={(e) => handleToggleStatus(e, id, status)}
                color="primary"
              />
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

    count: amcBookingData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/amc-booking?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta, e) => {
      const id = amcBookingData[rowMeta.dataIndex].id;
      handleView(e, id);
    },

    setRowProps: (rowData) => {
      const orderStatus = rowData[13];
      let backgroundColor = "";
      if (orderStatus == "Inactive") {
        backgroundColor = "#F76E6E";
      } else if (orderStatus == "Active") {
        backgroundColor = "#A7FCA7";
      }
      return {
        style: {
          backgroundColor: backgroundColor,
          borderBottom: "5px solid #f1f7f9",
          cursor: "pointer",
        },
      };
    },
    customToolbar: () => {
      return (
        <>
          {userType !== "4" && (
            <ButtonConfigColor
              type="create"
              label="AMC Booking"
              onClick={() => navigate("/add-amcbooking")}
            />
          )}
        </>
      );
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
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title={"AMC Booking List"}
            data={amcBookingData ? amcBookingData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
      <Dialog
        open={isDialogOpenEdit}
        handler={() => setIsDialogOpenEdit(false)}
      >
        <DialogHeader>Confirm Update</DialogHeader>
        <DialogBody>
          Do you want to Convert AMC Booking to Booking ? <br />
          <span className="text-red-500 font-semibold">
            You cannot undo this action.
          </span>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            onClick={() => setIsDialogOpenEdit(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button color="blue" onClick={confirmUpdate}>
            Create
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

export default AMCBookingList;
