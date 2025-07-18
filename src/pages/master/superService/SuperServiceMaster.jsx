import axios from "axios";
import { SquarePen } from "lucide-react";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { BiSort } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BASE_URL,
  NO_IMAGE_URL,
  SUPER_SERVICE_IMAGE_URL,
} from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import UpdateSuperServiceSort from "../../../components/common/UpdateSuperServiceSort";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const SuperServiceMaster = () => {
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const {  userType } = useContext(ContextPanel);
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
        navigate(`/super-service?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
  const fetchServiceData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-super-service-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServiceData(response.data?.servicesuper);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchServiceData();
  }, []);

  const handleEdit = (e, id) => {
    e.stopPropagation();

    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/super-service-edit/${id}`);
  };
  const handleView = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/super-service-view/${id}`);
  };

  const handleOpenDialog = ({ e, id }) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedService({ id });
    setIsDialogOpen(true);
  };
  const handleUpdateSort = async ({ id, newSortNumber }) => {
    try {
      console.log("Update sort:", id, newSortNumber);
      const res = await axios.put(
        `${BASE_URL}/api/panel-update-super-service-sort/${id}`,
        { newSortNumber },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status == 200) {
        fetchServiceData();
        toast.success(res.data?.msg || "Sort order updated successfully");
      } else {
        toast.error(res.data?.msg || "Error updating sort order");
      }
    } catch (error) {
      console.error("Sort update error:", error);
      toast.error(
        error?.response?.data?.msg ||
          "Something went wrong while updating sort order"
      );
    }
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
            <div className="flex space-x-2">
              {userType !== "4" && (
                <div
                  onClick={(e) => handleEdit(e, id)}
                  className="flex items-center space-x-2"
                >
                  <SquarePen className="h-5 w-5 cursor-pointer hover:text-blue-700">
                    <title>Edit Super Service</title>
                  </SquarePen>
                </div>
              )}
              <div
                onClick={(e) => handleOpenDialog({ e, id })}
                className="flex items-center space-x-2"
                title="Edit Super Service Order"
              >
                <BiSort className="h-5 w-5 cursor-pointer hover:text-blue-700" />
              </div>
            </div>
          );
        },
      },
    },

    {
      name: "serviceSuper_image",
      label: "Image",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (image) => {
          const imageUrl = image
            ? `${SUPER_SERVICE_IMAGE_URL}/${image}`
            : `${NO_IMAGE_URL}`;
          return (
            <img
              src={imageUrl}
              alt="Super Service"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          );
        },
      },
    },

    {
      name: "serviceSuper",
      label: "Super Service",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "serviceSuper_sort",
      label: "Sort",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "serviceSuper_status",
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
    count: serviceData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/service?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta, e) => {
      const id = serviceData[rowMeta.dataIndex].id;

      handleView(e, id)();
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
          <>
            <ButtonConfigColor
              type="create"
              label="Super Service"
              onClick={() => navigate("/super-service-create")}
            />
          </>
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
            title="Super Service List"
            data={serviceData ? serviceData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
      <UpdateSuperServiceSort
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleUpdateSort}
        data={selectedService}
      />
    </Layout>
  );
};

export default SuperServiceMaster;
