import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../../layout/Layout";
import BookingFilter from "../../../../components/BookingFilter";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Moment from "moment";
import MUIDataTable from "mui-datatables";
import { ContextPanel } from "../../../../utils/ContextPanel";
import { FaEdit } from "react-icons/fa";
import BASE_URL from "../../../../base/BaseUrl";
import UseEscapeKey from "../../../../utils/UseEscapeKey";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";
const AssignVendor = () => {
  const { id } = useParams();
  const [bookingAssignVendorData, setBookingVendorAssignData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  UseEscapeKey();
  localStorage.setItem("vendorBook", id);
  useEffect(() => {
    const fetchAssignVendorData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-assign-vendor-list/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookingVendorAssignData(response.data?.bookingAssign);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignVendorData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "slNo",
      label: "SL No",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return tableMeta.rowIndex + 1;
        },
      },
    },
    {
      name: "name",
      label: "Full Name",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "order_start_time",
      label: "Start Time",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "order_end_time",
      label: "End Time",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "order_assign_remarks",
      label: "Remarks",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "order_assign_status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
      },
    },

    {
      name: "order_service",
      label: "Service",
      options: {
        filter: false,
        sort: false,
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
                <FaEdit
                  onClick={() => navigate(`/edit-booking-vendor/${id}`)}
                  title="Edit Booking Asssign"
                  className="h-5 w-5 cursor-pointer"
                />
              )}
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
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
        },
      };
    },
  };
  return (
    <Layout>
      <BookingFilter />
      <PageHeader
        title="Booking Vendor List"
        label2={
          userType !== "4" && (
            <ButtonConfigColor
              type="create"
              label="Add Booking Vendor"
              onClick={() => navigate(`/add-booking-vendor/${id}`)}
            />
          )
        }
      />

      <div className="mt-2">
        <MUIDataTable
          data={bookingAssignVendorData ? bookingAssignVendorData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default AssignVendor;
