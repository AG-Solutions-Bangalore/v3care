import axios from "axios";
import { SquarePen } from "lucide-react";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { FiUserPlus, FiUsers } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiEditLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../base/BaseUrl";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../components/common/LoaderComponent";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import UseEscapeKey from "../../utils/UseEscapeKey";

const VendorList = () => {
  const [vendorListData, setVendorListData] = useState(null);
  const [loading, setLoading] = useState(false);
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
        navigate(`/vendor-list?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  UseEscapeKey();
  useEffect(() => {
    const fetchVendorListData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-vendor-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVendorListData(response.data?.vendor);
      } catch (error) {
        console.error("Error fetching vendor list data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorListData();
  }, []);

  const handleActivate = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios({
        url: BASE_URL + "/api/panel-create-vendor-has-users/" + id,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.code == "200") {
        toast.success("Vendor Activated Successfully");
        setVendorListData((prevVendorListData) =>
          prevVendorListData.map((vendor) =>
            vendor.id === id ? { ...vendor, vendor_status: "Active" } : vendor
          )
        );
      } else {
        if (res.data.code == "401") {
          toast.error("Company Name Duplicate Entry");
        } else if (res.data.code == "402") {
          toast.error("Mobile No Duplicate entry");
        } else if (res.data.code == "403") {
          toast.error("Email Duplicate Entry");
        } else {
          toast.error(res.data.msg || "Duplicate Entry");
        }
      }
    } catch (error) {
      console.error("Error fetching pending activate data", error);
      toast.error("Error fetching pending activate data");
    }
  };
  const handleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/vendor-edit/${id}`);
  };
  const handleViewVendorInfo = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/vendor-view/${id}`);
  };
  const handleEditPendingVendor = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/vendor-pending-edit/${id}`);
  };
  const handleViewVendor = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/vendor-user-list/${id}`);
  };
  const columns = [
    {
      name: "id",
      label: "ACTION",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id, tableMeta) => {
          const vendorStatus = vendorListData[tableMeta.rowIndex].vendor_status;
          return (
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <>
                  {vendorStatus === "Active" || vendorStatus === "Inactive" ? (
                    <>
                      <SquarePen
                        onClick={(e) => handleEdit(e, id)}
                        className="h-5 w-5 cursor-pointer hover:text-blue-700"
                      >
                        <title>Edit Vendor</title>
                      </SquarePen>
                      <FiUsers
                        onClick={(e) => handleViewVendor(e, id)}
                        title="View Vendor User List"
                        className="h-5 w-5 cursor-pointer  hover:text-blue-700"
                      />
                    </>
                  ) : vendorStatus === "Pending" ? (
                    <>
                      <RiEditLine
                        onClick={(e) => handleEditPendingVendor(e, id)}
                        title="Edit Pending Vendor"
                        className="h-5 w-5 cursor-pointer  hover:text-blue-700"
                      />
                      <FiUserPlus
                        onClick={(e) => handleActivate(e, id)}
                        title="Activate Vendor"
                        className="h-5 w-5 cursor-pointer  hover:text-blue-700"
                      />
                    </>
                  ) : null}
                </>
              )}
            </div>
          );
        },
      },
    },

    {
      name: "branch_name",
      label: "Branch",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "vendor_short",
      label: "Short",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "vendor_company",
      label: "Company",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "vendor_mobile",
      label: "Mobile",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "vendor_email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "vendor_status",
      label: "STATUS",
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
    count: vendorListData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,

    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/vendor-list?page=${currentPage + 1}`);
    },
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
          cursor: "pointer",
        },
      };
    },
    onRowClick: (rowData, rowMeta, e) => {
      const id = vendorListData[rowMeta.dataIndex].id;
      handleViewVendorInfo(e, id)();
    },
    customToolbar: () => {
      return (
        <>
          {userType !== "4" && (
            <ButtonConfigColor
              type="create"
              label="Vendor"
              onClick={() => navigate("/add-vendor")}
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
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-5">
          <MUIDataTable
            title="Vendor List"
            data={vendorListData ? vendorListData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default VendorList;
