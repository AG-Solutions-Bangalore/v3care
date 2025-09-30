import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../../layout/Layout";
import BookingFilter from "../../../../components/BookingFilter";
import axios from "axios";
import { BASE_URL } from "../../../../base/BaseUrl";
import { toast } from "react-toastify";
import UseEscapeKey from "../../../../utils/UseEscapeKey";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";
import { Input } from "@material-tailwind/react";
import Select from "react-select";

const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "38px",
    height: "auto",
    borderRadius: "0.375rem",
    borderColor: "#e5e7eb",
    paddingTop: "2px",
    paddingBottom: "2px",
    "&:hover": {
      borderColor: "#9ca3af",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "auto",
    padding: "4px 8px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "38px",
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

const AddBookingAssignUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  UseEscapeKey();

  const [bookingUser, setBookingser] = useState({
    order_user_id: "",
    order_start_time: "",
    order_end_time: "",
    order_assign_remarks: "",
    order_id: id,
  });

  const [assisgnUserP, setAssignUserP] = useState([]);
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

 
  const userOptions = assisgnUserP.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  const selectedUser =
    userOptions.find((opt) => opt.value === bookingUser.order_user_id) || null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!bookingUser.order_user_id) {
      toast.error("Please select a user");
      setLoading(false);
      return;
    }

    setIsButtonDisabled(true);

    const data = {
      order_user_id: bookingUser.order_user_id,
      order_start_time: bookingUser.order_start_time,
      order_end_time: bookingUser.order_end_time,
      order_assign_remarks: bookingUser.order_assign_remarks,
      order_id: id,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-booking-assign`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.code == "200") {
        toast.success(response.data?.msg || "Booking User Created Successfully");
        navigate(`/booking-assign/${id}`);
      } else {
        toast.error(response.data?.msg || "Duplicate entry");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <BookingFilter />
      <PageHeader title={"Create Booking User"} />

      <div className="w-full mt-5 mx-auto p-8 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Assign User Field */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign User <span className="text-red-500">*</span>
              </label> */}
              <Select
                options={userOptions}
                value={selectedUser}
                onChange={(option) =>
                  setBookingser({ ...bookingUser, order_user_id: option.value })
                }
                styles={customStyles}
                placeholder="Select a user..."
                isMulti={false}
                required
              />
            </div>

            {/* Remarks Field */}
            <div>
              <Input
                label="Remark"
                name="order_assign_remarks"
                value={bookingUser.order_assign_remarks}
                onChange={(e) =>
                  setBookingser({ ...bookingUser, [e.target.name]: e.target.value })
                }
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-4">
            <ButtonConfigColor
              type="submit"
              buttontype="submit"
              label="Submit"
              disabled={isButtonDisabled}
              loading={loading}
            />
            <ButtonConfigColor
              type="button"
              buttontype="button"
              label="Cancel"
              onClick={() => navigate(-1)}
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddBookingAssignUser;
