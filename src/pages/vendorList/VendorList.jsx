import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { ContextPanel } from "../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { FaEdit } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward, IoMdPeople } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { FiUserPlus, FiUsers } from "react-icons/fi";
import { RiEditLine } from "react-icons/ri";
import { toast } from "react-toastify";
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
        // if (!isPanelUp) {
        //   navigate("/maintenance");
        //   return;
        // }
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
    setLoading(false);
  }, []);

  const handleActivate = async (e, id) => {
    e.preventDefault();
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
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
        // navigate("/vendor-list");
        // add loader status pending to active
      } else {
        if (res.data.code == "401") {
          toast.error("Company Name Duplicate Entry");
        } else if (res.data.code == "402") {
          toast.error("Mobile No Duplicate entry");
        } else if (res.data.code == "403") {
          toast.error("Email Duplicate Entry");
        }
      }
    } catch (error) {
      console.error("Error fetching pending activate data", error);
      toast.error("Error fetching pending activate data");
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/vendor-edit/${id}`);
  };
  const handleViewVendorInfo = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/vendor-view/${id}`);
  };
  const handleEditPendingVendor = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/vendor-pending-edit/${id}`);
  };
  const handleViewVendor = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/vendor-user-list/${id}`);
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
      label: "Status",
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
        customBodyRender: (id, tableMeta) => {
          const vendorStatus = vendorListData[tableMeta.rowIndex].vendor_status;
          return (
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <>
                  {vendorStatus === "Active" || vendorStatus === "Inactive" ? (
                    <>
                      <RiEditLine
                        onClick={(e) => handleEdit(e, id)}
                        title="Edit Vendor"
                        className="h-5 w-5 cursor-pointer"
                      />
                      <FiUsers
                        onClick={(e) => handleViewVendor(e, id)}
                        // onClick={() => navigate(`/vendor-user-list/${id}`)}

                        title="view Vendor"
                        className="h-5 w-5 cursor-pointer"
                      />
                    </>
                  ) : vendorStatus === "Pending" ? (
                    <>
                      {/* for pending  */}
                      <CiEdit
                        onClick={(e) => handleEditPendingVendor(e, id)}
                        // onClick={() => navigate(`/vendor-pending-edit/${id}`)}
                        title="Edit Pending Vendor"
                        className="h-5 w-5 cursor-pointer"
                      />
                      <FiUserPlus
                        onClick={(e) => handleActivate(e, id)}
                        title="Activate Vendor"
                        className="h-5 w-5 cursor-pointer"
                      />
                    </>
                  ) : null}
                </>
              )}
              {/* common  */}
              <MdOutlineRemoveRedEye
                onClick={(e) => handleViewVendorInfo(e, id)}
                title="View Vendor Info"
                className="h-5 w-5 cursor-pointer"
              />
            </div>
          );
        },
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
        },
      };
    },
    customToolbar: () => {
      return (
        <>
          {userType !== "4" && (
            <Link
              to={`/add-vendor`}
              className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
            >
              + Vendor
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
      <div className="mt-5">
        <MUIDataTable
          title="Vendor List"
          data={vendorListData ? vendorListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default VendorList;
