import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../../layout/Layout";
import BookingFilter from "../../../../components/BookingFilter";
import { useState } from "react";
import { MdUpdate } from "react-icons/md";
import { Button, MenuItem, TextField } from "@mui/material";
import BASE_URL from "../../../../base/BaseUrl";
import axios from "axios";
import { ContextPanel } from "../../../../utils/ContextPanel";

const EditBookingAssign = () => {
  const { id } = useParams();

  const [bookingUser, setBookingUser] = useState({
    order_user_id: "",
    order_start_time: "",
    order_end_time: "",
    order_assign_remarks: "",
    order_assign_status: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [assignUserP, setAssignUserP] = useState([]);

  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-assign-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookingUser(response.data?.bookingAssign);
        setAssignUserP(response.data?.bookingAssignUser);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayData();
    setLoading(false);
  }, []);

  const status = [
    {
      value: "Pending",
      label: "Pending",
    },
    {
      value: "Confirmed",
      label: "Confirmed",
    },
    {
      value: "Finish",
      label: "Finish",
    },
    {
      value: "Cancel",
      label: "Cancel",
    },
  ];

  const onInputChange = (e) => {
    setBookingUser({
      ...bookingUser,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic
    let data = {
      order_user_id: bookingUser.order_user_id,
      order_start_time: bookingUser.order_start_time,
      order_end_time: bookingUser.order_end_time,
      order_assign_remarks: bookingUser.order_assign_remarks,
      order_assign_status: bookingUser.order_assign_status,
    };
    const response = await axios.put(
      `${BASE_URL}/api/panel-update-booking-assign/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.code == "200") {
      alert("Success hurray");
    }
  };

  return (
    <Layout>
      <BookingFilter />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Edit Booking Assign User <span className="text-blue-600">{id}</span>
        </h2>
        <div className=" border border-gray-300 bg-white p-6 rounded-lg shadow-lg">
          <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Assign User */}
              <div className="col-span-1">
                <div className="form-group">
                  <TextField
                    id="select-assign-user"
                    required
                    label="Assign User"
                    select
                    name="order_user_id"
                    value={bookingUser.order_user_id}
                    onChange={onInputChange}
                    fullWidth
                    className="bg-gray-100 rounded-md"
                  >
                    {assignUserP.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-1">
                <div className="form-group">
                  <TextField
                    id="select-status"
                    required
                    label="Status"
                    select
                    name="order_assign_status"
                    value={bookingUser.order_assign_status}
                    onChange={onInputChange}
                    fullWidth
                    className="bg-gray-100 rounded-md"
                  >
                    {status.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>

              {/* Remarks */}
              <div className="col-span-2">
                <div className="form-group">
                  <TextField
                    id="remarks"
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
            </div>

            {/* Submit Button */}
            <div className="mt-6 text-center bg-blue-400  w-48 rounded-lg  ">
              <button
                className=" p-1 text-center   mb-2 text-white"
                // onClick={onSubmit}
                disabled={isButtonDisabled}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditBookingAssign;
