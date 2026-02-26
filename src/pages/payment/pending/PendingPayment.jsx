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
import { FaCircle, FaTimesCircle } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import PaymentFilter from "../../../components/PaymentFilter";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";

import Moment from "moment";
import LoaderComponent from "../../../components/common/LoaderComponent";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { toast } from "react-toastify";

// const formatRow = (item, index) => ({
//   ...item,
//   _index: index,
//   _bookingDate: Moment(item.order_date).format("DD-MM-YYYY"),
//   _serviceDate: Moment(item.order_service_date).format("DD-MM-YYYY"),
//   _totalReceived:
//     (Number(item.order_payment_amount) || 0) +
//     (Number(item.order_advance) || 0),
//   _balance:
//     (Number(item.order_amount) || 0) - (Number(item.order_payment_amount) || 0),
// });

const STATUS_ICONS = {
  Completed: <FaTimesCircle className="text-green-600" title="close the job" />,
  Pending: <FaTimesCircle className="text-yellow-600" title="close the job" />,
  Cancel: <FaTimesCircle className="text-red-600" title="close the job" />,
};
const getStatusIcon = (status) =>
  STATUS_ICONS[status] ?? <FaCircle className="text-gray-400" title={status} />;

const PendingPayment = () => {
  const [pendingData, setPendingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const [totals, setTotals] = useState({
    totalPrice: 0,
    totalPaid: 0,
    totalBalance: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const pendingDataRef = useRef(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setPage(parseInt(pageParam) - 1);
    } else {
      const stored = localStorage.getItem("page-no");
      if (stored) {
        setPage(parseInt(stored) - 1);
        navigate(`/pending-payment?page=${stored}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);

  UseEscapeKey();

  const fetchPendingData = async () => {
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-final-payment-open-list`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const bookingData = response.data?.booking ?? [];
      setPendingData(bookingData);
      pendingDataRef.current = bookingData;

      let tp = 0,
        tpaid = 0;
      for (const r of bookingData) {
        tp += Number(r.order_amount) || 0;
        tpaid +=
          (Number(r.order_payment_amount) || 0) +
          (Number(r.order_advance) || 0);
      }
      setTotals({ totalPrice: tp, totalPaid: tpaid, totalBalance: tp - tpaid });
    } catch (err) {
      console.error("Error fetching pending payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, []);

  const debounceRef = useRef(null);
  const calculateTotals = useCallback((displayData) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const raw = pendingDataRef.current;
      if (!displayData || !raw) return;
      let tp = 0,
        tpaid = 0;
      for (const row of displayData) {
        const r = raw[row.dataIndex];
        if (!r) continue;
        tp += Number(r.order_amount) || 0;
        tpaid +=
          (Number(r.order_payment_amount) || 0) +
          (Number(r.order_advance) || 0);
      }
      setTotals({ totalPrice: tp, totalPaid: tpaid, totalBalance: tp - tpaid });
    }, 120);
  }, []);

  const handleClick = useCallback((e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(id);
    setIsDialogOpen(true);
  }, []);

  const confirmPayment = useCallback(async () => {
    if (!selectedId) return;
    try {
      const res = await axios.put(
        `${BASE_URL}/api/panel-update-final-payment-status/${selectedId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (res?.data?.code === "200" || res?.data?.code === 200) {
        toast.success(res.data?.msg || "Payment updated successfully");
        setIsDialogOpen(false);
        fetchPendingData();
      } else {
        toast.error(res?.data?.msg || "Failed to update payment");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  }, [selectedId]);

  const columns = useMemo(
    () => [
      // 0
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
      // 1
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
      // 2
      {
        name: "order_branch",
        label: "Order/Branch",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (_v, m) => (
            <div className="flex flex-col w-32">
              <span>{m.rowData[0]}</span>
              <span>{m.rowData[1]}</span>
            </div>
          ),
        },
      },
      // 3
      {
        name: "order_locality",
        label: "Area",
        options: {
          filter: false,
          sort: true,
          customBodyRender: (_v, m) => (
            <div className="flex flex-col w-40">
              <span>{m.rowData[20]}</span>
              <span>{m.rowData[19]}</span>
            </div>
          ),
        },
      },
      // 4
      {
        name: "order_customer",
        label: "Customer",
        options: {
          filter: true,
          display: "exclude",
          searchable: true,
          sort: true,
          viewColumns: false,
        },
      },
      // 5
      {
        name: "order_customer_mobile",
        label: "Mobile",
        options: {
          filter: true,
          display: "exclude",
          searchable: true,
          sort: true,
          viewColumns: false,
        },
      },
      // 6
      {
        name: "customer_mobile",
        label: "Customer/Mobile",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (_v, m) => (
            <div className="flex flex-col w-38">
              <span>{m.rowData[4]}</span>
              <span>{m.rowData[5]}</span>
            </div>
          ),
        },
      },
      // 7
      {
        name: "order_date",
        label: "Booking Date",
        options: {
          filter: true,
          sort: true,
          display: "exclude",
          searchable: true,
          viewColumns: false,
        },
      },
      // 8
      {
        name: "order_service_date",
        label: "Service Date",
        options: {
          filter: true,
          sort: true,
          display: "exclude",
          searchable: true,
          viewColumns: false,
        },
      },
      {
        name: "booking_service_date",
        label: "Booking/Service",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (_v, m) => (
            <div className="flex flex-col justify-center">
              <span>
                {m.rowData[7] ? Moment(m.rowData[7]).format("DD-MM-YYYY") : ""}
              </span>
              <span>
                {m.rowData[8] ? Moment(m.rowData[8]).format("DD-MM-YYYY") : ""}
              </span>
            </div>
          ),
        },
      },
      // 10
      {
        name: "order_service",
        label: "Service",
        options: {
          filter: true,
          display: "exclude",
          searchable: true,
          viewColumns: false,
          sort: true,
        },
      },
      // 11
      {
        name: "service_price",
        label: "Service/Price",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (_v, m) => (
            <div className="flex flex-col w-40">
              <span>
                {m.rowData[10] === "Custom" ? m.rowData[13] : m.rowData[10]}
              </span>
            </div>
          ),
        },
      },
      // 12
      {
        name: "order_amount",
        label: "Total Amount",
        options: {
          filter: true,
          viewColumns: false,
          searchable: true,
          sort: false,
        },
      },
      // 13
      {
        name: "order_custom",
        label: "Custom Desc",
        options: {
          filter: true,
          display: "exclude",
          viewColumns: false,
          searchable: true,
          sort: false,
        },
      },
      // 14
      {
        name: "order_payment_amount",
        label: "Received Amount",
        options: {
          filter: false,
          display: "exclude",
          viewColumns: false,
          searchable: true,
          sort: false,
        },
      },
      // 15
      {
        name: "order_payment_type",
        label: "Paid Type",
        options: {
          filter: false,
          display: "exclude",
          searchable: true,
          sort: false,
          viewColumns: false,
        },
      },
      // 16
      {
        name: "amount_type",
        label: "Received Amount/Type",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (_v, m) => {
            const total = Number(m.rowData[14]) + Number(m.rowData[21] || 0);
            return (
              <div className="flex flex-col">
                <span>{total}</span>
                <span>{m.rowData[15]}</span>
              </div>
            );
          },
        },
      },
      // 17
      {
        name: "balance",
        label: "Balance",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (_v, m) => {
            const bal =
              (parseFloat(m.rowData[12]) || 0) -
              (parseFloat(m.rowData[14]) || 0);
            return (
              <span
                className={
                  bal > 0
                    ? "text-red-600 font-semibold"
                    : "text-green-600 font-semibold"
                }
              >
                ₹{bal.toFixed(2)}
              </span>
            );
          },
        },
      },
      // 18
      {
        name: "order_status",
        label: "Status Changed",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => (
            <div className="flex justify-center grayscale">
              {getStatusIcon(value)}
            </div>
          ),
        },
      },
      // 19
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
      // 20
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
      // 21
      {
        name: "order_advance",
        label: "Advance",
        options: {
          filter: false,
          display: "exclude",
          searchable: true,
          sort: false,
          viewColumns: false,
        },
      },
    ],
    [],
  );

  const options = useMemo(
    () => ({
      selectableRows: "none",
      elevation: 0,
      responsive: "standard",
      viewColumns: true,
      download: false,
      print: false,
      count: pendingDataRef.current?.length || 0,
      rowsPerPage,
      page,
      serverSide: false,
      onChangePage: (currentPage) => {
        setPage(currentPage);
        navigate(`/pending-payment?page=${currentPage + 1}`);
      },
      onRowClick: (_rowData, rowMeta, e) => {
        const raw = pendingDataRef.current;
        if (!raw) return;
        const id = raw[rowMeta.dataIndex]?.id;
        if (id) handleClick(e, id);
      },
      setRowProps: () => ({
        style: { borderBottom: "5px solid #f1f7f9", cursor: "pointer" },
      }),
      onTableChange: (action, tableState) => {
        if (
          ["filterChange", "search", "sort", "propsUpdate"].includes(action)
        ) {
          calculateTotals(tableState.displayData);
        }
      },
      /* custom footer — no closures over state, uses params directly */
      customFooter: (count, pg, rpp, _changeRowsPerPage, changePage) => (
        <div className="flex justify-end items-center p-4">
          <span className="mx-4">
            <span className="text-red-600">Page {pg + 1}</span> of{" "}
            {Math.ceil(count / rpp)}
          </span>
          <IoIosArrowBack
            onClick={pg === 0 ? undefined : () => changePage(pg - 1)}
            className={`w-6 h-6 cursor-pointer ${pg === 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"} hover:text-red-600`}
          />
          <IoIosArrowForward
            onClick={
              pg >= Math.ceil(count / rpp) - 1
                ? undefined
                : () => changePage(pg + 1)
            }
            className={`w-6 h-6 cursor-pointer ${pg >= Math.ceil(count / rpp) - 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"} hover:text-red-600`}
          />
        </div>
      ),
    }),
    [page, calculateTotals, handleClick, navigate],
  );

  const tableTitle = useMemo(
    () => (
      <div className="flex items-center justify-between w-full">
        <span className="text-lg font-semibold">Payments</span>
        <div className="flex items-center space-x-4 px-3 py-1 bg-blue-50 rounded-md">
          <div className="flex items-end space-x-1">
            <span className="text-xs text-gray-600">Total Amount:</span>
            <span className="text-sm font-bold text-blue-600">
              ₹{totals.totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-600">Paid:</span>
            <span className="text-sm font-bold text-green-600">
              ₹{totals.totalPaid.toFixed(2)}
            </span>
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-600">Balance:</span>
            <span className="text-sm font-bold text-red-600">
              ₹{totals.totalBalance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    ),
    [totals],
  );

  return (
    <Layout>
      <PaymentFilter />
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title={tableTitle}
            data={pendingData ?? []}
            columns={columns}
            options={options}
          />
        </div>
      )}

      <Dialog open={isDialogOpen} handler={() => setIsDialogOpen(false)}>
        <DialogHeader>Confirm Payment</DialogHeader>
        <DialogBody>
          Do you want to Close this payment?
          <br />
          <span className="text-red-500 font-semibold">
            You cannot undo this action.
          </span>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            onClick={() => setIsDialogOpen(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button color="red" onClick={confirmPayment}>
            Yes
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

export default PendingPayment;
