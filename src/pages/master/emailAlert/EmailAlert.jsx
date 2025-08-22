import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Switch,
} from "@material-tailwind/react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import CreateEmail from "./CreateEmail";
const EmailAlert = () => {
  const [emailAlertListData, setEmailAlertListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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
        navigate(`/email-alert?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  const { userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  UseEscapeKey();
  const fetchrightSidebarListData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-booking-alert-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEmailAlertListData(response.data?.bookingAlert);
    } catch (error) {
      console.error("Error in  data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchrightSidebarListData();
  }, []);
  const handleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/email-alert-edit/${id}`);
  };
  const handleToggleStatus = async (id, field, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setEmailAlertListData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: newStatus } : row))
    );
    let res;

    try {
      if (field === "email_id_status") {
        res = await axios.put(
          `${BASE_URL}/api/panel-update-booking-alert-email-status/${id}`,
          { [field]: newStatus },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else if (field === "mobile_no_status") {
        res = await axios.put(
          `${BASE_URL}/api/panel-update-booking-alert-mobile-status/${id}`,
          { [field]: newStatus },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      if (res?.data?.code == "200") {
        toast.success(res.data?.msg || "Status updated successfully");
      } else {
        toast.error(res?.data?.msg || "Failed to update status");
      }
    } catch (error) {
      console.error("Update error:", error);
      setEmailAlertListData((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, [field]: currentStatus } : row
        )
      );

      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDialogOpenDelete(true);
  };
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await axios.delete(
        `${BASE_URL}/api/panel-delete-booking-alert/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res?.data?.code == "200") {
        toast.success(res.data?.msg || "Booking alert deleted successfully");
        fetchrightSidebarListData();
        setIsDialogOpenDelete(false);
      } else {
        toast.error(res?.data?.msg || "Failed to delete booking alert");
      }
    } catch (error) {
      setIsDialogOpenDelete(false);
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  const columns = [
    {
      name: "id",
      label: "ACTION",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex space-x-2">
              <div
                onClick={() => handleDeleteClick(id)}
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-5 w-5 cursor-pointer hover:text-blue-700">
                  <title>Delete</title>
                </Trash2>
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "fullname",
      label: "Full Name",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "email_id",
      label: "Email",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "mobile_no",
      label: "Mobile",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "email_id_status",
      label: "Email Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (status, tableMeta) => {
          const id = tableMeta.rowData[0];
          return (
            <Switch
              checked={status === "Active"}
              onChange={() => handleToggleStatus(id, "email_id_status", status)}
              color="green"
            />
          );
        },
      },
    },
    {
      name: "mobile_no_status",
      label: "Mobile Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (status, tableMeta) => {
          const id = tableMeta.rowData[0];
          return (
            <Switch
              checked={status === "Active"}
              onChange={() =>
                handleToggleStatus(id, "mobile_no_status", status)
              }
              color="green"
            />
          );
        },
      },
    },
  ];

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    count: emailAlertListData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,

    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/email-alert?page=${currentPage + 1}`);
    },
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
          cursor: "pointer",
        },
      };
    },

    customToolbar: () => {
      return (
        <>
          {userType == "8" && (
            <ButtonConfigColor
              type="create"
              label="Email Alert"
              className="space-x-4"
              onClick={handleOpenDialog}
            />
          )}
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
      <MasterFilter />
      {loading ? (
        <>
          <div className="mt-1 bg-white p-2 rounded-sm">
            <LoaderComponent />
          </div>
        </>
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title="Email Alert"
            data={emailAlertListData ? emailAlertListData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
      <CreateEmail
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        refetch={fetchrightSidebarListData}
      />
      <Dialog
        open={isDialogOpenDelete}
        handler={() => setIsDialogOpenDelete(false)}
      >
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Do you want to delete this booking alert? <br />
          <span className="text-red-500 font-semibold">
            You cannot undo this action.
          </span>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            onClick={() => setIsDialogOpenDelete(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

export default EmailAlert;
