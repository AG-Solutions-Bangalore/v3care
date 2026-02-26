import axios from "axios";
import { ClipboardList } from "lucide-react";
import Moment from "moment";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import BookingFilter from "../../../components/BookingFilter";
import CommentPopover from "../../../components/common/CommentPopover";
import FollowupModal from "../../../components/common/FollowupModal";
import LoaderComponent from "../../../components/common/LoaderComponent";
import Layout from "../../../layout/Layout";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import AssignDetailsModal from "../../../components/AssignDetailsModal";

const CompletedBooking = () => {
  const [CompletedBookData, setCompletedBookData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const searchParams = new URLSearchParams(location.search);
  const [openFollowModal, setOpenFollowModal] = useState(false);
  const [followupdata, setFollowUpData] = useState("");
  const pageParam = searchParams.get("page");
  const [selectedAssignDetails, setSelectedAssignDetails] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    if (pageParam) {
      setPage(parseInt(pageParam) - 1);
    } else {
      const storedPageNo = localStorage.getItem("page-no");
      if (storedPageNo) {
        setPage(parseInt(storedPageNo) - 1);
        navigate(`/completed?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
  useEffect(() => {
    const fetchCompletedData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-completed-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setCompletedBookData(response.data?.booking);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedData();
  }, []);
  const handleView = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/view-booking/${id}`);
  };
  const handleFollowModal = (e, orderfollowup) => {
    e.preventDefault();
    e.stopPropagation();
    setFollowUpData(orderfollowup);
    setOpenFollowModal(true);
  };
  // const columns = [
  //   {
  //     name: "id",
  //     label: "Action",
  //     options: {
  //       filter: false,
  //       sort: false,
  //       customBodyRender: (id, tableMeta) => {
  //         const orderfollowup = tableMeta.rowData[24];
  //         const noFollowup = !orderfollowup || orderfollowup.length === 0;

  //         const booking = {
  //           order_remarks: tableMeta.rowData[21],
  //           order_comment: tableMeta.rowData[22],
  //           order_postpone_reason: tableMeta.rowData[23],
  //         };
  //         return (
  //           <div className="flex items-center space-x-2">
  //             <ClipboardList
  //               title="Follow Up"
  //               onClick={(e) => handleFollowModal(e, orderfollowup)}
  //               className={`h-6 w-6 cursor-pointer hover:text-blue-900 ${
  //                 noFollowup ? "text-red-600" : "text-gray-700"
  //               }`}
  //             />
  //             <CommentPopover booking={booking} />
  //           </div>
  //         );
  //       },
  //     },
  //   },
  //   //1
  //   {
  //     name: "booking_service_date",
  //     label: "Booking/Service",
  //     options: {
  //       filter: false,
  //       sort: false,
  //       customBodyRender: (value, tableMeta) => {
  //         const bookingDate = tableMeta.rowData[7];
  //         const serviceDate = tableMeta.rowData[8];
  //         return (
  //           <div className=" flex flex-col justify-center">
  //             <span>{Moment(bookingDate).format("DD-MM-YYYY")}</span>
  //             <span>{Moment(serviceDate).format("DD-MM-YYYY")}</span>
  //           </div>
  //         );
  //       },
  //     },
  //   },
  //   //2
  //   {
  //     name: "order_ref",
  //     label: "Order/Branch/BookTime",
  //     options: {
  //       filter: false,
  //       sort: false,
  //       customBodyRender: (order_ref, tableMeta) => {
  //         const branchName = tableMeta.rowData[3];
  //         const bookTime = tableMeta.rowData[24];
  //         return (
  //           <div className="flex flex-col w-32">
  //             <span>{order_ref}</span>
  //             <span>{branchName}</span>
  //             <span>{bookTime}</span>
  //           </div>
  //         );
  //       },
  //     },
  //   },
  //   //3
  //   {
  //     name: "branch_name",
  //     label: "Branch",
  //     options: {
  //       filter: true,
  //       display: "exclude",
  //       searchable: true,
  //       viewColumns: false,
  //       sort: true,
  //     },
  //   },
  //   //4
  //   {
  //     name: "order_customer",
  //     label: "Customer",
  //     options: {
  //       filter: false,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //5
  //   {
  //     name: "order_customer_mobile",
  //     label: "Mobile",
  //     options: {
  //       filter: true,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //6
  //   {
  //     name: "customer_mobile",
  //     label: "Customer/Mobile",
  //     options: {
  //       filter: false,
  //       sort: false,
  //       customBodyRender: (value, tableMeta) => {
  //         const customeName = tableMeta.rowData[4];
  //         const mobileNo = tableMeta.rowData[5];
  //         return (
  //           <div className=" flex flex-col w-32">
  //             <span>{customeName}</span>
  //             <span>{mobileNo}</span>
  //           </div>
  //         );
  //       },
  //     },
  //   },
  //   //7
  //   {
  //     name: "order_date",
  //     label: "Booking Date",
  //     options: {
  //       filter: true,
  //       sort: false,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       customBodyRender: (value) => {
  //         return Moment(value).format("DD-MM-YYYY");
  //       },
  //     },
  //   },
  //   //8
  //   {
  //     name: "order_service_date",
  //     label: "Service Date",
  //     options: {
  //       filter: true,
  //       sort: false,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       customBodyRender: (value) => {
  //         return Moment(value).format("DD-MM-YYYY");
  //       },
  //     },
  //   },

  //   //9
  //   {
  //     name: "order_service",
  //     label: "Service",
  //     options: {
  //       filter: false,
  //       viewColumns: false,
  //       display: "exclude",
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //10
  //   {
  //     name: "order_amount",
  //     label: "Price",
  //     options: {
  //       filter: false,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //11
  //   {
  //     name: "order_custom",
  //     label: "Custom",
  //     options: {
  //       filter: false,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //12
  // {
  //     name: "order_time",
  //     label: "Time/Area",
  //     options: {
  //       filter: false,
  //       sort: false,
  //       customBodyRender: (value, tableMeta) => {
  //         const locality = tableMeta.rowData[32];
  //         const subLocality = tableMeta.rowData[33];

  //         let areaDisplay = "";
  //         if (locality && subLocality) {
  //           areaDisplay = `${locality} - ${subLocality}`;
  //         } else if (locality) {
  //           areaDisplay = locality;
  //         } else if (subLocality) {
  //           areaDisplay = subLocality;
  //         } else {
  //           areaDisplay = "N/A";
  //         }

  //         return (
  //           <div className="flex flex-col w-32">
  //             <span>{value}</span>
  //             <span style={{ fontSize: "12px" }}>{areaDisplay}</span>
  //           </div>
  //         );
  //       },
  //     },
  //   },
  //   //13
  //   {
  //     name: "service_price",
  //     label: "Service/Price/Advanced",
  //     options: {
  //       filter: false,
  //       sort: false,
  //       customBodyRender: (value, tableMeta) => {
  //         const service = tableMeta.rowData[9];
  //         const price = tableMeta.rowData[10];
  //         const advnaced = tableMeta.rowData[31];
  //         const customeDetails = tableMeta.rowData[11];
  //         if (service == "Custom") {
  //           return (
  //             <div className="flex flex-col w-32">
  //               <span>{customeDetails}</span>
  //               <div className="flex flex-row gap-2">
  //                 <span>{price}</span>
  //                 <span>-</span>
  //                 <span>{advnaced}</span>
  //               </div>
  //             </div>
  //           );
  //         }
  //         return (
  //           <div className=" flex flex-col w-32">
  //             <span>{service}</span>
  //             <div className="flex flex-row gap-2">
  //               <span>{price}</span>
  //               <span>-</span>
  //               <span>{advnaced}</span>
  //             </div>
  //           </div>
  //         );
  //       },
  //     },
  //   },

  //   //14
  //   {
  //     name: "order_assign",
  //     label: "Order Assign",
  //     options: {
  //       filter: false,
  //       sort: false,
  //       display: "exclude",
  //       viewColumns: false,
  //     },
  //   },
  //      //15
  //      {
  //       name: "amount_type",
  //       label: "Paid Amount/Type",
  //       options: {
  //         filter: false,
  //         sort: false,
  //         customBodyRender: (value, tableMeta) => {
  //           const type = tableMeta.rowData[20];
  //           const paid_amount = tableMeta.rowData[19];
  //           return (
  //             <div className=" flex flex-col w-32">
  //               <span>{paid_amount}</span>
  //               <span>{type}</span>
  //             </div>
  //           );
  //         },
  //       },
  //     },
  //     //16
  //   {
  //     name: "confirm/status/inspection status",
  //     label: "Confirm By/Status/Inspection Status",
  //     options: {
  //       filter: false,
  //       sort: false,
  //       setCellProps: () => ({
  //         style: {
  //           minWidth: "150px", // minimum width
  //           maxWidth: "200px", // optional maximum
  //           width: "180px", // fixed width
  //         },
  //       }),
  //       customBodyRender: (value, tableMeta) => {
  //         const confirmBy = tableMeta.rowData[21];
  //         const status = tableMeta.rowData[22];
  //         const inspectionstatus = tableMeta.rowData[25];
  //         return (
  //           <div className=" flex flex-col ">
  //             <span>{confirmBy}</span>
  //             <span>{status}</span>
  //             <td className="flex  items-center">
  //               {status === "Inspection" && (
  //                 <span className="px-2 py-1 text-sm font-medium rounded-full bg-blue-100 text-green-800">
  //                   {inspectionstatus}
  //                 </span>
  //               )}
  //             </td>
  //           </div>
  //         );
  //       },
  //     },
  //   },
  //   //17
  //   {
  //     name: "order_no_assign",
  //     label: "No of Assign",
  //     options: {
  //       filter: false,
  //       sort: false,
  //       customBodyRender: (value, tableMeta) => {
  //         const orderAssign = tableMeta?.rowData[14] || [];

  //         const activeAssignments = orderAssign.filter(
  //           (assign) => assign.order_assign_status !== "Cancel"
  //         );
  //         const count = activeAssignments.length;

  //         if (count > 0) {
  //           return (
  //             <button
  //               className="w-16 hover:bg-red-200 border border-gray-200 rounded-lg shadow-lg bg-green-200 text-black cursor-pointer"
  //               onClick={(e) => {
  //                 e.stopPropagation();
  //                 setSelectedAssignDetails(activeAssignments);
  //                 setOpenModal(true);
  //               }}
  //             >
  //               {count}
  //             </button>
  //           );
  //         }
  //         return <span>{count}</span>;
  //       },
  //     },
  //   },
  //   //18
  //   {
  //     name: "assignment_details",
  //     label: "Assign Details",
  //     options: {
  //       filter: false,
  //       sort: false,
  //       customBodyRender: (value, tableMeta) => {
  //         const orderAssign = tableMeta?.rowData[14];

  //         if (!Array.isArray(orderAssign) || orderAssign.length === 0) {
  //           return <span>-</span>;
  //         }

  //         const activeAssignments = orderAssign.filter(
  //           (assign) => assign?.order_assign_status !== "Cancel"
  //         );

  //         if (activeAssignments.length === 0) return <span>-</span>;

  //         return (
  //           <div className="w-48 overflow-x-auto">
  //             <table className="min-w-full table-auto border-collapse text-sm">
  //               <tbody className="flex flex-wrap h-[40px] w-48">
  //                 <tr>
  //                   <td className="text-xs px-[2px] leading-[12px]">
  //                     {activeAssignments
  //                       .map((assign) => assign?.user?.name)
  //                       .join(", ")}
  //                   </td>
  //                 </tr>
  //               </tbody>
  //             </table>
  //           </div>
  //         );
  //       },
  //     },
  //   },
  //   //19
  //   {
  //     name: "order_payment_amount",
  //     label: "Amount",
  //     options: {
  //       filter: false,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: true,
  //     },
  //   },
  //   //20
  //   {
  //     name: "order_payment_type",
  //     label: "Type",
  //     options: {
  //       filter: false,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: true,
  //     },
  //   },

  //   //21
  //   {
  //     name: "updated_by",
  //     label: "Confirm By",
  //     options: {
  //       filter: false,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //22
  //   {
  //     name: "order_status",
  //     label: "Status",
  //     options: {
  //       filter: true,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },

  //   //23
  //   {
  //     name: "order_address",
  //     label: "Address",
  //     options: {
  //       filter: true,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //24
  //   {
  //     name: "order_booking_time",
  //     label: "Book Time",
  //     options: {
  //       filter: true,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //25
  //   {
  //     name: "order_inspection_status",
  //     label: "Inspection Status",
  //     options: {
  //       filter: true,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //26
  //   {
  //     name: "order_remarks",
  //     label: "Remarks",
  //     options: {
  //       filter: true,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //27
  //   {
  //     name: "order_comment",
  //     label: "Comment",
  //     options: {
  //       filter: true,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //28
  //   {
  //     name: "order_postpone_reason",
  //     label: "Reason",
  //     options: {
  //       filter: true,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   {
  //     name: "order_followup",
  //     label: "Followup",
  //     options: {
  //       filter: true,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //30
  //   {
  //     name: "order_area",
  //     label: "Order Area",
  //     options: {
  //       filter: true,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //31
  //   {
  //     name: "order_advance",
  //     label: "Advance",
  //     options: {
  //       filter: false,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //     //32 - order_locality
  //   {
  //     name: "order_locality",
  //     label: "Locality",
  //     options: {
  //       filter: true,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },
  //   //33 - order_sub_locality
  //   {
  //     name: "order_sub_locality",
  //     label: "Sub Locality",
  //     options: {
  //       filter: true,
  //       display: "exclude",
  //       viewColumns: false,
  //       searchable: true,
  //       sort: false,
  //     },
  //   },

  // ];

  const columns = [
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id, tableMeta) => {
          const status = tableMeta.rowData[23];
          const orderfollowup = tableMeta.rowData[31];
          const noFollowup = !orderfollowup || orderfollowup.length === 0;

          const booking = {
            order_remarks: tableMeta.rowData[28],
            order_comment: tableMeta.rowData[29],
            order_postpone_reason: tableMeta.rowData[30],
          };
          return (
            <div className="flex items-center space-x-2">
              <ClipboardList
                title="Follow Up"
                onClick={(e) => handleFollowModal(e, orderfollowup)}
                className={`h-6 w-6 cursor-pointer hover:text-blue-900 ${
                  noFollowup ? "text-red-600" : "text-gray-700"
                }`}
              />
              <CommentPopover booking={booking} />
            </div>
          );
        },
      },
    },
    // ... rest of your columns remain the same
    //1
    {
      name: "booking_service_date",
      label: "Booking/Service",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const bookingDate = tableMeta.rowData[7];
          const serviceDate = tableMeta.rowData[8];
          return (
            <div className=" flex flex-col justify-center">
              <span>{Moment(bookingDate).format("DD-MM-YYYY")}</span>
              <span>{Moment(serviceDate).format("DD-MM-YYYY")}</span>
            </div>
          );
        },
      },
    },
    //2
    {
      name: "order_ref",
      label: "Order/Branch/BookTime",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (order_ref, tableMeta) => {
          const branchName = tableMeta.rowData[4];
          const bookTime = tableMeta.rowData[26];

          return (
            <div className="flex flex-col w-32">
              <span>{order_ref}</span>
              <span>{branchName}</span>
              <span>{bookTime}</span>
              {/* <span>{areaDisplay}</span> */}
            </div>
          );
        },
      },
    },
    //3
    {
      name: "customer_mobile",
      label: "Customer/Mobile",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const customeName = tableMeta.rowData[5];
          const mobileNo = tableMeta.rowData[6];
          return (
            <div className=" flex flex-col w-32">
              <span>{customeName}</span>
              <span>{mobileNo}</span>
            </div>
          );
        },
      },
    },
    // ... rest of columns (same as before)
    //4
    {
      name: "branch_name",
      label: "Branch",
      options: {
        filter: true,
        display: "exclude",
        searchable: true,
        viewColumns: false,
        sort: true,
      },
    },
    //5
    {
      name: "order_customer",
      label: "Customer",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //6
    {
      name: "order_customer_mobile",
      label: "Mobile",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },

    //7
    {
      name: "order_date",
      label: "Booking Date",
      options: {
        filter: true,
        sort: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    //8
    {
      name: "order_service_date",
      label: "Service Date",
      options: {
        filter: true,
        sort: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },

    //9 service name
    {
      name: "order_service",
      label: "Service",
      options: {
        filter: false,
        viewColumns: false,
        display: "exclude",
        searchable: true,
        sort: false,
      },
    },
    //10
    {
      name: "order_amount",
      label: "Price",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //11
    {
      name: "order_custom",
      label: "Custom",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //12
    {
      name: "order_time",
      label: "Time/Km/Area",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const km = tableMeta.rowData[38];
          const locality = tableMeta.rowData[33];
          const subLocality = tableMeta.rowData[34];

          let areaDisplay = "";
          if (locality && subLocality) {
            areaDisplay = `${locality} - ${subLocality}`;
          } else if (locality) {
            areaDisplay = locality;
          } else if (subLocality) {
            areaDisplay = subLocality;
          } else {
            areaDisplay = "N/A";
          }
          return (
            <div className="w-32">
              <div className="text-sm break-words">{value || "N/A"}</div>
              <div className="text-xs text-gray-800 ">Km :{km ? km : 0}</div>
              <div className="text-xs text-gray-500 ">{areaDisplay}</div>
            </div>
          );
        },
      },
    },
    //13

    {
      name: "service_data",
      label: "Service",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const service = tableMeta.rowData[9];
          const customeDetails = tableMeta.rowData[11];
          if (service == "Custom") {
            return (
              <div className="flex flex-col w-32">
                <span>{customeDetails}</span>
              </div>
            );
          }
          return (
            <div className=" flex flex-col w-32">
              <span>{service}</span>
            </div>
          );
        },
      },
    },
    //14
    {
      name: "service_price",
      label: "Total Amount",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const price = tableMeta.rowData[10];

          // const advance_amount = tableMeta.rowData[35];
          // const dis_amount = tableMeta.rowData[36];
          return (
            <div className=" flex flex-col">
              {/* <span>{service}</span> */}
              <span>{price}</span>
              {/* <span>Advance : {advance_amount}</span>
                <span>Discount : {dis_amount}</span> */}
            </div>
          );
        },
      },
    },

    //15
    {
      name: "order_assign",
      label: "Order Assign",
      options: {
        filter: false,
        sort: false,
        display: "exclude",
        viewColumns: false,
      },
    },
    //16
    {
      name: "amount_type",
      label: "Received Amount",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          // const type = tableMeta.rowData[22];
          const paid_amount = tableMeta.rowData[21];
          const price = tableMeta.rowData[10];
          const advance_amount = tableMeta.rowData[36];
          const dis_amount = tableMeta.rowData[37];
          const balance =
            Number(price) -
            Number(advance_amount) -
            Number(dis_amount) -
            Number(paid_amount);
          const receivedamount = Number(paid_amount) + Number(advance_amount);
          return (
            <div className=" flex flex-col w-32">
              <span>{receivedamount ? receivedamount : "0"}</span>
              {/* <span>{type}</span> */}
              {/* <span>Balance : {balance ? balance : "0"}</span> */}
            </div>
          );
        },
      },
    },
    //17
    {
      name: "amount_type",
      label: "Balance Amount",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const paid_amount = tableMeta.rowData[21];
          const price = tableMeta.rowData[10];
          const advance_amount = tableMeta.rowData[36];
          const dis_amount = tableMeta.rowData[37];
          const balance =
            Number(price) -
            Number(advance_amount) -
            Number(dis_amount) -
            Number(paid_amount);
          return (
            <div className=" flex flex-col">
              <span> {balance ? balance : "0"}</span>
            </div>
          );
        },
      },
    },
    //18
    {
      name: "order_no_assign",
      label: "No of Assign",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const orderAssign = tableMeta.rowData[15];

          const activeAssignments = orderAssign.filter(
            (assign) => assign.order_assign_status !== "Cancel",
          );
          const count = activeAssignments.length;

          if (count > 0) {
            return (
              <button
                className="w-16 hover:bg-red-200 border border-gray-200 rounded-lg shadow-lg bg-green-200 text-black cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAssignDetails(activeAssignments);
                  setOpenModal(true);
                }}
              >
                {count}
              </button>
            );
          }
          return <span>{count}</span>;
        },
      },
    },
    //19
    {
      name: "assignment_details",
      label: "Assign Details",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const orderAssign = tableMeta.rowData[15];

          const activeAssignments = orderAssign.filter(
            (assign) => assign.order_assign_status !== "Cancel",
          );

          if (activeAssignments.length === 0) {
            return <span>-</span>;
          }

          return (
            <div className="w-48 overflow-x-auto">
              <table className="min-w-full table-auto border-collapse text-sm">
                <tbody className="flex flex-wrap h-[40px]  w-48">
                  <tr>
                    <td className="text-xs px-[2px] leading-[12px]">
                      {activeAssignments
                        .map((assign) => assign.user.name)
                        .join(", ")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        },
      },
    },
    //20
    {
      name: "confirm/status/inspection status",
      label: "Confirm By/Status/Inspection Status",
      options: {
        filter: false,
        sort: false,
        setCellProps: () => ({
          style: {
            minWidth: "150px",
            maxWidth: "200px",
            width: "180px",
          },
        }),
        customBodyRender: (value, tableMeta) => {
          const confirmBy = tableMeta.rowData[23];
          const status = tableMeta.rowData[24];
          const inspectionstatus = tableMeta.rowData[27];
          return (
            <div className=" flex flex-col ">
              <span>{confirmBy}</span>
              <span>{status}</span>
              <td className="flex  items-center">
                {status === "Inspection" && (
                  <span className="px-2 py-1 text-sm font-medium rounded-full bg-blue-100 text-green-800">
                    {inspectionstatus}
                  </span>
                )}
              </td>
            </div>
          );
        },
      },
    },
    //21
    {
      name: "order_payment_amount",
      label: "Amount",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: true,
      },
    },
    //22
    {
      name: "order_payment_type",
      label: "Type",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: true,
      },
    },

    //23
    {
      name: "updated_by",
      label: "Confirm By",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //24
    {
      name: "order_status",
      label: "Status",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },

    //25
    {
      name: "order_address",
      label: "Address",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //26
    {
      name: "order_booking_time",
      label: "Book Time",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //27
    {
      name: "order_inspection_status",
      label: "Inspection Status",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //28
    {
      name: "order_remarks",
      label: "Remarks",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //29
    {
      name: "order_comment",
      label: "Comment",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //30
    {
      name: "order_postpone_reason",
      label: "Reason",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //31
    {
      name: "order_followup",
      label: "Followup",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //32
    {
      name: "order_area",
      label: "Order Area",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //33
    {
      name: "order_locality",
      label: "Locality",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //34
    {
      name: "order_sub_locality",
      label: "Sub Locality",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //35
    {
      name: "order_sub_locality",
      label: "Sub Locality",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //36
    {
      name: "order_advance",
      label: "Advance",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //37
    {
      name: "order_discount",
      label: "Discount",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
    //38
    {
      name: "order_km",
      label: "Km",
      options: {
        filter: true,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: false,
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,

    count: CompletedBookData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/completed?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta, e) => {
      const id = CompletedBookData[rowMeta.dataIndex].id;
      handleView(e, id)();
    },
    setRowProps: () => {
      return {
        style: {
          borderBottom: "5px solid #f1f7f9",
          cursor: "pointer",
        },
      };
    },
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
      return (
        <div className="flex justify-end items-center p-4">
          <span className="mx-4">
            <span className="text-red-600">Page {page + 1}</span> of{" "}
            {Math.ceil(count / rowsPerPage)}
          </span>
          <IoIosArrowBack
            onClick={page === 0 ? null : () => changePage(page - 1)}
            className={`w-6 h-6 cursor-pointer ${
              page === 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
            }  hover:text-red-600`}
          />
          <IoIosArrowForward
            onClick={
              page >= Math.ceil(count / rowsPerPage) - 1
                ? null
                : () => changePage(page + 1)
            }
            className={`w-6 h-6 cursor-pointer ${
              page >= Math.ceil(count / rowsPerPage) - 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600"
            }  hover:text-red-600`}
          />
        </div>
      );
    },
  };

  return (
    <Layout>
      <BookingFilter />
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title={"Completed Booking List"}
            data={CompletedBookData ? CompletedBookData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
      {openFollowModal && (
        <FollowupModal
          open={openFollowModal}
          handleOpen={setOpenFollowModal}
          followData={followupdata}
        />
      )}
      {openModal && (
        <AssignDetailsModal
          open={openModal}
          handleOpen={setOpenModal}
          assignDetails={selectedAssignDetails}
        />
      )}
    </Layout>
  );
};

export default CompletedBooking;
