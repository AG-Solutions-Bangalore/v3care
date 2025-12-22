import { Input, Textarea } from "@material-tailwind/react";
import {
  Autocomplete,
  Button,
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

const AddBookingVendor = ({ open, onClose, onSuccess }) => {
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
    if (!id) return;

    const token = localStorage.getItem("token");
    fetch(`${BASE_URL}/api/panel-fetch-booking-assign-vendor/${id}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setAssignUserP(data.vendor || []))
      .catch(() => toast.error("Failed to load assignable vendors"));
  }, [id]);

  const vendorOptions = assignUserP.map((vendor) => ({
    value: vendor.id,
    label: vendor.vendor_company,
  }));

  const onInputChange = (e) => {
    setBookingser({
      ...bookingUser,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (bookingUser.order_user_data.length === 0) {
      toast.error("Please select at least one vendor");
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

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-booking-assign-vendor-new`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code == "200") {
        toast.success(
          response.data?.msg || "Assign Vendor Created Successfully"
        );
        if (onSuccess) onSuccess(); // optional callback to refresh parent
        onClose();
      } else {
        toast.error(response.data?.msg || "Duplicate entry");
      }
    } catch (error) {
      toast.error("An error occurred while processing your request");
    } finally {
      setLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Vendor</DialogTitle>
      <DialogContent>
        <form
          id="addIndiv"
          autoComplete="off"
          onSubmit={onSubmit}
          className="mt-4"
        >
          <div className="grid grid-cols-1 gap-4">
            {/* Vendor Select */}
            <Autocomplete
              multiple
              id="vendors-multi-select"
              options={vendorOptions}
              disableCloseOnSelect
              size="small"
              value={vendorOptions.filter((opt) =>
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
                  size="small"
                  label={
                    <label style={{ fontSize: 13, fontWeight: 500 }}>
                      Select Vendor <span style={{ color: "red" }}>*</span>
                    </label>
                  }
                  placeholder="Select Vendor..."
                />
              )}
            />

            {/* Remark Field */}
            <Textarea
              label="Remark"
              name="order_assign_remarks"
              value={bookingUser.order_assign_remarks}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none transition-all duration-300 shadow-sm"
            />
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={isButtonDisabled || loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button> */}

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

export default AddBookingVendor;
