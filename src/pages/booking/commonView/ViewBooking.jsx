import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../layout/Layout";

import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { FaClipboardList, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../base/BaseUrl";
import BookingFilter from "../../../components/BookingFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";

import { Dialog, DialogActions, DialogContent } from "@mui/material";
import MUIDataTable from "mui-datatables";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import PageHeader from "../../../components/common/PageHeader/PageHeader";
import GroupBookingView from "./GroupBookingView";
const ViewBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState({});
  UseEscapeKey();
  const { userType } = useContext(ContextPanel);
  const [open, setOpen] = useState(false);
  const [bookingAssign, setBookingAssign] = useState({});
  const [vendor, setVendor] = useState({});
  const [groupbooking, setGroupBooking] = useState({});
  const [activeTab, setActiveTab] = useState("bookingDetails");
  const [followup, setFollowUp] = useState([]);
  const [followups, setFollowUps] = useState({
    order_followup_date: moment().format("YYYY-MM-DD"),
    order_followup_description: "",
  });
  const [loading, setLoading] = useState(false);

  const onInputChange1 = (e) => {
    const { name, value } = e.target;
    setFollowUps((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const fetchBookingData = async () => {
    try {
      setLoading(true);

      const response = await axios({
        url: `${BASE_URL}/api/panel-fetch-booking-view-by-id/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooking(response.data?.booking);
      setBookingAssign(response.data.bookingAssign);
      setVendor(response.data.vendor);
      setFollowUp(response.data?.bookingFollowup);
      setGroupBooking(response.data?.groupbooking);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [id]);

  const notifyUpdate = async (e) => {
    e.preventDefault();
    let vendor_service =
      booking.order_custom_price <= "1"
        ? booking.order_service
        : booking.order_custom;
    let order_ref = booking.order_ref;
    let area = booking.order_area;

    let data = {
      vendor_service: vendor_service,
      area: area,
      order_ref: order_ref,
    };
    const res = await axios.post(
      `${BASE_URL}/api/panel-create-booking-vendor-notification`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (res.data.code == "200") {
      toast.success(res.data?.msg || "Notification Sent Successfully");
    } else {
      toast.error(res.data?.msg || "Network Error");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      name: "order_followup_date",
      label: " Date ",
      options: {
        filter: false,
        sort: false,

        customBodyRender: (value) => {
          return moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "order_followup_description",
      label: " Comment ",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: false,
    download: false,
    print: false,
    search: false,
    filter: false,
    setRowProps: () => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
        },
      };
    },
    customToolbar: () => {
      return (
        <>
          <>
            <ButtonConfigColor
              type="create"
              label="Follow Up"
              onClick={handleClickOpen}
            />
          </>
        </>
      );
    },
  };
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "bookingDetails":
      case "customerInfo":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>ID:</strong> {booking.order_ref} ({booking.order_status}
                )
              </Typography>
              <Typography className="text-black">
                <strong>Name:</strong> {booking.order_customer}
              </Typography>
              <Typography className="text-black">
                <strong>Mobile:</strong> {booking.order_customer_mobile}
              </Typography>
              <Typography className="text-black">
                <strong>Email:</strong> {booking.order_customer_email}
              </Typography>
              <Typography className="text-black">
                <strong>Booking Created By:</strong> {booking.created_by}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Date:</strong>{" "}
                {moment(booking.order_date).format("DD-MM-YYYY")}
              </Typography>
              <Typography className="text-black">
                <strong>Service Date:</strong>{" "}
                {moment(booking.order_service_date).format("DD-MM-YYYY")}
              </Typography>
              <Typography className="text-black">
                <strong>Slot Time:</strong> {booking.order_time}
              </Typography>
              <Typography className="text-black">
                <strong>Service:</strong> {booking.order_service}
              </Typography>
              <Typography className="text-black">
                <strong>Booking Confirmed By:</strong> {booking.updated_by}
              </Typography>
            </div>
            <div className="space-y-2">
              {booking.order_service == "Custom" && (
                <Typography className="text-black">
                  <strong>Custom:</strong> {booking.order_custom}
                </Typography>
              )}
              {booking.order_service !== "Custom" && (
                <Typography className="text-black">
                  <strong>Sub Service:</strong> {booking.order_service_sub}
                </Typography>
              )}

              <Typography className="text-black">
                <strong>Booking Amount:</strong> {booking?.order_amount}
              </Typography>
              <Typography className="text-black">
                <strong>Paid Amount:</strong> {booking?.order_payment_amount}
              </Typography>
              <Typography className="text-black">
                <strong>Type:</strong> {booking.order_payment_type}
              </Typography>
              <Typography className="text-black">
                <strong>Transaction Details:</strong>{" "}
                {booking.order_transaction_details}
              </Typography>
              {/* add condition  */}
              {booking.order_vendor_id !== null && (
                <Typography className="text-black">
                  <strong>Vendor:</strong> {vendor.vendor_company}
                </Typography>
              )}
            </div>
          </div>
        );
      case "additionalInfo":
      case "location":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Remarks:</strong> {booking.order_remarks}
              </Typography>
              <Typography className="text-black">
                <strong>Comment:</strong> {booking.order_comment}
              </Typography>
              <Typography className="text-black">
                <strong>Postpone Reason:</strong>{" "}
                {booking.order_postpone_reason}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Area:</strong> {booking.order_area}
              </Typography>
              <Typography className="text-black">
                <strong>Branch:</strong> {booking.branch_name}
              </Typography>
              <Typography className="text-black">
                <strong>Address:</strong> {booking.order_flat},{" "}
                {booking.order_building}, {booking.order_landmark},{" "}
                {booking.order_address}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Booked Price:</strong> {booking.order_service_price_for}{" "}
                -{" "}
                {booking.order_custom_price <= "1"
                  ? booking.order_service_price
                  : booking.order_custom_price}
              </Typography>
              <Typography className="text-black">
                <strong>Current Price:</strong>{" "}
                {booking.order_service_price_for} - {booking.order_amount}
              </Typography>
              <Typography className="text-black">
                <strong>Advanced:</strong> {booking.order_advance}
              </Typography>
              <Typography className="text-black">
                <strong>Distance:</strong> {booking.order_km} Km
              </Typography>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const onSubmitFollowup = (e) => {
    e.preventDefault();
    if (!followups.order_followup_description.trim()) {
      toast.error("Order Follow-up Description is required");
      return;
    }
    const data = {
      order_ref: booking?.order_ref,
      order_followup_date: followups.order_followup_date,
      order_followup_description: followups.order_followup_description,
    };
    axios
      .post(`${BASE_URL}/api/panel-create-booking-followup`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.code == "200") {
          toast.success(res.data?.msg || "Followup Created Successfully");
          handleClose();
          fetchBookingData();

          setFollowUps({
            order_followup_description: "",
            order_followup_date: moment().format("YYYY-MM-DD"),
          });
        } else {
          toast.error(res.data?.msg || "Network Error");
        }
      })
      .catch((err) => {
        console.error("Error updating Followup", err);
        toast.error("Error updating Followup");
      });
  };
  return (
    <Layout>
      <BookingFilter />
      <PageHeader
        title={
          <>
            Booking for{" "}
            <span className="text-[#F44336]">{booking?.order_service}</span>
          </>
        }
        label2={
          <span className="space-x-2">
            {!(
              booking.order_status === "Pending" ||
              booking.order_status === "Completed" ||
              booking.order_status === "Cancel" ||
              booking.order_status === "Vendor"
            ) && (
              <ButtonConfigColor
                type="create"
                label="Add Assign V3"
                onClick={() => navigate(`/booking-assign/${id}`)}
              />
            )}
            {(booking.order_status === "Confirmed" ||
              booking.order_status === "Vendor") && (
              <ButtonConfigColor
                type="create"
                label="Assign Vendor"
                onClick={() => navigate(`/assign-vendor/${id}`)}
              />
            )}
            {booking.order_status === "Confirmed" && userType !== "4" && (
              <ButtonConfigColor
                type="create"
                label="Notify All"
                onClick={notifyUpdate}
              />
            )}
          </span>
        }
      />
      {loading ? (
        <LoaderComponent />
      ) : (
        <>
          <div className="container mx-auto mt-2">
            <div className="flex gap-4">
              <div className="flex-grow">
                <div className="mb-2">
                  <div className="flex justify-start space-x-4 ">
                    <button
                      onClick={() => setActiveTab("bookingDetails")}
                      className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
                        activeTab === "bookingDetails"
                          ? "border-green-500 bg-green-100 text-green-600"
                          : "border-transparent hover:bg-green-50"
                      }`}
                    >
                      <FaClipboardList />
                      Booking Overview
                    </button>

                    <button
                      onClick={() => setActiveTab("additionalInfo")}
                      className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
                        activeTab === "additionalInfo"
                          ? "border-red-500 bg-red-100 text-red-600"
                          : "border-transparent hover:bg-red-50"
                      }`}
                    >
                      <FaInfoCircle />
                      Other Details
                    </button>
                    <button
                      onClick={() => setActiveTab("groupBookingInfo")}
                      className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
                        activeTab === "groupBookingInfo"
                          ? "border-blue-500 bg-blue-100 text-blue-600"
                          : "border-transparent hover:bg-blue-50"
                      }`}
                    >
                      <FaClipboardList />
                      Group Booking
                    </button>
                  </div>
                </div>
                {activeTab == "bookingDetails" ||
                activeTab == "additionalInfo" ? (
                  <>
                    <Card className="my-2 ">
                      <CardBody>{renderActiveTabContent()}</CardBody>
                    </Card>
                    <div>
                      <Card className="mb-6">
                        <CardHeader floated={false} className="h-12 p-4">
                          <Typography variant="h6" color="blue-gray">
                            Booking Assign
                          </Typography>
                        </CardHeader>
                        <CardBody>
                          {bookingAssign.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full table-auto border-collapse ">
                                <thead>
                                  <tr className="bg-gray-200 text-left ">
                                    <th className="p-3 border border-gray-700">
                                      <span className="text-gray-700">
                                        Full Name
                                      </span>
                                    </th>
                                    <th className="p-3 border border-gray-700">
                                      <span className="text-gray-700">
                                        Start Time
                                      </span>
                                    </th>
                                    <th className="p-3 border border-gray-700">
                                      <span className="text-gray-700">
                                        On the Way Time
                                      </span>
                                    </th>
                                    <th className="p-3 border border-gray-700">
                                      <span className="text-gray-700">
                                        End Time
                                      </span>
                                    </th>
                                    <th className="p-3 border border-gray-700">
                                      <span className="text-gray-700">
                                        Remarks
                                      </span>
                                    </th>
                                    <th className="p-3 border border-gray-700">
                                      <span className="text-gray-700">
                                        Status
                                      </span>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {bookingAssign.map((dataSumm, key) => (
                                    <tr
                                      key={key}
                                      className="bg-white border-b hover:bg-gray-50"
                                    >
                                      <td className="p-3 border border-gray-700">
                                        <span className="text-gray-900">
                                          {dataSumm.name}
                                        </span>
                                      </td>
                                      <td className="p-3 border border-gray-700">
                                        <span className="text-gray-900">
                                          {dataSumm.order_start_time}
                                        </span>
                                      </td>
                                      <td className="p-3 border border-gray-700">
                                        <span className="text-gray-900">
                                          {dataSumm.order_way_time}
                                        </span>
                                      </td>
                                      <td className="p-3 border border-gray-700">
                                        <span className="text-gray-900">
                                          {dataSumm.order_end_time}
                                        </span>
                                      </td>
                                      <td className="p-3 border border-gray-700">
                                        <span className="text-gray-900">
                                          {dataSumm.order_assign_remarks}
                                        </span>
                                      </td>
                                      <td className="p-3 border border-gray-700">
                                        <span
                                          className={`${
                                            dataSumm.order_assign_status ===
                                            "Completed"
                                              ? "text-green-500"
                                              : "text-red-500"
                                          }`}
                                        >
                                          {dataSumm.order_assign_status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <h1 className="text-gray-700 text-lg">
                                No Data Available
                              </h1>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                      <Card className="mb-6">
                        <CardBody>
                          <MUIDataTable
                            title={"Followup"}
                            data={followup ? followup : []}
                            columns={columns}
                            options={options}
                          />
                        </CardBody>
                      </Card>
                    </div>
                  </>
                ) : (
                  <div className="w-full overflow-x-auto px-2"></div>
                )}
              </div>
            </div>
          </div>
          {activeTab == "groupBookingInfo" && (
            <div className="w-full overflow-x-auto px-2">
              <GroupBookingView
                groupbooking={groupbooking}
                setActiveTab={setActiveTab}
              />
            </div>
          )}
        </>
      )}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogContent>
          <div className="mb-5">
            <h1 className="font-bold text-xl"> Create Follow Up</h1>
          </div>
          <div className="space-y-4">
            <div>
              <Input
                fullWidth
                label="Order Follow up Date"
                name="order_followup_date"
                value={followups.order_followup_date}
                onChange={onInputChange1}
                type="date"
                disabled
                labelProps={{
                  className: "!text-gray-900",
                }}
                required
              />
            </div>
            <div>
              <Textarea
                type="text"
                fullWidth
                label="Order Follow up"
                name="order_followup_description"
                value={followups.order_followup_description}
                onChange={onInputChange1}
                required
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          {/* <button
            onClick={handleClose}
            className="btn btn-primary text-center md:text-right text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md"
          >
            Cancel
          </button>
          <button
            className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
            type="sumbit"
            onClick={(e) => onSubmitFollowup(e)}
          >
            Submit
          </button> */}

          <div className="flex justify-center space-x-4 my-2">
            <ButtonConfigColor
              type="back"
              buttontype="button"
              label="Cancel"
              onClick={handleClose}
            />
            <ButtonConfigColor
              type="submit"
              buttontype="submit"
              label="Submit"
              onClick={(e) => onSubmitFollowup(e)}
            />
          </div>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ViewBooking;
