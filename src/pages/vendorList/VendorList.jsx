import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { ContextPanel } from "../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { FaEdit } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoMdPeople } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { FiUserPlus, FiUsers } from "react-icons/fi";
import { RiEditLine } from "react-icons/ri";

const VendorList = () => {
  const [vendorListData, setVendorListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchVendorListData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
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
      await axios({
        url: BASE_URL + "/api/panel-create-vendor-has-users/" + id,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("success");
    } catch (error) {
      console.error("Error fetching pending activate data", error);
    } finally {
      setLoading(false);
    }
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
              {vendorStatus === "Active" || vendorStatus === "Inactive" ? (
                <>
                  <RiEditLine
                    onClick={() => navigate(`/vendor-edit/${id}`)}
                    title="View Cylinder Info"
                    className="h-5 w-5 cursor-pointer"
                  />
                  <FiUsers
                    onClick={() => navigate(`/vendor-view/${id}`)}
                    title="View Cylinder Info"
                    className="h-5 w-5 cursor-pointer"
                  />
                </>
              ) : vendorStatus === "Pending" ? (
                <>
                  {/* for pending  */}
                  <CiEdit
                    onClick={() => navigate(`/vendor-pending-edit/${id}`)}
                    title="View pending Info"
                    className="h-5 w-5 cursor-pointer"
                  />
                  <FiUserPlus
                    onClick={(e) => handleActivate(e, id)}
                    title="View Cylinder Info"
                    className="h-5 w-5 cursor-pointer"
                  />
                </>
              ) : null}

              {/* common  */}
              <MdOutlineRemoveRedEye
                onClick={() => navigate(`/vendor-view/${id}`)}
                title="View Cylinder Info"
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
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
        },
      };
    },
  };
  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Vendor List
        </h3>

        <Link
          to={`/add-vendor`}
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Add Vendor
        </Link>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={vendorListData ? vendorListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default VendorList;
