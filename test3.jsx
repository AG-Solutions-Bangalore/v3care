import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../../layout/Layout";
import BookingFilter from "../../../../components/BookingFilter";
import { MdUpdate } from "react-icons/md";
import { Button, MenuItem, TextField } from "@mui/material";

const EditBookingAssign = () => {
  const { id } = useParams();
  const [bookingUser, setBookingUser] = useState({
    order_user_id: "",
    order_assign_status: "",
    order_assign_remarks: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const assignUserP = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
  ];

  const status = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const onInputChange = (e) => {
    setBookingUser({
      ...bookingUser,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <Layout>
      <BookingFilter />
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Edit Booking Assign User <span className="text-blue-600">{id}</span>
        </h2>
        <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-lg">
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
            <div className="mt-6 text-center">
              <Button
                type="submit"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-md shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 ease-in-out disabled:opacity-50"
                onClick={onSubmit}
                disabled={isButtonDisabled}
              >
                <MdUpdate />
                <span>Update</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditBookingAssign;
