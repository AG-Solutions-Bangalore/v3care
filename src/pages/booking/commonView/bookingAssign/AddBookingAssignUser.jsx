import { Textarea } from "@material-tailwind/react";
import {
  Autocomplete,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../../base/BaseUrl";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";

const AddBookingAssignUser = ({ open, onClose, onSuccess }) => {
  const { id } = useParams();
  const [bookingUser, setBookingser] = useState({
    order_user_data: [],
    order_start_time: "",
    order_end_time: "",
    order_assign_remarks: "",
    order_id: id,
  });
  const [assignUserP, setAssignUserP] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${BASE_URL}/api/panel-fetch-user-for-booking-assign/${id}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setAssignUserP(data.bookingAssignUser || []))
      .catch(() => toast.error("Failed to load assignable users"));
  }, [id]);

  const userOptions = assignUserP.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (bookingUser.order_user_data.length === 0) {
      toast.error("Please select at least one user");
      setLoading(false);
      return;
    }

    const data = {
      order_user_data: bookingUser.order_user_data.map((id) => ({
        order_user_id: id,
      })),
      order_start_time: bookingUser.order_start_time,
      order_end_time: bookingUser.order_end_time,
      order_assign_remarks: bookingUser.order_assign_remarks,
      order_id: id,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-booking-assign-new`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code == "200") {
        toast.success(
          response.data?.msg || "Booking User Created Successfully"
        );
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(response.data?.msg || "Duplicate entry");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign V3Care User</DialogTitle>
      <DialogContent>
        <form
          id="addIndiv"
          autoComplete="off"
          onSubmit={onSubmit}
          className="mt-4"
        >
          <div className="grid grid-cols-1 gap-4">
            {/* User Select */}
            <Autocomplete
              multiple
              options={userOptions}
              disableCloseOnSelect
              size="small"
              value={userOptions.filter((opt) =>
                bookingUser.order_user_data.includes(opt.value)
              )}
              getOptionLabel={(option) => option.label}
              onChange={(event, newValue) =>
                setBookingser((prev) => ({
                  ...prev,
                  order_user_data: newValue.map((val) => val.value),
                }))
              }
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select User"
                  placeholder="Select User..."
                  size="small"
                />
              )}
            />

            {/* Remarks Field */}
            <Textarea
              label="Remark"
              name="order_assign_remarks"
              value={bookingUser.order_assign_remarks}
              onChange={(e) =>
                setBookingser({
                  ...bookingUser,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <ButtonConfigColor
          type="back"
          buttontype="button"
          label="Cancel"
          onClick={onClose}
        />
        <ButtonConfigColor
          onClick={onSubmit}
          type="submit"
          buttontype="submit"
          label="Submit"
          disabled={isButtonDisabled}
          loading={loading}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddBookingAssignUser;
