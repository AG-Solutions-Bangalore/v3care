import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { Button } from "reactstrap";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { baseURL } from "../../api";
import MenuItem from "@material-ui/core/MenuItem";
import useEscapeKey from "../escape/useEscapeKey";

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

const BookingVendorEdit = (props) => {
  let history = useHistory();

  var url = new URL(window.location.href);
  var id = url.searchParams.get("id");

  const [bookingUser, setBookingser] = useState({
    order_user_id: "",
    order_start_time: "",
    order_end_time: "",
    order_assign_remarks: "",
    order_assign_status: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  const onInputChange = (e) => {
    setBookingser({
      ...bookingUser,
      [e.target.name]: e.target.value,
    });
  };

  const [assisgnUserP, setAssignUserP] = useState([]);
  useEffect(() => {
    var isLoggedIn = localStorage.getItem("id");
    if (!isLoggedIn) {
      window.location = "/signin";
    } else {
    }
    axios({
      url: baseURL + "/panel-fetch-booking-assign-vendor-by-id/" + id,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("login")}`,
      },
    }).then((res) => {
      setBookingser(res.data.bookingAssign);
      setAssignUserP(res.data.bookingAssignUser);
    });
  }, []);

  useEscapeKey();

  const onSubmit = (e) => {
    let data = {
      order_user_id: bookingUser.order_user_id,
      order_start_time: bookingUser.order_start_time,
      order_end_time: bookingUser.order_end_time,
      order_assign_remarks: bookingUser.order_assign_remarks,
      order_assign_status: bookingUser.order_assign_status,
    };

    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();
    e.preventDefault();

    if (v) {
      setIsButtonDisabled(true);
      axios({
        url: baseURL + "/panel-update-booking-assign-vendor/" + id,
        method: "PUT",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("login")}`,
        },
      }).then((res) => {
        NotificationManager.success("Data Updated Sucessfully");
        history.push("bookingVendors?id=" + res.data.booking.id);
      });
    }
  };

  const hr = {
    marginTop: "0rem",
  };

  return (
    <div className="textfields-wrapper">
      <PageTitleBar title="Edit Booking Vendor" match={props.match} />
      <RctCollapsibleCard>
        <form id="addIndiv" autoComplete="off">
          <div className="row">
            <div className="col-sm-12 col-md-12 col-xl-3">
              <div className="form-group">
                <TextField
                  id="select-corrpreffer"
                  required
                  label="Assign User"
                  SelectProps={{
                    MenuProps: {},
                  }}
                  select
                  name="order_user_id"
                  value={bookingUser.order_user_id}
                  onChange={(e) => onInputChange(e)}
                  fullWidth
                >
                  {assisgnUserP.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>
            {/* <div className="col-sm-12 col-md-12 col-xl-3">
              <div className="form-group">
                <TextField
                  fullWidth
                  required
                  id="order_start_time"
                  label="Start Time"
                  type="time"
                  autoComplete="Name"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="order_start_time"
                  value={bookingUser.order_start_time}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div> */}
            {/* <div className="col-sm-12 col-md-12 col-xl-3">
              <div className="form-group">
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  autoComplete="Name"
                  name="order_end_time"
                  value={bookingUser.order_end_time}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div> */}
            <div className="col-sm-6 col-md-6 col-xl-3">
              <div className="form-group">
                <TextField
                  id="select-corrpreffer"
                  required
                  select
                  label="Status"
                  SelectProps={{
                    MenuProps: {},
                  }}
                  name="order_assign_status"
                  value={bookingUser.order_assign_status}
                  onChange={(e) => onInputChange(e)}
                  fullWidth
                >
                  {status.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>

            <div className="col-sm-12 col-md-6 col-xl-6">
              <div className="form-group">
                <TextField
                  id="select-corrpreffer"
                  multiline
                  label="Remarks"
                  name="order_assign_remarks"
                  value={bookingUser.order_assign_remarks}
                  onChange={(e) => onInputChange(e)}
                  fullWidth
                />
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-sm-12 col-md-12 col-xl-12">
              <div className="receiptbuttons" style={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  className="mr-10 mb-10"
                  color="primary"
                  onClick={(e) => onSubmit(e)}
                  disabled={isButtonDisabled}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>

          <div className="antifloat"></div>
        </form>
      </RctCollapsibleCard>
    </div>
  );
};
export default BookingVendorEdit;
