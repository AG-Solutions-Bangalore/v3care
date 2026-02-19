import axios from "axios";
import { SquarePen } from "lucide-react";
import MUIDataTable from "mui-datatables";
import React, { useContext, useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../base/BaseUrl";
import { ContextPanel } from "../../utils/ContextPanel";
import Layout from "../../layout/Layout";
import LoaderComponent from "../../components/common/LoaderComponent";
import UseEscapeKey from "../../utils/UseEscapeKey";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
import moment from "moment";

const Quotation = () => {
  const [quotationData, setQuotationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
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
      localStorage.setItem("page-no", 1);
      setPage(0);
    }
  }, [location]);

  UseEscapeKey();

  useEffect(() => {
    const fetchQuotationData = async () => {
      setLoading(true);

      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }

        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-quotation-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setQuotationData(response.data?.quotation || []);
      } catch (error) {
        console.error("Error fetching quotation data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotationData();
  }, []);

  const handleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/quotation/${id}?mode=edit`);
  };

  const columns = [
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) =>
          userType !== "4" && (
            <div
              onClick={(e) => handleEdit(e, id)}
              className="flex items-center"
            >
              <SquarePen className="h-5 w-5 cursor-pointer hover:text-blue-700">
                <title>Edit Quotation</title>
              </SquarePen>
            </div>
          ),
      },
    },

    {
      name: "quotation_ref",
      label: "Quotation Ref",
      options: { filter: true, sort: true },
    },
    {
      name: "order_ref",
      label: "Order Ref",
      options: { filter: true, sort: true },
    },
    {
      name: "quotation_date",
      label: "Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value ? moment(value).format("DD-MM-YYYY") : "-";
        },
      },
    },
    {
      name: "quotation_customer",
      label: "Customer Name",
      options: { filter: true, sort: true },
    },
    {
      name: "quotation_customer_mobile",
      label: "Contact No",
      options: { filter: true, sort: true },
    },
    {
      name: "sub_sum_quotation_sub_amount",
      label: "Total Amount",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => `₹ ${value}`,
      },
    },
  ];
  const handleView = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/quotation/view/${id}`);
  };
  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    count: quotationData.length,
    rowsPerPage,
    page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/quotation-list?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta, e) => {
      const id = quotationData[rowMeta.dataIndex].id;

      handleView(e, id);
    },
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <div className="flex justify-end items-center p-4">
        <span className="mx-4">
          <span className="text-red-600">Page {page + 1}</span> of{" "}
          {Math.ceil(count / rowsPerPage)}
        </span>
        <IoIosArrowBack
          onClick={page === 0 ? null : () => changePage(page - 1)}
          className={`w-6 h-6 cursor-pointer ${
            page === 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
          } hover:text-red-600`}
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
          } hover:text-red-600`}
        />
      </div>
    ),
  };

  return (
    <Layout>
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-4">
          <MUIDataTable
            title="Quotation List"
            data={quotationData}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default Quotation;
