import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../base/BaseUrl";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import MUIDataTable from "mui-datatables";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import FieldTeamViewMaster from "./FieldTeamViewMaster";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ArrowLeftRight, SquarePen } from "lucide-react";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import { toast } from "sonner";

const FieldTeamMaster = () => {
  const [fieldTeamData, setFieldTeamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [fieldDrawer, setFieldDrawer] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [branch, setBranch] = useState([]);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [team, setTeam] = useState({ branch_id: "" });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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

  // fetch branch data
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${BASE_URL}/api/panel-fetch-branch`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBranch(res.data.branch))
      .catch((err) => console.error(err));
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

  const handleTransferClick = (id) => {
    setSelectedFieldId(id);
    setTransferDialogOpen(true);
  };

  const onInputChange = (e) => {
    setTeam({ ...team, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsButtonDisabled(true);

    const data = new FormData();
    data.append("branch_id", team.branch_id);

    axios({
      url: `${BASE_URL}/api/panel-update-branch-user/${selectedFieldId}`,
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.data.code === "200") {
          toast.success(res.data?.msg || "Branch updated successfully");
          setTeam({ branch_id: "" });
          setTransferDialogOpen(false);
          // optionally refresh the table
          setFieldTeamData((prev) =>
            prev.map((item) =>
              item.id === selectedFieldId
                ? { ...item, branch_id: team.branch_id }
                : item
            )
          );
        } else {
          toast.error(res.data?.msg || "Duplicate entry");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error updating branch");
      })
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
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <>
                  <SquarePen
                    onClick={(e) => handleEdit(e, id)}
                    className="h-5 w-5 cursor-pointer hover:text-blue-700"
                  >
                    <title>Edit Team</title>
                  </SquarePen>

                  <ArrowLeftRight
                    onClick={() => handleTransferClick(id)}
                    className="h-5 w-5 cursor-pointer hover:text-green-700"
                  >
                    <title>Transfer Team</title>
                  </ArrowLeftRight>
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
      options: { filter: true, sort: true },
    },
    {
      name: "name",
      label: "Full Name",
      options: { filter: true, sort: true },
    },
    {
      name: "mobile",
      label: "Mobile",
      options: { filter: true, sort: true },
    },
    {
      name: "email",
      label: "Email",
      options: { filter: true, sort: true },
    },
    {
      name: "status",
      label: "Status",
      options: { filter: true, sort: false },
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
    rowsPerPage,
    page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/field-team?page=${currentPage + 1}`);
    },
    onRowClick: (rowData, rowMeta) => {
      const id = fieldTeamData[rowMeta.dataIndex].id;
      toogleViewServiceSub(true, id)();
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

      {/* Transfer Team Dialog */}
      <Dialog open={transferDialogOpen} onClose={() => setTransferDialogOpen(false)}>
        <DialogTitle>Transfer Team</DialogTitle>
        <DialogContent>
          <form id="transfer-team-form" onSubmit={onSubmit}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="service-select-label">
                Branch <span className="text-red-700">*</span>
              </InputLabel>
              <Select
                labelId="service-select-label"
                id="service-select"
                name="branch_id"
                value={team.branch_id}
                onChange={onInputChange}
                required
                sx={{ height: "40px", borderRadius: "5px" }}
              >
                {branch.map((b) => (
                  <MenuItem key={b.id} value={String(b.id)}>
                    {b.branch_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            form="transfer-team-form"
            color="primary"
            disabled={isButtonDisabled}
            startIcon={loading && <CircularProgress size={20} />}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default FieldTeamMaster;
