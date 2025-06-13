import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {BASE_URL} from "../../../base/BaseUrl";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import MUIDataTable from "mui-datatables";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FieldTeamViewMaster from "./FieldTeamViewMaster";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { SquarePen } from "lucide-react";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";

const FieldTeamMaster = () => {
  const [fieldTeamData, setFieldTeamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [fieldDrawer, setFieldDrawer] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
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
        navigate(`/field-team?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();
  useEffect(() => {
    const fetchFieldData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-admin-user-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFieldTeamData(response.data?.adminUser);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFieldData();
  }, []);

  const toogleViewServiceSub =
    (open, id = null) =>
    (event) => {
      if (
        event &&
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setFieldDrawer(open);
      if (id) setSelectedFieldId(id);
    };
  const handleEdit = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/field-team-edit/${id}`);
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
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <SquarePen
                  onClick={(e) => handleEdit(e, id)}
                  className="h-5 w-5 cursor-pointer hover:text-blue-700"
                >
                  <title>Edit Team</title>
                </SquarePen>
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
      name: "name",
      label: "Full Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "mobile",
      label: "Mobile",
      options: {
        filter: true,
        sort: true,
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
      name: "status",
      label: "Status",
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
    count: fieldTeamData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/field-team?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta) => {
      const id = fieldTeamData[rowMeta.dataIndex].id;
      toogleViewServiceSub(true, id)();
    },
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "5px solid #f1f7f9",
          cursor: "pointer",
        },
      };
    },
    customToolbar: () => {
      return (
        <>
          {userType !== "4" && (
            <ButtonConfigColor
              type="create"
              label="Add Field Team"
              onClick={() => navigate("/add-field-team")}
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
            title="Field Team List"
            data={fieldTeamData ? fieldTeamData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}

      <SwipeableDrawer
        anchor="right"
        open={fieldDrawer}
        onClose={toogleViewServiceSub(false)}
        onOpen={toogleViewServiceSub(true)}
      >
        {selectedFieldId && (
          <FieldTeamViewMaster
            fieldId={selectedFieldId}
            onClose={toogleViewServiceSub(false)}
          />
        )}
      </SwipeableDrawer>
    </Layout>
  );
};

export default FieldTeamMaster;
