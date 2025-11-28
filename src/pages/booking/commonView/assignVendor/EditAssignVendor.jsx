import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../../../../base/BaseUrl";
import { Input } from "@material-tailwind/react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { ContextPanel } from "../../../../utils/ContextPanel";
import UseEscapeKey from "../../../../utils/UseEscapeKey";

const EditAssignVendorDialog = ({ open, onClose, bookingId, onSuccess }) => {
  UseEscapeKey();
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
    if (!bookingId) return;

    const fetchBookingData = async () => {
      try {
        if (!isPanelUp) return;
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-assign-vendor-by-id/${bookingId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookingUser(response.data?.bookingAssign);
        setAssignUserP(response.data?.bookingAssignUser || []);
      } catch (error) {
        console.error("Error fetching booking vendor data", error);
        toast.error("Failed to load vendor data");
      }
    };
    fetchBookingData();
  }, [bookingId, isPanelUp]);

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Finish", label: "Finish" },
    { value: "Cancel", label: "Cancel" },
  ];

  const onInputChange = (e) => {
    setBookingUser({
      ...bookingUser,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        order_user_id: bookingUser.order_user_id,
        order_start_time: bookingUser.order_start_time,
        order_end_time: bookingUser.order_end_time,
        order_assign_remarks: bookingUser.order_assign_remarks,
        order_assign_status: bookingUser.order_assign_status,
      };

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-booking-assign-vendor/${bookingId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code == "200") {
        toast.success(
          response.data?.msg || "Assign Vendor Updated Successfully"
        );
        if (onSuccess) onSuccess(); // refresh parent
        onClose();
      } else {
        toast.error(response.data?.msg || "Failed to update Assign Vendor");
      }
    } catch (error) {
      toast.error("An error occurred while updating");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit  Assign Vendor</DialogTitle>
      <DialogContent>
        <form id="editVendorForm" onSubmit={onSubmit} className="mt-4">
          <div className="grid grid-cols-1  gap-6">
            {/* Assign Vendor */}
            <div className="col-span-1">
              <FormControl fullWidth>
                <InputLabel id="vendor-select-label">
                  Assign Vendor *
                </InputLabel>
                <Select
                  labelId="vendor-select-label"
                  name="order_user_id"
                  value={bookingUser.order_user_id}
                  onChange={onInputChange}
                  required
                  sx={{ height: "40px", borderRadius: "5px" }}
                >
                  {assignUserP.map((vendor) => (
                    <MenuItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Status */}
            <div >
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Status *</InputLabel>
                <Select
                  labelId="status-select-label"
                  name="order_assign_status"
                  value={bookingUser.order_assign_status}
                  onChange={onInputChange}
                  required
                  sx={{ height: "40px", borderRadius: "5px" }}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Remarks */}
            <div >
              <Input
                label="Remarks"
                multiline
                name="order_assign_remarks"
                value={bookingUser.order_assign_remarks}
                onChange={onInputChange}
                fullWidth
                className="bg-gray-100 rounded-md"
              />
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAssignVendorDialog;
