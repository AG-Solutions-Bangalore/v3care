import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../base/BaseUrl";
import { ArrowLeftRight, SquarePen } from "lucide-react";
import MUIDataTable from "mui-datatables";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FieldTeamViewMaster from "./FieldTeamViewMaster";
import { toast } from "react-toastify";
import LoaderComponent from "../../../components/common/LoaderComponent";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button as MTButton,
} from "@material-tailwind/react";

const FieldTeamMaster = () => {
  const [fieldTeamData, setFieldTeamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [fieldDrawer, setFieldDrawer] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [branch, setBranch] = useState([]);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [team, setTeam] = useState({ branch_id: "", branch_name: "" });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedRowStatus, setSelectedRowStatus] = useState("");

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


    const fetchFieldData = async () => {
      try {
     
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-admin-user-list`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFieldTeamData(response.data?.adminUser);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
    fetchFieldData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${BASE_URL}/api/panel-fetch-branch`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBranch(res.data.branch))
      .catch((err) => console.error(err));
  }, []);


  useEffect(() => {
    if (transferDialogOpen && selectedFieldId && fieldTeamData) {
      const row = fieldTeamData.find((f) => f.id === selectedFieldId);
      if (row) {
        setTeam({ branch_id: row.branch_id || "", branch_name: row.branch_name || "" });
      }
    }
  }, [transferDialogOpen, selectedFieldId, fieldTeamData]);

  const toggleDrawer = (open, id = null) => (event) => {
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
    e.stopPropagation();
    localStorage.setItem("page-no", pageParam);
    navigate(`/field-team-edit/${id}`);
  };

  const handleTransferClick = (e, id) => {
    e.stopPropagation();
    const row = fieldTeamData.find((f) => f.id === id);
    setSelectedRowStatus(row.status);
    setSelectedFieldId(id);
    setTransferDialogOpen(true);
  };

  const onInputChange = (e) => {
    const selectedBranch = branch.find((b) => b.id === e.target.value);
    setTeam({
      branch_id: e.target.value,
      branch_name: selectedBranch ? selectedBranch.branch_name : "",
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsButtonDisabled(true);

    const data = new FormData();
    data.append("branch_id", team.branch_id);

    axios({
      url: `${BASE_URL}/api/panel-update-branch-user/${selectedFieldId}?_method=PUT`,
      method: "POST",
      data,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (res.data.code == "200") {
          toast.success(res.data?.msg || "Branch updated successfully");
          setTransferDialogOpen(false);
          fetchFieldData();
        } else {
          toast.error(res.data?.msg || "Duplicate entry");
        }
      })
      .catch(() => toast.error("Error updating branch"))
      .finally(() => {
        setIsButtonDisabled(false);
        setLoading(false);
      });
  };

  const columns = [
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id, tableMeta) => {
          const row = fieldTeamData[tableMeta.rowIndex];
          return (
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <SquarePen
                  onClick={(e) => handleEdit(e, id)}
                  className="h-5 w-5 cursor-pointer hover:text-blue-700"
                />
              )}
              {userType === "8" && (
                <ArrowLeftRight
                  onClick={
                    row.status === "Inactive"
                      ? null
                      : (e) => handleTransferClick(e, id)
                  }
                  className={`h-5 w-5 cursor-pointer ${
                    row.status === "Inactive"
                      ? "text-gray-400 cursor-not-allowed"
                      : "hover:text-green-700"
                  }`}
                />
              )}
            </div>
          );
        },
      },
    },
    { name: "branch_name", label: "Branch", options: { filter: true, sort: true } },
    { name: "name", label: "Full Name", options: { filter: true, sort: true } },
    { name: "mobile", label: "Mobile", options: { filter: true, sort: true } },
    { name: "email", label: "Email", options: { filter: true, sort: true } },
    { name: "status", label: "Status", options: { filter: true, sort: false } },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    count: fieldTeamData?.length || 0,
    rowsPerPage,
    page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/field-team?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta, event) => {
      const clickedClass = event.target.getAttribute("class") || "";
      if (!clickedClass.includes("cursor-pointer")) {
        const id = fieldTeamData[rowMeta.dataIndex].id;
        toggleDrawer(true, id)();
      }
    },
    setRowProps: () => ({
      style: { borderBottom: "5px solid #f1f7f9", cursor: "pointer" },
    }),
    customToolbar: () =>
      userType !== "4" ? (
        <ButtonConfigColor
          type="create"
          label="Add Field Team"
          onClick={() => navigate("/add-field-team")}
        />
      ) : null,
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <div className="flex justify-end items-center p-4">
        <span className="mx-4">
          <span className="text-red-600">Page {page + 1}</span> of{" "}
          {Math.ceil(count / rowsPerPage)}
        </span>
        <IoIosArrowBack
          onClick={page === 0 ? null : () => changePage(page - 1)}
          className={`w-6 h-6 cursor-pointer ${
            page === 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
          } hover:text-red-600`}
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
          } hover:text-red-600`}
        />
      </div>
    ),
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
            data={fieldTeamData || []}
            columns={columns}
            options={options}
          />
        </div>
      )}

      <SwipeableDrawer
        anchor="right"
        open={fieldDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {selectedFieldId && (
          <FieldTeamViewMaster
            fieldId={selectedFieldId}
            onClose={toggleDrawer(false)}
          />
        )}
      </SwipeableDrawer>

      {/* Material Tailwind Dialog */}
      <Dialog
        open={transferDialogOpen}
        size="sm"
        handler={() => setTransferDialogOpen(false)}
      >
        <DialogHeader>Transfer Team</DialogHeader>
        <DialogBody divider>
          <form id="transfer-team-form" onSubmit={onSubmit}>
            <label className="block mb-2 font-medium">
              Branch <span className="text-red-700">*</span>
            </label>
            <select
              name="branch_id"
              value={team.branch_id}
              onChange={onInputChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">{team.branch_name || "Select Branch"}</option>
              {branch.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.branch_name}
                </option>
              ))}
            </select>
          </form>
        </DialogBody>
        <DialogFooter>
          <MTButton
            variant="text"
            color="red"
            onClick={() => setTransferDialogOpen(false)}
          >
            Cancel
          </MTButton>
          <MTButton
            type="submit"
            form="transfer-team-form"
            disabled={isButtonDisabled || selectedRowStatus === "Inactive"}
            color="blue"
          >
            {loading ? (
              <span className="animate-spin border-2 border-t-2 border-gray-200 rounded-full w-5 h-5 mr-2 inline-block"></span>
            ) : null}
            Submit
          </MTButton>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

export default FieldTeamMaster;
