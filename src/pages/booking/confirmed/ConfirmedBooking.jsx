import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { CiSquarePlus } from "react-icons/ci";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import Moment from "moment";
import BookingFilter from "../../../components/BookingFilter";
import OrderRefModal from "../../../components/OrderRefModal";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const ConfirmedBooking = () => {
  const [confirmBookData, setConfirmBookData] = useState(null);
  const [assignmentData, setAssignmentData] = useState({});
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  UseEscapeKey();
  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderRef, setSelectedOrderRef] = useState(null);

  const handleOpenModal = (orderRef) => {
    setSelectedOrderRef(orderRef);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderRef(null);
  };
  const fetchAssignmentData = async (orderRef) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-booking-assign-by-view/${orderRef}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignmentData((prev) => ({
        ...prev,
        [orderRef]: response.data?.bookingAssign,
      }));
    } catch (error) {
      console.error("Error fetching assignment data", error);
    }
  };

  useEffect(() => {
    const fetchConfirmData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-confirmed-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setConfirmBookData(response.data?.booking);

        //  here we are fecthing only those element those order no assign is greater than 0
        response.data?.booking.forEach((item) => {
          if (item.order_no_assign > 0) {
            fetchAssignmentData(item.order_ref);
          }
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfirmData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "order_ref",
      label: "Order/Branch",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (order_ref, tableMeta) => {
        
          const branchName = tableMeta.rowData[1];

          return (
            <div className="flex flex-col w-32">
            <span>{order_ref}</span>
            <span>{branchName}</span>
          </div>
          )
          
        },
      },
    },
    {
      name: "branch_name",
      label: "Branch",
      options: {
        filter: true,
        display: "exclude",
        searchable: true,
        sort: true,
      },
    },

    {
      name: "order_customer",
      label: "Customer",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
      },
    },
    {
      name: "order_customer_mobile",
      label: "Mobile",
      options: {
        filter: true,
        display: "exclude",
        searchable: true,
        sort: false,
      },
    },

    {
      name: "customer_mobile",
      label: "Customer/Mobile",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const customeName = tableMeta.rowData[2];
          const mobileNo = tableMeta.rowData[3];
          return (
            <div className=" flex flex-col w-32">
              <span>{customeName}</span>
              <span>{mobileNo}</span>
            </div>
          );
        },
      },
    },

    {
      name: "order_service_date",
      label: "Service Date",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "order_service",
      label: "Service",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
      },
    },
    {
      name: "order_amount",
      label: "Price",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
      },
    },
    {
      name: "service_price_advanced",
      label: "Service/Price/Advanced",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const service = tableMeta.rowData[6];
          const price = tableMeta.rowData[7];
          const advnaced = tableMeta.rowData[9];
          return (
            <div className=" flex flex-col w-40">
              <span>{service}</span>
           <div className="flex flex-row gap-2">
           <span >{price}</span>
           <span >-</span>
           <span>{advnaced}</span>
           </div>
            </div>
          );
        },
      },
    },
    {
      name: "order_advance",
      label: "Advance",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
      },
    },
    {
      name: "order_no_assign",
      label: "Assign",
      options: {
        filter: false,
        sort: true,
        customBodyRender: ( value,tableMeta) => {
          const order_no_assign = tableMeta.rowData[10];
          const order_ref = tableMeta.rowData[0];
   

          return order_no_assign > 0 ? (
            <div className="flex flex-col w-32">
            <button
              className=" w-16 border border-gray-200  rounded-lg shadow-lg bg-green-200 text-black cursor-pointer"
              onClick={() => handleOpenModal(order_ref)}
            >
              {value}
            </button>
            
            </div>
          ) : (
            <div className="flex flex-col w-32">
            <span>{value}</span>
           
          </div>
          );
       
        },
      },

    },
    {
      name: "assignment_details",
      label: "Assign Details",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const orderRef = tableMeta.rowData[0];
          const orderNoAssign = tableMeta.rowData[10];
          const assignments = assignmentData[orderRef];

          if (!orderNoAssign || orderNoAssign <= 0 || !assignments) {
            return "-";
          }

          return (
            <div className="w-48 overflow-x-auto">
              <table className="min-w-full table-auto border-collapse text-sm">
                <tbody className="flex flex-wrap h-[40px] boredr-2 border-black w-48">
                  <tr>
                    <td className="text-xs px-[2px] leading-[12px]">
                      {assignments.map((assignment) => assignment.name.split(' ')[0]).join(', ')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        },
      },
    },

    {
      name: "order_payment_amount",
      label: "Amount",
      options: {
        filter: false,
        display:"exclude",
        searchable:true,
        sort: true,
      },
    },
    {
      name: "order_payment_type",
      label: "Type",
      options: {
        filter: false,
        display:"exclude",
        searchable:true,
        sort: true,
      },
    },
    {
      name: "amount_type",
      label: "Paid Amount/Type",
      options: {
        filter: false,
        sort: false,
        customBodyRender:  (value,tableMeta) => {
          const service = tableMeta.rowData[12]
          const price = tableMeta.rowData[13]
          return (
            <div className=" flex flex-col w-32">
             <span>{service}</span>
             <span>{price}</span>
            </div>
          );
        },
      },
    },
    {
      name: "updated_by",
      label: "Confirm By",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
      },
    },
    {
      name: "order_status",
      label: "Status",
      options: {
        filter: true,
        display: "exclude",
        searchable: true,
        sort: false,
      },
    },
    {
      name: "confirm/status",
      label: "Confirm By/Status",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const confirmBy = tableMeta.rowData[15];
          const status = tableMeta.rowData[16];
          return (
            <div className=" flex flex-col ">
              <span>{confirmBy}</span>
              <span>{status}</span>
            </div>
          );
        },
      },
    },
   
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <CiSquarePlus
                  onClick={() => navigate(`/edit-booking/${id}`)}
                  title="edit booking"
                  className="h-5 w-5 cursor-pointer"
                />
              )}
              <MdOutlineRemoveRedEye
                onClick={() => navigate(`/view-booking/${id}`)}
                title="Booking Info"
                className="h-5 w-5 cursor-pointer"
              />
            </div>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    // rowsPerPage: 5,
    // rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    setRowProps: (rowData) => {
      const orderStatus = rowData[16];
      let backgroundColor = "";
      if (orderStatus === "Confirmed") {
        backgroundColor = "#d4edda"; // light green
      } else if (orderStatus === "Completed") {
        backgroundColor = "#fff3cd"; // light yellow
      } else if (orderStatus === "Inspection") {
        backgroundColor = "#e2e3e5"; // light gray
      } else if (orderStatus === "Pending") {
        backgroundColor = "#f8d7da"; // light red
      } else if (orderStatus === "Cancel") {
        backgroundColor = "#ADD8E6"; // light  blue
      } else if (orderStatus === "On the way") {
        backgroundColor = "#b68dee"; // light  purple
      } else if (orderStatus === "In Progress") {
        backgroundColor = "#f7f588"; // light  yellow
      }

      return {
        style: {
          backgroundColor: backgroundColor,
          borderBottom: "5px solid #f1f7f9",
        },
      };
    },
  };
  return (
    <Layout>
      <BookingFilter />

      <div className="mt-5">
        <MUIDataTable
          title={"Confirmed Booking List"}
          data={confirmBookData ? confirmBookData : []}
          columns={columns}
          options={options}
        />
      </div>
     <OrderRefModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        orderRef={selectedOrderRef}

      /> 
    </Layout>
  );
};

export default ConfirmedBooking;
