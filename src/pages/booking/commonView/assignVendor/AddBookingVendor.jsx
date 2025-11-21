import React, { useEffect, useState } from "react";
import Layout from "../../../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../../base/BaseUrl";
import axios from "axios";
import BookingFilter from "../../../../components/BookingFilter";
import UseEscapeKey from "../../../../utils/UseEscapeKey";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";
import Select from "react-select";
import { Autocomplete, Checkbox, TextField } from "@mui/material";

// const customStyles = {
//   control: (provided) => ({
//     ...provided,
//     minHeight: "40px",
//     borderRadius: "0.375rem",
//     borderColor: "#e5e7eb",
//     "&:hover": {
//       borderColor: "#9ca3af",
//     },
//   }),
//   valueContainer: (provided) => ({
//     ...provided,
//     padding: "4px 8px",
//   }),
//   indicatorsContainer: (provided) => ({
//     ...provided,
//     height: "40px",
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected ? "#3b82f6" : "white",
//     color: state.isSelected ? "white" : "#1f2937",
//     "&:hover": {
//       backgroundColor: "#e5e7eb",
//     },
//   }),
// };

const AddBookingVendor = () => {
  const { id } = useParams();

  const [bookingUser, setBookingser] = useState({
    order_user_data: [],
    order_start_time: "",
    order_end_time: "",
    order_assign_remarks: "",
    order_id: id,
  });
  console.log(bookingUser, "bookingUser");
  const navigate = useNavigate();
  UseEscapeKey();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignUserP, setAssignUserP] = useState([]);

  useEffect(() => {
    const theLoginToken = localStorage.getItem("token");
    fetch(`${BASE_URL}/api/panel-fetch-booking-assign-vendor/${id}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + theLoginToken },
    })
      .then((response) => response.json())
      .then((data) => setAssignUserP(data.vendor || []));
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

    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required");
      setLoading(false);
      return;
    }
    if (bookingUser.order_user_data.length === 0) {
      toast.error("Please select at least one vendor");
      setIsButtonDisabled(false);
      setLoading(false);
      return;
    }
    setIsButtonDisabled(true);

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
          response.data?.msg || "Booking Vendor Created Successfully"
        );
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
            {/* Vendor Select */}
            <div className="form-group">
              {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Vendor <span className="text-red-700">*</span>
              </label> */}
              {/* <Select
                options={vendorOptions}
                value={vendorOptions.find(
                  (opt) => opt.value === bookingUser.order_user_id
                )}
                onChange={(selected) =>
                  setBookingser((prev) => ({
                    ...prev,
                    order_user_id: selected ? selected.value : "",
                  }))
                }
                styles={customStyles}
                placeholder="Select Vendor..."
                isClearable
                required
              /> */}
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
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: "6px", 
                        fontSize: 13,
                      },
                      "& .MuiChip-root": {
                        height: 22, 
                        fontSize: 12,
                      },
                    }}
                    label={
                      <label
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          fontFamily: "sans-serif",
                        }}
                      >
                        Select Vendor <span style={{ color: "red" }}>*</span>
                      </label>
                    }
                    placeholder="Select Vendor..."
                  />
                )}
              />
            </div>

            {/* Remark Field */}
            <div className="form-group">
              <Input
                label="Remark"
                name="order_assign_remarks"
                value={bookingUser.order_assign_remarks}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none transition-all duration-300 shadow-sm"
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
