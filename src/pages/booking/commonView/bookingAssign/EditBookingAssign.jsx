import { Input, Textarea } from "@material-tailwind/react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../../base/BaseUrl";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";
import { ContextPanel } from "../../../../utils/ContextPanel";

const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "38px",
    borderRadius: "0.375rem",
    borderColor: "#e5e7eb",
  }),

  menuPortal: (base) => ({
    ...base,
    zIndex: 1600,
  }),

  menu: (provided) => ({
    ...provided,
    zIndex: 1600,
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#3b82f6" : "white",
    color: state.isSelected ? "white" : "#1f2937",
    "&:hover": {
      backgroundColor: "#e5e7eb",
    },
  }),
};

const EditBookingAssignDialog = ({ open, onClose, onSuccess, bookingId }) => {
  const { isPanelUp } = useContext(ContextPanel);

  const [bookingUser, setBookingUser] = useState({
    order_user_id: "",
    order_start_time: "",
    order_end_time: "",
    order_assign_remarks: "",
    order_assign_status: "",
  });
  const [assignUserP, setAssignUserP] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookingAssign = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-assign-by-id/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookingUser(response.data?.bookingAssign);
        setAssignUserP(response.data?.bookingAssignUser || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch booking assign data");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingAssign();
  }, [bookingId]);

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Finish", label: "Finish" },
    { value: "Cancel", label: "Cancel" },
  ];

  const userOptions = assignUserP.map((user) => ({
    value: user.id,
    label: user.name,
  }));
  const selectedUser =
    userOptions.find((opt) => opt.value === bookingUser.order_user_id) || null;
  const selectedStatus =
    statusOptions.find(
      (opt) => opt.value === bookingUser.order_assign_status
    ) || null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      order_user_id: bookingUser.order_user_id,
      order_start_time: bookingUser.order_start_time,
      order_end_time: bookingUser.order_end_time,
      order_assign_remarks: bookingUser.order_assign_remarks,
      order_assign_status: bookingUser.order_assign_status,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-booking-assign/${bookingId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.code == "200") {
        toast.success(
          response.data?.msg || "Assign Booking Updated Successfully"
        );
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(response.data?.msg || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit V3Care User</DialogTitle>
      <DialogContent>
        <form id="editBookingAssign" onSubmit={onSubmit} className="mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
            {/* Assign User */}
            <div>
              <Select
                options={userOptions}
                value={selectedUser}
                onChange={(option) =>
                  setBookingUser({
                    ...bookingUser,
                    order_user_id: option ? option.value : "",
                  })
                }
                styles={customStyles}
                placeholder="Select a user..."
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>

            {/* Status */}
            <div>
              <Select
                options={statusOptions}
                value={selectedStatus}
                onChange={(option) =>
                  setBookingUser({
                    ...bookingUser,
                    order_assign_status: option ? option.value : "",
                  })
                }
                styles={customStyles}
                placeholder="Select status..."
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>

            {/* Remarks */}
            <div className="col-span-2">
              <Textarea
                label="Remarks"
                multiline
                name="order_assign_remarks"
                value={bookingUser.order_assign_remarks}
                onChange={(e) =>
                  setBookingUser({
                    ...bookingUser,
                    [e.target.name]: e.target.value,
                  })
                }
                rows={4}
                fullWidth
              />
            </div>
          </div>
        </form>
      </DialogContent>

      <DialogActions>
        <ButtonConfigColor onClick={onClose} type="back" label="Cancel" />
        <ButtonConfigColor
          onClick={onSubmit}
          type="submit"
          label={`${loading ? "Updating..." : "Update"}`}
        />
      </DialogActions>
    </Dialog>
  );
};

export default EditBookingAssignDialog;
