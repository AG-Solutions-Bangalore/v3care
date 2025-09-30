import axios from "axios";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const ServicePriceMaster = () => {
  const [servicePriceData, setServicePriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userType } = useContext(ContextPanel);
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
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-price-list-new`,
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
  }, []);
  const handleViewServiceInfo = (e, service_id, service_sub_id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/service-price-edit/${service_id}`, {
      state: { service_id, service_sub_id },
    });
  };
  const columns = [
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
      label: "Sub Service",
      options: {
        filter: true,
        sort: true,
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

    setRowProps: () => {
      return {
        style: {
          borderBottom: "5px solid #f1f7f9",
        },
      };
    },
    onRowClick: (rowData, rowMeta, e) => {
      const service_id = servicePriceData[rowMeta.dataIndex].service_id;
      const service_sub_id = servicePriceData[rowMeta.dataIndex].service_sub_id;
      handleViewServiceInfo(e, service_id, service_sub_id);
    },
    customToolbar: () => {
      return (
        <>
          {userType !== "4" && (
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
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title="Services Price List"
            data={servicePriceData ? servicePriceData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default ServicePriceMaster;
