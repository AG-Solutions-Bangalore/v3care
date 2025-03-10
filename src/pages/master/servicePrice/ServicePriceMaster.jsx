import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { ContextPanel } from "../../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { FaEdit } from "react-icons/fa";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { SquarePen } from "lucide-react";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";

const ServicePriceMaster = () => {
  const [servicePriceData, setServicePriceData] = useState(null);
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
      const storedPageNo = localStorage.getItem("page-no");
      if (storedPageNo) {
        setPage(parseInt(storedPageNo) - 1);
        navigate(`/service-price?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
  useEffect(() => {
    const fetchServicePriceData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-price-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setServicePriceData(response.data?.serviceprice);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicePriceData();
    setLoading(false);
  }, []);
  const handleEdit = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/service-price-edit/${id}`);
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
                <div
                  onClick={(e) => handleEdit(e, id)}
                  className="flex items-center space-x-2"
                >
                  <SquarePen className="h-5 w-5 cursor-pointer hover:text-blue-700">
                    <title>Booking Info</title>
                  </SquarePen>
                </div>
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
      name: "service",
      label: "Service",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "service_sub",
      label: "Service Sub",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "service_price_for",
      label: "Price For",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "service_price_rate",
      label: "Price",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "service_price_amount",
      label: "Amount",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "service_price_status",
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
    count: servicePriceData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/service-price?page=${currentPage + 1}`);
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
            // <Link
            //   to="/add-service-price"
            //   className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
            // >
            //   + Service Price
            // </Link>
            <ButtonConfigColor
              type="create"
              label="Service Price"
              onClick={() => navigate("/add-service-price")}
            />
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
      <div className="mt-1">
        <MUIDataTable
          title="Service Price List"
          data={servicePriceData ? servicePriceData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default ServicePriceMaster;
