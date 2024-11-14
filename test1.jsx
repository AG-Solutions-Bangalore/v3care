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
import UseEscapeKey from "../../../utils/UseEscapeKey";

const ConfirmedBooking = () => {
  const [confirmBookData, setConfirmBookData] = useState(null);
  const [assignmentData, setAssignmentData] = useState({});
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  UseEscapeKey();

  // Fetch assignment data for a specific order reference
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
      setAssignmentData(prev => ({
        ...prev,
        [orderRef]: response.data?.bookingAssign
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
        
        // Fetch assignment data for orders with order_no_assign > 0
        response.data?.booking.forEach(booking => {
          if (booking.order_no_assign > 0) {
            fetchAssignmentData(booking.order_ref);
          }
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfirmData();
  }, []);

  const columns = [
    {
      name: "order_ref",
      label: "Order/Branch",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (order_ref, tableMeta) => {
          const order_no_assign = tableMeta.rowData[10];
          const branchName = tableMeta.rowData[1];
          return (
            <div className="flex flex-col w-32">
              <span>{order_ref}</span>
              <span>{branchName}</span>
            </div>
          );
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
    // ... (other existing columns remain the same)

    // New column for assignment details
    {
      name: "assignment_details",
      label: "Assignment Details",
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
            <div className="max-w-md overflow-x-auto">
              <table className="min-w-full table-auto border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Name</th>
                    <th className="border px-2 py-1">Start</th>
                    <th className="border px-2 py-1">On Way</th>
                    <th className="border px-2 py-1">End</th>
                    <th className="border px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border px-2 py-1">{assignment.name}</td>
                      <td className="border px-2 py-1">{assignment.order_start_time || '-'}</td>
                      <td className="border px-2 py-1">{assignment.order_way_time || '-'}</td>
                      <td className="border px-2 py-1">{assignment.order_end_time || '-'}</td>
                      <td className="border px-2 py-1">{assignment.order_assign_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        },
      },
    },
    // ... (remaining action column stays the same)
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    setRowProps: (rowData) => {
      const orderStatus = rowData[12];
      let backgroundColor = "";
      if (orderStatus === "Confirmed") {
        backgroundColor = "#d4edda";
      } else if (orderStatus === "Completed") {
        backgroundColor = "#fff3cd";
      } else if (orderStatus === "Inspection") {
        backgroundColor = "#e2e3e5";
      } else if (orderStatus === "Pending") {
        backgroundColor = "#f8d7da";
      } else if (orderStatus === "Cancel") {
        backgroundColor = "#ADD8E6";
      } else if (orderStatus === "On the way") {
        backgroundColor = "#b68dee";
      } else if (orderStatus === "In Progress") {
        backgroundColor = "#f7f588";
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
    </Layout>
  );
};

export default ConfirmedBooking;