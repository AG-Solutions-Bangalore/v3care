import axios from "axios";
import MUIDataTable from "mui-datatables";
import React, { useContext, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import { SquarePen } from "lucide-react";

const ReferByMaster = () => {
  const [referData, setReferData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  //
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
        navigate(`/refer-by?page=${storedPageNo}`); 
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
  useEffect(() => {
    const fetchReferData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-referby-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReferData(response.data?.referby);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReferData();
    setLoading(false);
  }, []);
  const handleEdit = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/refer-by-edit/${id}`);
  };
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
              {userType !== "4" && (
                <>
                  <div
                    onClick={(e) => handleEdit(e, id)}
                    className="flex items-center space-x-2"
                  >
                    {/* <SquarePen
                      title="Booking Info"
                      className="h-5 w-5 cursor-pointer hover:text-blue-700"
                    /> */}
                    <SquarePen className="h-5 w-5 cursor-pointer hover:text-blue-700">
  <title>Booking Info</title>
</SquarePen>

             
                  </div>
                </>
              )}
            </>
          );
        },
      },
    },
    // {
    //   name: "slNo",
    //   label: "SL No",
    //   options: {
    //     filter: false,
    //     sort: false,
    //     customBodyRender: (value, tableMeta) => {
    //       return tableMeta.rowIndex + 1;
    //     },
    //   },
    // },
    {
      name: "refer_by",
      label: "Refer By",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "refer_by_status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
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

    count: referData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/refer-by?page=${currentPage + 1}`);
    },
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "5px solid #f1f7f9",
        },
      };
    },
    customToolbar: () => {
      return (
        <>
          {userType !== "4" && (
            <Link
              to="/add-referby"
              className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
            >
              + Refer by
            </Link>
          )}
        </>
      );
    },
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => {
      return (
        <div className="flex justify-end items-center p-4">
          <span className="mx-4">
            <span className="text-red-600">{page + 1}</span>-{rowsPerPage} of{" "}
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
      <div className=" mt-1">
        <MUIDataTable
          title="Refer By List"
          data={referData ? referData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default ReferByMaster;
