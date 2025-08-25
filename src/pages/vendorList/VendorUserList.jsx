import axios from "axios";
import MUIDataTable from "mui-datatables";
import { useContext, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../base/BaseUrl";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../components/common/LoaderComponent";
import PageHeader from "../../components/common/PageHeader/PageHeader";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import UseEscapeKey from "../../utils/UseEscapeKey";
const VendorUserList = () => {
  const { id } = useParams();
  const [vendorUserList, setVendorUserList] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  localStorage.setItem("idVendor", id);
  UseEscapeKey();
  useEffect(() => {
    const fetchUserVendorListData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-vendor-users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setVendorUserList(response.data?.vendorUser);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserVendorListData();
  }, []);

  const columns = [
    {
      name: "name",
      label: "Full Name",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "mobile",
      label: "Mobile",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "status",
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
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              <FaEdit
                onClick={() => navigate(`/edit-vendor-user-list/${id}`)}
                title="edit vendor user list"
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
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
  };
  return (
    <Layout>
      <PageHeader
        title="Vendor User List"
        label2={
          userType !== "4" && (
            <ButtonConfigColor
              type="create"
              label="Add Vendor User"
              onClick={() => navigate(`/add-vendor-user/${id}`)}
            />
          )
        }
      />
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-5">
          <MUIDataTable
            data={vendorUserList ? vendorUserList : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default VendorUserList;
