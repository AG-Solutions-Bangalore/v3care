import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { FaEdit } from "react-icons/fa";
import MUIDataTable from "mui-datatables";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ServiceSubMaster = () => {
  const [serviceSubData, setServiceSubData] = useState(null);
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
        navigate(`/service-sub?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
  useEffect(() => {
    const fetchServiceSubData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-sub-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setServiceSubData(response.data?.servicesub);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceSubData();
    setLoading(false);
  }, []);
  const handleEdit = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/service-sub-edit/${id}`);
  };
  const columns = [
    {
      name: "slNo",
      label: "SL No",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return tableMeta.rowIndex + 1;
        },
      },
    },
    {
      name: "service_sub_image",
      label: "Image",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (image) => {
          const imageUrl = image
            ? `https://agsdraft.online/app/storage/app/public/service_sub/${image}`
            : "https://agsdraft.online/app/storage/app/public/no_image.jpg";
          return (
            <img
              src={imageUrl}
              alt="Service"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          );
        },
      },
    },

    {
      name: "service_sub",
      label: "Service Sub",
      options: {
        filter: true,
        sort: false,
      },
    },

    {
      name: "service_sub_status",
      label: "Status  ",
      options: {
        filter: true,
        sort: false,
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
            <>
              {userType !== "4" && (
                <div
                  onClick={(e) => handleEdit(e, id)}
                  className="flex items-center space-x-2"
                >
                  <FaEdit
                    title="Booking Info"
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>
              )}
            </>
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
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/service-sub?page=${currentPage + 1}`);
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
              to="/add-service-sub"
              className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
            >
              + Service Sub
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
      {/* <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Service Sub List
        </h3>
        {userType !== "4" && (
          <Link
            to="/add-service-sub"
            className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
          >
            + Add Service Sub
          </Link>
        )}
      </div> */}
      <div className="mt-5">
        <MUIDataTable
          title="Service Sub List"
          data={serviceSubData ? serviceSubData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default ServiceSubMaster;
