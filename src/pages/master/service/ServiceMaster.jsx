import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BASE_URL,
  NO_IMAGE_URL,
  SERVICE_IMAGE_URL,
} from "../../../base/BaseUrl";
import { FaEdit } from "react-icons/fa";
import MUIDataTable from "mui-datatables";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { SquarePen } from "lucide-react";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as SelectMaterial,
  TextField,
} from "@mui/material";
const ServiceMaster = () => {
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSuperService, setSelectedSuperService] = useState("All");
  useEffect(() => {
    if (pageParam) {
      setPage(parseInt(pageParam) - 1);
    } else {
      const storedPageNo = localStorage.getItem("page-no");
      if (storedPageNo) {
        setPage(parseInt(storedPageNo) - 1);
        navigate(`/service?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);

        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-service-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setServiceData(response.data?.service);
        setFilteredData(response.data?.service || []);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceData();
  }, []);

  const handleEdit = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/service-edit/${id}`);
  };
  const uniqueSuperServices = [
    "All",
    ...new Set(serviceData.map((item) => item.serviceSuper)),
  ];

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedSuperService(value);

    if (value === "All") {
      setFilteredData(serviceData);
    } else {
      setFilteredData(
        serviceData.filter((item) => item.serviceSuper === value)
      );
    }
  };

  const columns = [
    ...(userType === "6" || userType === "8"
      ? [
          {
            name: "id",
            label: "Action",
            options: {
              filter: false,
              sort: false,
              customBodyRender: (id) => {
                return (
                  <div
                    onClick={(e) => handleEdit(e, id)}
                    className="flex items-center space-x-2"
                  >
                    <SquarePen className="h-5 w-5 cursor-pointer hover:text-blue-700">
                      <title>Booking Info</title>
                    </SquarePen>
                  </div>
                );
              },
            },
          },
        ]
      : []),

    {
      name: "service_image",
      label: "Image",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (image) => {
          const imageUrl = image
            ? `${SERVICE_IMAGE_URL}/${image}`
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
      name: "service_show_website",
      label: "Service Show Website",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          if (!value) return null;
          const values =
            typeof value == "string"
              ? value.split(",").map((v) => parseInt(v.trim()))
              : Array.isArray(value)
              ? value
              : [value];

          const renderBadge = (val) => {
            let label = "";
            let colorClass = "";

            switch (val) {
              case 1:
                label = "Popular";
                colorClass = "bg-blue-600";
                break;
              case 2:
                label = "Most Popular";
                colorClass = "bg-teal-600";
                break;
              case 3:
                label = "Super Popular";
                colorClass = "bg-red-600";
                break;
              default:
                label = "Unknown";
                colorClass = "bg-gray-400";
            }

            return (
              <span
                key={val}
                className={`text-white text-xs font-medium px-2 py-1 rounded-full mr-1 mb-1 inline-block ${colorClass}`}
              >
                {label}
              </span>
            );
          };

          return (
            <div className="flex flex-wrap">{values.map(renderBadge)}</div>
          );
        },
      },
    },
    {
      name: "service_status",
      label: "Status  ",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    // rowsPerPage: 5,
    // rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    count: filteredData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/service?page=${currentPage + 1}`);
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
          <FormControl sx={{ minWidth: 100, marginRight: "10px" }}>
            <InputLabel id="super_service_id-label">
              <span className="text-sm relative bottom-[6px]">
                Super Service <span className="text-red-700">*</span>
              </span>
            </InputLabel>
            <SelectMaterial
              sx={{ height: "40px", borderRadius: "5px" }}
              labelId="super_service_id-label"
              id="super_service_id-select"
              name="super_service_id"
              value={selectedSuperService}
              onChange={handleFilterChange}
              label="Super Service"
              required
            >
              {uniqueSuperServices.map((item, idx) => (
                <MenuItem key={idx} value={item}>
                  {item}
                </MenuItem>
              ))}
            </SelectMaterial>
          </FormControl>

          {(userType == "6" || userType == "8") && (
            <ButtonConfigColor
              type="create"
              label="Service"
              className="space-x-4"
              onClick={() => navigate("/add-service")}
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
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title="Service List"
            data={filteredData ? filteredData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default ServiceMaster;
