import React, { useEffect, useState } from "react";
import Layout from "../../../../layout/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import { MdArrowBack, MdSend } from "react-icons/md";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import BASE_URL from "../../../../base/BaseUrl";
import axios from "axios";
import BookingFilter from "../../../../components/BookingFilter";
import UseEscapeKey from "../../../../utils/UseEscapeKey";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";
const AddBookingVendor = () => {
  const { id } = useParams();

  const [bookingUser, setBookingser] = useState({
    order_user_id: "",
    order_start_time: "",
    order_end_time: "",
    order_assign_remarks: "",
    order_id: id,
  });
  const navigate = useNavigate();
  UseEscapeKey();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // Validation function
  const [loading, setLoading] = useState(false);

  const onInputChange = (e) => {
    setBookingser({
      ...bookingUser,
      [e.target.name]: e.target.value,
    });
  };
  const [assisgnUserP, setAssignUserP] = useState([]);
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(
      BASE_URL + "/api/panel-fetch-booking-assign-vendor/" + id,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => setAssignUserP(data.vendor));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading when submitting

    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required");
      setLoading(false); // Stop loading if validation fails
      return;
    }

    setIsButtonDisabled(true);
    let data = {
      order_user_id: bookingUser.order_user_id,
      order_start_time: bookingUser.order_start_time,
      order_end_time: bookingUser.order_end_time,
      order_assign_remarks: bookingUser.order_assign_remarks,
      order_id: id,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-booking-assign-vendor`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code == "200") {
        toast.success(response.data?.msg || "Booking User Created Successfully");
        navigate(`/assign-vendor/${id}`);
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
    <Layout>
      <BookingFilter />

      <PageHeader title={"Create Booking Vendor"} />

      <div className="w-full mt-2 mx-auto p-8 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {/* Service Field */}
            <div className="form-group">
              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Assign Vendor <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  name="order_user_id"
                  value={bookingUser.order_user_id}
                  onChange={(e) => onInputChange(e)}
                  label="Assign Vendor  *"
                  required
                >
                  {assisgnUserP.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.vendor_company}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Service Commission Field */}
            <div className="form-group">
              <Input
                label="Remark"
                name="order_assign_remarks"
                value={bookingUser.order_assign_remarks}
                onChange={(e) => onInputChange(e)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none  transition-all duration-300 shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <ButtonConfigColor
              type="submit"
              buttontype="submit"
              label="Submit"
              disabled={isButtonDisabled}
              loading={loading}
            />

            <ButtonConfigColor
              type="back"
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

export default AddBookingVendor;
