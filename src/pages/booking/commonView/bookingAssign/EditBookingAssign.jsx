// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Layout from "../../../../layout/Layout";
// import BookingFilter from "../../../../components/BookingFilter";
// import { BASE_URL } from "../../../../base/BaseUrl";
// import axios from "axios";
// import { ContextPanel } from "../../../../utils/ContextPanel";
// import { Input } from "@material-tailwind/react";
// import { toast } from "react-toastify";
// import UseEscapeKey from "../../../../utils/UseEscapeKey";
// import PageHeader from "../../../../components/common/PageHeader/PageHeader";
// import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";
// import Select from "react-select";

// const customStyles = {
//   control: (provided) => ({
//     ...provided,
//     minHeight: "38px",
//     height: "auto",
//     borderRadius: "0.375rem",
//     borderColor: "#e5e7eb",
//     paddingTop: "2px",
//     paddingBottom: "2px",
//     "&:hover": {
//       borderColor: "#9ca3af",
//     },
//   }),
//   valueContainer: (provided) => ({
//     ...provided,
//     height: "auto",
//     padding: "4px 8px",
//   }),
//   input: (provided) => ({
//     ...provided,
//     margin: "0px",
//   }),
//   indicatorsContainer: (provided) => ({
//     ...provided,
//     height: "38px",
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

// const EditBookingAssign = () => {
//   const { id } = useParams();

//   const [bookingUser, setBookingUser] = useState({
//     order_user_id: "",
//     order_start_time: "",
//     order_end_time: "",
//     order_assign_remarks: "",
//     order_assign_status: "",
//   });

//   const [isButtonDisabled, setIsButtonDisabled] = useState(false);
//   const [assignUserP, setAssignUserP] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { isPanelUp } = useContext(ContextPanel);
//   const navigate = useNavigate();
//   UseEscapeKey();

//   useEffect(() => {
//     const fetchTodayData = async () => {
//       try {
//         if (!isPanelUp) {
//           navigate("/maintenance");
//           return;
//         }
//         setLoading(true);
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `${BASE_URL}/api/panel-fetch-booking-assign-by-id/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setBookingUser(response.data?.bookingAssign);
//         setAssignUserP(response.data?.bookingAssignUser || []);
//       } catch (error) {
//         console.error("Error fetching booking assign data", error);
//         toast.error("Failed to fetch booking assign data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTodayData();
//   }, [id, isPanelUp, navigate]);

//   const status = [
//     { value: "Pending", label: "Pending" },
//     { value: "Confirmed", label: "Confirmed" },
//     { value: "Finish", label: "Finish" },
//     { value: "Cancel", label: "Cancel" },
//   ];

//   const userOptions = assignUserP.map((user) => ({
//     value: user.id,
//     label: user.name,
//   }));

//   const selectedUser =
//     userOptions.find((opt) => opt.value === bookingUser.order_user_id) || null;

//   const selectedStatus =
//     status.find((opt) => opt.value === bookingUser.order_assign_status) || null;

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     let data = {
//       order_user_id: bookingUser.order_user_id,
//       order_start_time: bookingUser.order_start_time,
//       order_end_time: bookingUser.order_end_time,
//       order_assign_remarks: bookingUser.order_assign_remarks,
//       order_assign_status: bookingUser.order_assign_status,
//     };
//     const assignBook = localStorage.getItem("assignBook");
//     try {
//       const response = await axios.put(
//         `${BASE_URL}/api/panel-update-booking-assign/${id}`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       if (response.data.code == "200") {
//         toast.success(
//           response.data?.msg || "Assign Booking Updated Successfully"
//         );
//         navigate(`/booking-assign/${assignBook}`);
//       } else {
//         toast.error(response.data?.msg || "Update failed");
//       }
//     } catch (error) {
//       console.error("Error updating booking assign:", error);
//       toast.error("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <Layout>
//       <BookingFilter />
//       <PageHeader title={"Edit Booking Assign User"} />

//       <div className="border border-gray-300 bg-white p-6 rounded-lg shadow-lg mt-2">
//         <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//             {/* Assign User */}
//             <div className="col-span-1">
//               {/* <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Assign User <span className="text-red-500">*</span>
//               </label> */}
//               <Select
//                 options={userOptions}
//                 value={selectedUser}
//                 onChange={(option) =>
//                   setBookingUser({
//                     ...bookingUser,
//                     order_user_id: option ? option.value : "",
//                   })
//                 }
//                 styles={customStyles}
//                 placeholder="Select a user..."
//                 isMulti={false}
//                 required
//               />
//             </div>

//             {/* Status */}
//             <div className="col-span-1">
//               {/* <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Status <span className="text-red-500">*</span>
//               </label> */}
//               <Select
//                 options={status}
//                 value={selectedStatus}
//                 onChange={(option) =>
//                   setBookingUser({
//                     ...bookingUser,
//                     order_assign_status: option ? option.value : "",
//                   })
//                 }
//                 styles={customStyles}
//                 placeholder="Select status..."
//                 isMulti={false}
//                 required
//               />
//             </div>

//             {/* Remarks */}
//             <div className="col-span-2">
//               <Input
//                 id="remarks"
//                 label="Remarks"
//                 multiline
//                 name="order_assign_remarks"
//                 value={bookingUser.order_assign_remarks}
//                 onChange={(e) =>
//                   setBookingUser({
//                     ...bookingUser,
//                     [e.target.name]: e.target.value,
//                   })
//                 }
//                 fullWidth
//                 className="bg-gray-100 rounded-md"
//               />
//             </div>
//           </div>

//           <div className="flex justify-center space-x-4 my-2">
//             <ButtonConfigColor
//               type="edit"
//               buttontype="submit"
//               label="Update"
//               disabled={isButtonDisabled}
//               loading={loading}
//             />

//             <ButtonConfigColor
//               type="back"
//               buttontype="button"
//               label="Cancel"
//               onClick={() => navigate(-1)}
//             />
//           </div>
//         </form>
//       </div>
//     </Layout>
//   );
// };

// export default EditBookingAssign;
import { Input } from "@material-tailwind/react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../../base/BaseUrl";
import { ContextPanel } from "../../../../utils/ContextPanel";

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

const EditBookingAssignDialog = ({ open, onClose, onSuccess, bookingId }) => {
  const { isPanelUp } = useContext(ContextPanel);

  const [bookingUser, setBookingUser] = useState({
    order_user_id: "",
    order_start_time: "",
    order_end_time: "",
    order_assign_remarks: "",
    order_assign_status: "",
  });
  const [assignUserP, setAssignUserP] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    const fetchBookingAssign = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-assign-by-id/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookingUser(response.data?.bookingAssign);
        setAssignUserP(response.data?.bookingAssignUser || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch booking assign data");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingAssign();
  }, [bookingId]);

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Finish", label: "Finish" },
    { value: "Cancel", label: "Cancel" },
  ];

  const userOptions = assignUserP.map((user) => ({
    value: user.id,
    label: user.name,
  }));
  const selectedUser =
    userOptions.find((opt) => opt.value === bookingUser.order_user_id) || null;
  const selectedStatus =
    statusOptions.find(
      (opt) => opt.value === bookingUser.order_assign_status
    ) || null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      order_user_id: bookingUser.order_user_id,
      order_start_time: bookingUser.order_start_time,
      order_end_time: bookingUser.order_end_time,
      order_assign_remarks: bookingUser.order_assign_remarks,
      order_assign_status: bookingUser.order_assign_status,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-booking-assign/${bookingId}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.code == "200") {
        toast.success(
          response.data?.msg || "Assign Booking Updated Successfully"
        );
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(response.data?.msg || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Edit Booking Assign User</DialogTitle>
      <DialogContent>
        <form id="editBookingAssign" onSubmit={onSubmit} className="mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Assign User */}
            <div>
              <Select
                options={userOptions}
                value={selectedUser}
                onChange={(option) =>
                  setBookingUser({
                    ...bookingUser,
                    order_user_id: option ? option.value : "",
                  })
                }
                styles={customStyles}
                placeholder="Select a user..."
              />
            </div>

            {/* Status */}
            <div>
              <Select
                options={statusOptions}
                value={selectedStatus}
                onChange={(option) =>
                  setBookingUser({
                    ...bookingUser,
                    order_assign_status: option ? option.value : "",
                  })
                }
                styles={customStyles}
                placeholder="Select status..."
              />
            </div>

            {/* Remarks */}
            <div className="col-span-2">
              <Input
                label="Remarks"
                multiline
                name="order_assign_remarks"
                value={bookingUser.order_assign_remarks}
                onChange={(e) =>
                  setBookingUser({
                    ...bookingUser,
                    [e.target.name]: e.target.value,
                  })
                }
                fullWidth
              />
            </div>
          </div>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={isButtonDisabled || loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBookingAssignDialog;
