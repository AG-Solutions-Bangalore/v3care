import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { FaEdit } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import BackhandViewTeamMaster from "./BackhandViewTeamMaster";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

const BackhandTeamMaster = () => {
  const [BackhandData, setBackhandData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [backhandDrawer, setBackhandDrawer] = useState(false);
  const [selectedBackhandId, setSelectedBackhandId] = useState(null);
  UseEscapeKey();
  useEffect(() => {
    const fetchBackhadnData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-admin-manager-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBackhandData(response.data?.adminUser);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBackhadnData();
    setLoading(false);
  }, []);

  
  const toogleViewBackhand =
  (open, id = null) =>
  (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setBackhandDrawer(open);
    if (id) setSelectedBackhandId(id);
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
                <FaEdit
                  onClick={() => navigate(`/backhand-team-edit/${id}`)}
                  title="Booking Info"
                  className="h-5 w-5 cursor-pointer"
                />
              )}
              {/* <MdOutlineRemoveRedEye
                onClick={() => navigate(`/backhand-team-view/${id}`)}
                title="Booking Info"
                className="h-5 w-5 cursor-pointer"
              /> */}
                <div
                onClick={toogleViewBackhand(true, id)}
                className="flex items-center space-x-2"
                title="View"
              >
                <MdOutlineRemoveRedEye   className="h-5 w-5 cursor-pointer" />
              </div>
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
            to="/add-backhand-team"
            className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
          >
            + Backhand
          </Link>
        )}
       </>
      );
    },
  };
  return (
    <Layout>
      <MasterFilter />
      {/* <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Backhand Team List
        </h3>
        {userType !== "4" && (
          <Link
            to="/add-backhand-team"
            className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
          >
            + Add Backhand Team
          </Link>
        )}
      </div> */}
      <div className="mt-5">
        <MUIDataTable
        title ="Backhand Team List"
          data={BackhandData ? BackhandData : []}
          columns={columns}
          options={options}
        />
      </div>
      <SwipeableDrawer
        anchor="right"
        open={backhandDrawer}
        onClose={toogleViewBackhand(false)}
        onOpen={toogleViewBackhand(true)}
      >
       {selectedBackhandId && (
    <BackhandViewTeamMaster
      backhandId={selectedBackhandId}
      onClose={toogleViewBackhand(false)}
    />
  )}
      </SwipeableDrawer>
    </Layout>
  );
};

export default BackhandTeamMaster;
