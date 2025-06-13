import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BASE_URL,
  NO_IMAGE_URL,
  SERVICE_SUB_IMAGE_URL,
} from "../../../base/BaseUrl";
import { FaEdit } from "react-icons/fa";
import MUIDataTable from "mui-datatables";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { SquarePen } from "lucide-react";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";

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
  }, []);
  const handleEdit = (e, id) => {
    e.stopPropagation();

    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/service-sub-edit/${id}`);
  };
  const columns = [
    ...(userType == "6" || userType == "8"
      ? [
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
        ]
      : []),

    {
      name: "service_sub_image",
      label: "Image",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (image) => {
          const imageUrl = image
            ? `${SERVICE_SUB_IMAGE_URL}/${image}`
            : `${NO_IMAGE_URL}`;
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
      name: "service_sub_status",
      label: "Status  ",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];
  const handleView = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/view-service-sub/${id}`);
  };
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
    onRowClick: (rowData, rowMeta, e) => {
      const id = serviceSubData[rowMeta.dataIndex].id;

      handleView(e, id)();
    },
    customToolbar: () => {
      return (
        <>
          {userType == "6" ||
            (userType == "8" && (
              <ButtonConfigColor
                type="create"
                label="Sub Service"
                onClick={() => navigate("/add-service-sub")}
              />
            ))}
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
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title="Sub Service  List"
            data={serviceSubData ? serviceSubData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default ServiceSubMaster;
