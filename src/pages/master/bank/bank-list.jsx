import axios from "axios";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import LoaderComponent from "../../../components/common/LoaderComponent";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import CreateEditBank from "./bank-form";
const BankList = () => {
  const [bankListData, setBankListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        navigate(`/bank?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  const { userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  UseEscapeKey();
  const fetchBankList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-bank-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBankListData(response.data?.bank || []);
    } catch (error) {
      console.error("Error in  data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBankList();
  }, []);

  const columns = [
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <>
              <CreateEditBank id={id} refetch={fetchBankList} />
            </>
          );
        },
      },
    },

    {
      name: "bank_type",
      label: "Bank Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "bank_type_status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (status) => {
          const isActive = status === "Active";

          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {status}
            </span>
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
    count: bankListData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,

    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/bank?page=${currentPage + 1}`);
    },
    setRowProps: () => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
          cursor: "pointer",
        },
      };
    },

    customToolbar: () => {
      return (
        <>{userType == "8" && <CreateEditBank refetch={fetchBankList} />}</>
      );
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
      <MasterFilter />
      {loading ? (
        <>
          <div className="mt-1 bg-white p-2 rounded-sm">
            <LoaderComponent />
          </div>
        </>
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title="Bank"
            data={bankListData ? bankListData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default BankList;
