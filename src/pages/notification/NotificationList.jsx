import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { FaEdit } from "react-icons/fa";
import MUIDataTable from "mui-datatables";
import Moment from "moment";
import { toast } from "react-toastify";
import UseEscapeKey from "../../utils/UseEscapeKey";

const NotificationList = () => {
  const [notificationData, setNotificationData] = useState(null);
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
        navigate(`/refer-by?page=${storedPageNo}`); 
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
  const fetchNotificationData = async () => {
    try {
      if (!isPanelUp) {
        navigate("/maintenance");
        return;
      }
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-notification-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotificationData(response.data?.notification);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationData();
    setLoading(false);
  }, []);

  const handleUpdate = async (id) => {
    try {
      axios({
        url: BASE_URL + "/api/panel-update-notification/" + id,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          toast.success("Notification Updated Sucessfully");
          fetchNotificationData();
        } else {
          toast.error("Network Error");
        }
      });
    } catch (error) {
      console.error("Error in Network ", error);
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
      name: "notification_image",
      label: "Image",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (image) => {
          const imageUrl = image
            ? `https://agsdraft.online/app/storage/app/public/notification_images/${image}`
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
      name: "notification_create_date",
      label: "Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },

    {
      name: "notification_heading",
      label: "Heading",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "notification_status",
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
          const tableNot =
            notificationData[tableMeta.rowIndex].notification_status;
          console.log("table not ", tableNot);

          return tableNot == "Active" ? (
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <FaEdit
                  title="Inactive"
                  onClick={() => handleUpdate(id)}
                  className="h-5 w-5 cursor-pointer"
                />
              )}
            </div>
          ) : (
            ""
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
            to="/add-notification"
            className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
          >
            + Notification
          </Link>
        )}
        </>
      );
    },
  };
  return (
    <Layout>
      <div className="mt-5">
        <MUIDataTable
        title="Notification List"
          data={notificationData ? notificationData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default NotificationList;
