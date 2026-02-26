import axios from "axios";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import CommissionFilter from "../../../components/CommissionFilter";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";

import Moment from "moment";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import LoaderComponent from "../../../components/common/LoaderComponent";
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
          },
        );

        setPendingCommissionData(response.data?.booking);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingComData();
  }, []);

  const handleView = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/pending-commission-view/${id}`);
  };
  const columns = [
    //0
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
    //1
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
    //2
    {
      name: "order_branch",
      label: "Order/Branch/Area",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const brancName = tableMeta.rowData[1];
          const orderRef = tableMeta.rowData[0];
          const locality = tableMeta.rowData[15];
          const sublocality = tableMeta.rowData[16];

          return (
            <div className=" flex flex-col w-32">
              <span>{orderRef}</span>
              <span>{brancName}</span>
              <span className="text-xs text-gray-600">
                {locality} - {sublocality}
              </span>
            </div>
          );
        },
      },
    },
    //3
    {
      name: "booking_service_date",
      label: "Booking Date/Service Date",
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
    //4
    {
      name: "booking_service_date",
      label: "Customer Name/Customer Mobile",
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
    //5
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
    //6
    {
      name: "vendor_company",
      label: "Vendor Name/Vendor Mobile",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const mobileNo = tableMeta.rowData[5];
          return (
            <div className=" flex flex-col w-44">
              <span>{value}</span>
              <span>{mobileNo}</span>
            </div>
          );
        },
      },
    },
    //7
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
    //8
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
    //9
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
             "order_customer": "customer",
            "order_customer_mobile": "8904054517",
    //10
    {
      name: "order_amount",
      label: "Amount",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
    //11
    {
      name: "service_commision",
      label: "Total Amount",
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
    //12
    {
      name: "service_commision",
      label: "Vendor Amount",
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
    //13
    {
      name: "order_comm_percentage",
      label: "Commision (%)",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,
      },
    },
    //14
    {
      name: "order_comm",
      label: "Commission Amount",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
    //15
    {
      name: "com_percentage_amount",
      label: "Comm (%)",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const commision = tableMeta.rowData[14];
          return (
            <div className=" flex flex-col w-32">
              <span>{commision ? `${commision} %` : ""}</span>
            </div>
          );
        },
      },
    },
    //16
    {
      name: "com_percentage_amount",
      label: "Collect By",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const commision = tableMeta.rowData[14];
          return (
            <div className=" flex flex-col w-32">
              <span>{commision ? `${commision} %` : ""}</span>
            </div>
          );
        },
      },
    },
    //17
    {
      name: "com_percentage_amount",
      label: "To Pay",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const commision = tableMeta.rowData[14];
          return (
            <div className=" flex flex-col w-32">
              <span>{commision ? `${commision} %` : ""}</span>
            </div>
          );
        },
      },
    },
    //18
    {
      name: "com_percentage_amount",
      label: "To Receive",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const commision = tableMeta.rowData[14];
          return (
            <div className=" flex flex-col w-32">
              <span>{commision ? `${commision} %` : ""}</span>
            </div>
          );
        },
      },
    },
    //19
    {
      name: "order_locality",
      label: "Locality",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
    //20
    {
      name: "order_sub_locality",
      label: "Sub Locality",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
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
    onRowClick: (rowData, rowMeta, e) => {
      // onRowClick: (rowMeta, e) => {
      const id = PendingCommissionData[rowMeta.dataIndex].id;

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
      <CommissionFilter />
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title="Commission Pending List"
            data={PendingCommissionData ? PendingCommissionData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default PendingCommission;
