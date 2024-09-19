import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import CommissionFilter from "../../../components/CommissionFilter";
import MUIDataTable from "mui-datatables";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MdOutlineRemoveRedEye } from "react-icons/md";

const PendingCommission = () => {
  const [PendingCommissionData, setPendingCommissionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPendingComData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-comm-pending-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPendingCommissionData(response.data?.booking);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingComData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "order_ref",
      label: "ID",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "branch_name",
      label: "Branch",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "order_area",
      label: "Area",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "vendor_company",
      label: "Vendor",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "vendor_mobile",
      label: "Mobile",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "order_date",
      label: "Booking Date",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "order_service_date",
      label: "Service Date",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "order_service",
      label: "Service",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "order_comm",
      label: "Commission",
      options: {
        filter: true,
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
              <MdOutlineRemoveRedEye
                title="View pending Info"
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
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
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
      <CommissionFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Commission Pending List
        </h3>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={PendingCommissionData ? PendingCommissionData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default PendingCommission;
