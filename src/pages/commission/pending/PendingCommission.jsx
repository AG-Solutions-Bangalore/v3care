import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import CommissionFilter from "../../../components/CommissionFilter";
import MUIDataTable from "mui-datatables";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import Moment from "moment";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const PendingCommission = () => {
  const [PendingCommissionData, setPendingCommissionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");
  useEffect(() => {
    if (pageParam) {
      setPage(parseInt(pageParam) - 1);
    } else {
      const storedPageNo = localStorage.getItem("page-no");
      if (storedPageNo) {
        setPage(parseInt(storedPageNo) - 1);
        navigate(`/commission-pending?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
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
  const handleEdit = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/pending-commission-view/${id}`);
  };
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
        filter: false,
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
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,
      },
    },
    {
      name: "vendor_mobile",
      label: "Mobile",
      options: {
        filter: true,
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,
      },
    },
    {
      name: "vendor_mobile",
      label: "Vendor/Mobile",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const vendor = tableMeta.rowData[4];
          const mobileNo = tableMeta.rowData[5];
          return (
            <div className=" flex flex-col w-44">
              <span>{vendor}</span>
              <span>{mobileNo}</span>
            </div>
          );
        },
      },
    },
    {
      name: "order_date",
      label: "Booking Date",
      options: {
        filter: true,
        sort: true,
        display: "exclude",
        searchable: true,
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
        viewColumns: false,

        sort: true,
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
    {
      name: "order_service",
      label: "Service",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,
      },
    },

    {
      name: "order_comm",
      label: "Commission",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
    {
      name: "service_commision",
      label: "Service/Commission",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const service = tableMeta.rowData[10];
          const commision = tableMeta.rowData[11];
          return (
            <div className=" flex flex-col w-32">
              <span>{service}</span>
              <span>{commision}</span>
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
            <div
              // onClick={() => navigate(`/pending-commission-view/${id}`)}
              onClick={(e) => handleEdit(e, id)}
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

    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    count: PendingCommissionData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/commission-pending?page=${currentPage + 1}`);
    },
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "5px solid #f1f7f9",
        },
      };
    },
  };

  return (
    <Layout>
      <CommissionFilter />
      {/* <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Commission Pending List
        </h3>
      </div> */}
      <div className="mt-5">
        <MUIDataTable
          title="Commission Pending List"
          data={PendingCommissionData ? PendingCommissionData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default PendingCommission;
