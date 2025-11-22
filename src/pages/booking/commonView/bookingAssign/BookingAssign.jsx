import axios from "axios";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../../../base/BaseUrl";
import BookingFilter from "../../../../components/BookingFilter";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";
import Layout from "../../../../layout/Layout";
import { ContextPanel } from "../../../../utils/ContextPanel";
import UseEscapeKey from "../../../../utils/UseEscapeKey";
import AddBookingAssignUser from "./AddBookingAssignUser";
import EditBookingAssignDialog from "./EditBookingAssign";
const BookingAssign = () => {
  const { id } = useParams();
  const [bookingAssignData, setBookingAssignData] = useState(null);
  const { userType } = useContext(ContextPanel);
  localStorage.setItem("assignBook", id);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

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
  const handleEditClick = (id) => {
    setSelectedBookingId(id); // store the ID in state
    setOpenEditDialog(true); // open the dialog
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
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <FaEdit
                  // onClick={() => navigate(`/edit-booking-assign/${id}`)}
                  onClick={() => handleEditClick(id)}
                  title="Edit Booking Asssign"
                  className="h-5 w-5 cursor-pointer"
                />
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
    setRowProps: () => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
        },
      };
    },
  };
  return (
    <Layout>
      <BookingFilter />

      <PageHeader
        title={"Booking User List"}
        label2={
          <ButtonConfigColor
            type="create"
            label="Add Booking User"
            // onClick={() => navigate(`/add-booking-user/${id}`)}
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
    </Layout>
  );
};

export default BookingAssign;
