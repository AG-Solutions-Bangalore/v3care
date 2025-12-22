import axios from "axios";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../../../base/BaseUrl";
import BookingFilter from "../../../../components/BookingFilter";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";
import Layout from "../../../../layout/Layout";
import { ContextPanel } from "../../../../utils/ContextPanel";
import UseEscapeKey from "../../../../utils/UseEscapeKey";
import AddBookingAssignUser from "./AddBookingAssignUser";
import EditBookingAssignDialog from "./EditBookingAssign";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { Trash2 } from "lucide-react";
const BookingAssign = () => {
  const { id } = useParams();
  const [bookingAssignData, setBookingAssignData] = useState(null);
  const { userType } = useContext(ContextPanel);
  localStorage.setItem("assignBook", id);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [isDialogOpenDelete, setIsDialogOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  UseEscapeKey();
  const fetchBookingAssignData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-booking-assign-list/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookingAssignData(response.data?.bookingAssign);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };
  useEffect(() => {
    fetchBookingAssignData();
  }, []);
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDialogOpenDelete(true);
  };
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await axios.delete(
        `${BASE_URL}/api/panel-delete-booking-assign-by-id/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res?.data?.code == "200") {
        toast.success(
          res.data?.msg || "Booking assign v3care user successfully"
        );
        fetchBookingAssignData();
        setIsDialogOpenDelete(false);
      } else {
        toast.error(res?.data?.msg || "Failed to delete assign v3care user");
      }
    } catch (error) {
      setIsDialogOpenDelete(false);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  const handleEditClick = (id) => {
    setSelectedBookingId(id);
    setOpenEditDialog(true);
  };
  const columns = [
    {
      name: "slNo",
      label: "SL No",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return tableMeta.rowIndex + 1;
        },
      },
    },
    {
      name: "name",
      label: "Full Name",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "order_start_time",
      label: "Start Time",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "order_end_time",
      label: "End Time",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "order_assign_remarks",
      label: "Remarks",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "order_assign_status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
      },
    },

    {
      name: "order_service",
      label: "Service",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id, tableMeta) => {
          const orderAssignStatus = tableMeta.rowData[5]; 

          return (
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <FaEdit
                  onClick={() => handleEditClick(id)}
                  title="Edit Booking Assign"
                  className="h-5 w-5 cursor-pointer"
                />
              )}

              {orderAssignStatus === "Pending" && (
                <Trash2
                  onClick={() => handleDeleteClick(id)}
                  className="h-5 w-5 cursor-pointer text-red-400 hover:text-red-700"
                >
                  <title>Delete</title>
                </Trash2>
              )}
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
  };
  return (
    <Layout>
      <BookingFilter />

      <PageHeader
        title={"Booking User List"}
        label2={
          <ButtonConfigColor
            type="create"
            label="Add V3 User"
            onClick={() => setOpenDialog(true)}
          />
        }
      />
      <div className="mt-5">
        <MUIDataTable
          data={bookingAssignData ? bookingAssignData : []}
          columns={columns}
          options={options}
        />
      </div>
      {openDialog && (
        <AddBookingAssignUser
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSuccess={() => fetchBookingAssignData()}
        />
      )}
      {openEditDialog && selectedBookingId && (
        <EditBookingAssignDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onSuccess={() => fetchBookingAssignData()}
          bookingId={selectedBookingId}
        />
      )}
      <Dialog
        open={isDialogOpenDelete}
        handler={() => setIsDialogOpenDelete(false)}
      >
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Do you want to delete this assign v3care user? <br />
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

export default BookingAssign;
