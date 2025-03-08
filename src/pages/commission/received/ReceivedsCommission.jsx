import React, { useContext, useEffect, useState } from "react";
import CommissionFilter from "../../../components/CommissionFilter";
import Layout from "../../../layout/Layout";
import MUIDataTable from "mui-datatables";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import Moment from "moment";
import UseEscapeKey from "../../../utils/UseEscapeKey";
const ReceivedsCommission = () => {
  const [receivedCommData, setReceivedCommData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  UseEscapeKey();
  useEffect(() => {
    const fetchReceivedComData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-comm-received-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReceivedCommData(response.data?.booking);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReceivedComData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "order_ref",
      label: "ID",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,
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
        viewColumns: false,
      },
    },
    {
      name: "order_branch",
      label: "Order/Branch",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const brancName = tableMeta.rowData[1];
          const orderRef = tableMeta.rowData[0];
          return (
            <div className=" flex flex-col w-32">
              <span>{orderRef}</span>
              <span>{brancName}</span>
            </div>
          );
        },
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
        filter: false,
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,

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
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,

        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "booking_service_date",
      label: "Booking/Service",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const bookingDate = tableMeta.rowData[6];
          const serviceDate = tableMeta.rowData[7];
          return (
            <div className=" flex flex-col justify-center">
              <span>{Moment(bookingDate).format("DD-MM-YYYY")}</span>
              <span>{Moment(serviceDate).format("DD-MM-YYYY")}</span>
            </div>
          );
        },
      },
    },
    {
      name: "order_service",
      label: "Service",
      options: {
        filter: false,
        sort: true,
      },
    },

    {
      name: "order_comm",
      label: "Commission",
      options: {
        filter: false,
        sort: false,
      },
    },

    // {
    //   name: "id",
    //   label: "Action",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     customBodyRender: (id) => {
    //       return (
    //         <div
    //           onClick={() => navigate(`/received-commission-view/${id}`)}
    //           className="flex items-center space-x-2"
    //         >
    //           <MdOutlineRemoveRedEye
    //             title="View pending Info"
    //             className="h-5 w-5 cursor-pointer"
    //           />
    //         </div>
    //       );
    //     },
    //   },
    // },
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
    onRowClick: (rowData, rowMeta) => {
      const id = receivedCommData[rowMeta.dataIndex].id;
      navigate(`/received-commission-view/${id}`)
    },
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
          cursor:'pointer',
        },
      };
    },
  };
  return (
    <Layout>
      <CommissionFilter />
      {/* <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Commission Received List
        </h3>
      </div> */}
      <div className="mt-5">
        <MUIDataTable
          title="Commission Received List"
          data={receivedCommData ? receivedCommData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default ReceivedsCommission;
