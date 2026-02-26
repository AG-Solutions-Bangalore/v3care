import axios from "axios";
import MUIDataTable from "mui-datatables";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import CommissionFilter from "../../../components/CommissionFilter";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";

import Moment from "moment";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import LoaderComponent from "../../../components/common/LoaderComponent";
import UseEscapeKey from "../../../utils/UseEscapeKey";
const ReceivedsCommission = () => {
  const [receivedCommData, setReceivedCommData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [totals, setTotals] = useState({
    topay: 0,
    toreceive: 0,
  });
  const location = useLocation();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");
  const pendingDataRef = useRef(null);

  useEffect(() => {
    if (pageParam) {
      setPage(parseInt(pageParam) - 1);
    } else {
      const storedPageNo = localStorage.getItem("page-no");
      if (storedPageNo) {
        setPage(parseInt(storedPageNo) - 1);
        navigate(`/commission-received?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();

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
        },
      );
      const bookingData = response.data?.booking ?? [];

      setReceivedCommData(bookingData);
      pendingDataRef.current = bookingData;
      let totalToPay = 0;
      let totalToReceive = 0;

      bookingData.forEach((row) => {
        const vendorAmount = Number(row.order_vendor_amount) || 0;
        const commission = Number(row.order_comm) || 0;
        const collectedBy = row.order_comm_received_by;

        if (collectedBy === "Vendor") {
          totalToReceive += commission;
        }

        if (collectedBy === "V3 Care") {
          totalToPay += vendorAmount - commission;
        }
      });

      setTotals({
        topay: totalToPay,
        toreceive: totalToReceive,
      });
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReceivedComData();
  }, []);
  const debounceRef = useRef(null);
  const calculateTotals = useCallback((displayData) => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const raw = pendingDataRef.current;
      if (!displayData || !raw) return;

      let totalToPay = 0;
      let totalToReceive = 0;

      displayData.forEach((row) => {
        const r = raw[row.dataIndex];
        if (!r) return;

        const vendorAmount = Number(r.order_vendor_amount) || 0;
        const commission = Number(r.order_comm) || 0;
        const collectedBy = r.order_comm_received_by;

        if (collectedBy === "Vendor") {
          totalToReceive += commission;
        }

        if (collectedBy === "V3 Care") {
          totalToPay += vendorAmount - commission;
        }
      });

      setTotals({
        topay: totalToPay,
        toreceive: totalToReceive,
      });
    }, 120);
  }, []);
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
          const locality = tableMeta.rowData[17];
          const sublocality = tableMeta.rowData[18];

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
      label: "Booking & Service Date",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const bookingDate = tableMeta.rowData[7];
          const serviceDate = tableMeta.rowData[8];
          return (
            <div className=" flex flex-col justify-center w-24">
              <span>{Moment(bookingDate).format("DD-MM-YYYY")}</span>
              <span>{Moment(serviceDate).format("DD-MM-YYYY")}</span>
            </div>
          );
        },
      },
    },
    //4
    {
      name: "order_customer",
      label: "Customer",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const mobile = tableMeta.rowData[18];
          return (
            <div className=" flex flex-col justify-center w-30">
              <span>{value}</span>
              <span>{mobile}</span>
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
        filter: false,
        display: "exclude",
        searchable: true,
        sort: true,
        viewColumns: false,
      },
    },
    //6
    {
      name: "vendor_company",
      label: "Vendor",
      options: {
        filter: true,
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
        filter: false,
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
        searchable: true,
        sort: false,
        viewColumns: false,
        customBodyRender: (value, tableMeta) => {
          const customdes = tableMeta.rowData[19];

          return value == "Custom" ? customdes : value;
        },
      },
    },
    //10
    {
      name: "order_amount",
      label: "Total Amount",
      options: {
        filter: false,
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
    //11
    {
      name: "order_vendor_amount",
      label: "Vendor Amount",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return (
            <div className=" flex flex-col w-32">
              <span>{value ? value : 0}</span>
            </div>
          );
        },
      },
    },
    //12
    {
      name: "order_comm",
      label: "Comm (%)",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const commissionPercentage = tableMeta.rowData[20] || 0;

          return (
            <div className="flex flex-col w-32">
              <span>{`${value} (${commissionPercentage}%)`}</span>
            </div>
          );
        },
      },
    },
    //13
    {
      name: "order_comm_received_by",
      label: "Collect By",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const commision = tableMeta.rowData[14];
          return (
            <div className=" flex flex-col w-32">
              <span>{value}</span>
            </div>
          );
        },
      },
    },
    //14
    {
      name: "order_vendor_amount",
      label: "To Pay",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const vendor = tableMeta.rowData[13];
          const commision = tableMeta.rowData[21];
          return (
            <div className=" flex flex-col w-32">
              <span>
                {vendor == "V3 Care"
                  ? `${Number(value) - Number(commision)}`
                  : ""}
              </span>
            </div>
          );
        },
      },
    },
    //15
    {
      name: "com_percentage_amount",
      label: "To Receive",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const commision = tableMeta.rowData[21];
          return (
            <div className=" flex flex-col w-32">
              <span>{commision ? `${commision}` : ""}</span>
            </div>
          );
        },
      },
    },
    //16
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
    //17
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
    // 18
    {
      name: "order_customer_mobile",
      label: "Cust Mobile",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
    //19
    {
      name: "order_custom",
      label: "Order Custom",
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
      name: "order_comm_percentage",
      label: "Comm Percentage",
      options: {
        filter: false,
        display: "exclude",
        searchable: true,
        sort: false,
        viewColumns: false,
      },
    },
    //21
    {
      name: "order_comm",
      label: "Comm Amount",
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
    count: receivedCommData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/received-commission?page=${currentPage + 1}`);
    },
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    setRowProps: () => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
          cursor: "pointer",
        },
      };
    },
    onTableChange: (action, tableState) => {
      if (["filterChange", "search", "sort", "propsUpdate"].includes(action)) {
        calculateTotals(tableState.displayData);
      }
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
  const tableTitle = useMemo(
    () => (
      <div className="flex items-center justify-between w-full">
        <span className="text-lg font-semibold">Commission Close List</span>

        <div className="flex items-center justify-end space-x-4 px-3 py-1 bg-blue-50 rounded-md">
          <div className="flex items-end space-x-1">
            <span className="text-xs text-gray-600">Total Payed:</span>
            <span className="text-sm font-bold text-red-600">
              ₹{totals.topay.toFixed(2)}
            </span>
          </div>

          <div className="w-px h-4 bg-gray-300" />

          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-600">Total Received:</span>
            <span className="text-sm font-bold text-green-600">
              ₹{totals.toreceive.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    ),
    [totals],
  );
  return (
    <Layout>
      <CommissionFilter />
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title={tableTitle}
            data={receivedCommData ? receivedCommData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default ReceivedsCommission;
