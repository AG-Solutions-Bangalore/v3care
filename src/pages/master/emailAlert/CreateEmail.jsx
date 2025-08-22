import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";

const CreateEmail = ({ open, onClose, refetch }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email_id: "",
    mobile_no: "",
  });
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === "mobile_no") {
      newValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }
    if (!formData.email_id.trim()) {
      newErrors.email_id = "Email is required";
    }
    if (!/^\d{10}$/.test(formData.mobile_no)) {
      newErrors.mobile_no = "Mobile number must be exactly 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }
    const data = new FormData();
    data.append("fullname", formData.fullname);
    data.append("email_id", formData.email_id);
    data.append("mobile_no", formData.mobile_no);

    const form = document.getElementById("createEmailForm");
    if (form.checkValidity()) {
      setIsButtonDisabled(true);

      try {
        const res = await axios({
          url: `${BASE_URL}/api/panel-create-booking-alert`,
          method: "POST",
          data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.code == "200") {
          toast.success(res.data?.msg || "Booking alert created successfully");
          handleClose();
          refetch();
        } else {
          toast.error(res.data?.msg || "Error creating booking alert");
        }
      } catch (error) {
        console.error("Create error:", error);
        toast.error(error.response?.data?.message || "An error occurred");
      } finally {
        setIsButtonDisabled(false);
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      fullname: "",
      email_id: "",
      mobile_no: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} handler={handleClose}>
      <form id="createEmailForm" onSubmit={handleSubmit}>
        <DialogHeader>Create Booking Alert</DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <div>
              <Input
                label="Full Name"
                name="fullname"
                required
                value={formData.fullname}
                onChange={handleChange}
              />
              {errors.fullname && (
                <Typography color="red" className="text-xs mt-1">
                  {errors.fullname}
                </Typography>
              )}
            </div>{" "}
            <div>
              <Input
                label="Email"
                name="email_id"
                type="email"
                required
                value={formData.email_id}
                onChange={handleChange}
              />
              {errors.email_id && (
                <Typography color="red" className="text-xs mt-1">
                  {errors.email_id}
                </Typography>
              )}
            </div>
            <div>
              <Input
                label="Mobile No"
                name="mobile_no"
                required
                value={formData.mobile_no}
                onChange={handleChange}
                maxLength={10}
              />
              {errors.mobile_no && (
                <Typography color="red" className="text-xs mt-1">
                  {errors.mobile_no}
                </Typography>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={handleClose} className="mr-2">
            Cancel
          </Button>
          <Button
            color="blue"
            type="submit"
            disabled={loading || isButtonDisabled}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default CreateEmail;
