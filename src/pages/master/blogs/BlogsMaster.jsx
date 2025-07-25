import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import MasterFilter from "../../../components/MasterFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, BLOGS_IMAGE, NO_IMAGE_URL } from "../../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { SquarePen } from "lucide-react";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import UpdateSuperServiceSort from "../../../components/common/UpdateSuperServiceSort";
import { BiSort } from "react-icons/bi";

const BlogsMaster = () => {
  const [blogsData, setBlogsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    if (pageParam) {
      setPage(parseInt(pageParam) - 1);
    } else {
      const storedPageNo = localStorage.getItem("page-no");
      if (storedPageNo) {
        setPage(parseInt(storedPageNo) - 1);
        navigate(`/blogs?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);
  UseEscapeKey();

  const fetchClientData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-blog-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogsData(response.data?.blogs);
    } catch (error) {
      console.error("Error fetching blogs data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClientData();
  }, []);

  const handleEdit = (e, id) => {
    e.stopPropagation();

    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/blogs-edit/${id}`);
  };
  const handleOpenDialog = ({ e, id }) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedBlog({ id });
    setIsDialogOpen(true);
  };
  const columns = [
    {
      name: "id",
      label: "ACTION",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              {userType !== "4" && (
                <div
                  onClick={(e) => handleEdit(e, id)}
                  className="flex items-center space-x-2"
                >
                  <SquarePen className="h-5 w-5 cursor-pointer hover:text-blue-700">
                    <title>Edit Blog</title>
                  </SquarePen>
                </div>
              )}

              <div
                onClick={(e) => handleOpenDialog({ e, id })}
                className="flex items-center space-x-2"
                title="Edit  Blog Order"
              >
                <BiSort className="h-5 w-5 cursor-pointer hover:text-blue-700" />
              </div>
            </div>
          );
        },
      },
    },
    {
      name: "blogs_sorting",
      label: "Sorting",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "blogs_image",
      label: "IMAGE",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (image) => {
          const imageUrl = image
            ? `${BLOGS_IMAGE}/${image}?t=${new Date().getTime()}`
            : `${NO_IMAGE_URL}`;
          return (
            <img
              src={imageUrl}
              alt="blogs"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          );
        },
      },
    },

    {
      name: "blogs_heading",
      label: "Heading",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "blogs_status",
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
    count: blogsData?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/blogs?page=${currentPage + 1}`);
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
              label="blogs"
              onClick={() => navigate("/blogs-create")}
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
  const handleUpdateSort = async ({ id, newSortNumber }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/panel-update-blog-sort/${id}`,
        { newSortNumber },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status == 200) {
        fetchClientData();
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
  return (
    <Layout>
      <MasterFilter />
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title="Blogs List"
            data={blogsData ? blogsData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
      <UpdateSuperServiceSort
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleUpdateSort}
        data={selectedBlog}
      />
    </Layout>
  );
};

export default BlogsMaster;
