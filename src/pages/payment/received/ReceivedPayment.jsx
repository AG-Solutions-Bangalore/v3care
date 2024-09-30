import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import PaymentFilter from "../../../components/PaymentFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import MUIDataTable from "mui-datatables";

import Moment from "moment";

const ReceivedPayment = () => {
  const [receivedData, setReceivedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchReceivedData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-payment-received-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReceivedData(response.data?.booking);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReceivedData();
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
      name: "order_customer",
      label: "Customer",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "order_customer_mobile",
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
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "order_service_date",
      label: "Service Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
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
      name: "order_amount",
      label: "Price",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "order_payment_amount",
      label: "Paid Amount",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "order_payment_type",
      label: "Paid Type",
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
            <div
              onClick={() => navigate(`/pending-received-view/${id}`)}
              className="flex items-center space-x-2"
            >
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
      <PaymentFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Payment Received List
        </h3>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={receivedData ? receivedData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default ReceivedPayment;
