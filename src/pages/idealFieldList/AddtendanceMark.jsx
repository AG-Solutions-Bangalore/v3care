import { useState } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogActions } from "@mui/material";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
import { BASE_URL } from "../../base/BaseUrl";
import { Input } from "@material-tailwind/react";
const CreateAttendanceDialog = ({ open, onClose, userId, onSuccess }) => {
  const [attendanceData, setAttendanceData] = useState({
    order_user_id: userId || "",
    attendance_date: moment().format("YYYY-MM-DD"),
  });
  const [loading, setLoading] = useState(false);
  const handleOpen = () => {
    setAttendanceData({
      order_user_id: userId || "",
      attendance_date: moment().format("YYYY-MM-DD"),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttendanceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!attendanceData.order_user_id) {
      toast.error("User ID is missing");
      return;
    }
    if (!attendanceData.attendance_date) {
      toast.error("Please select an attendance date");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-attendance`,
        {
          order_user_id: attendanceData.order_user_id,
          attendance_date: attendanceData.attendance_date,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.code === "200" || response.data.code === 200) {
        toast.success(response.data?.msg || "Attendance created successfully");
        onClose();
        onSuccess?.();
      } else {
        toast.error(response.data?.msg || "Failed to create attendance");
      }
    } catch (error) {
      console.error("Error creating attendance:", error);
      toast.error("Error creating attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      TransitionProps={{ onEnter: handleOpen }}
    >
      <form onSubmit={(e) => handleSubmit(e)}>
        <DialogContent>
          <div className="mb-5">
            <h1 className="font-bold text-xl">Create Attendance</h1>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                label="Attendance Date"
                type="date"
                name="attendance_date"
                value={attendanceData.attendance_date}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <div className="flex justify-center space-x-4 my-2">
            <ButtonConfigColor
              type="back"
              buttontype="button"
              label="Cancel"
              onClick={onClose}
            />

            <ButtonConfigColor
              type="submit"
              buttontype="submit"
              label="Create Attendance"
              loading={loading}
            />
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateAttendanceDialog;
