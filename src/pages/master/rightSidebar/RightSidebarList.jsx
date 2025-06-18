import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { ContextPanel } from "../../../utils/ContextPanel";
import axios from "axios";
import { BASE_URL, NO_IMAGE_URL, RIGHTSIDEBAR_IMAGE, SERVICE_IMAGE_URL } from "../../../base/BaseUrl";
import { FaEdit } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward, IoMdPeople } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { FiUserPlus, FiUsers } from "react-icons/fi";
import { RiEditLine } from "react-icons/ri";
import { toast } from "react-toastify";
import UseEscapeKey from "../../../utils/UseEscapeKey";
import { SquarePen } from "lucide-react";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import MasterFilter from "../../../components/MasterFilter";

const RightSidebarList = () => {
    const [rightSidebarListData, setRightSidebarListData] = useState(null);
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
                navigate(`/right-sidebar-content?page=${storedPageNo}`);
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
            const fetchrightSidebarListData = async () => {
              try {
             
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await axios.get(
                  `${BASE_URL}/api/panel-fetch-service-details-list`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
        
                setRightSidebarListData(response.data?.servicedetails);
              } catch (error) {
                console.error("Error fetching right sidebar list data", error);
              } finally {
                setLoading(false);
              }
            };
            fetchrightSidebarListData();
          }, []);
        
         
        
          // const handleViewCustomerInfo = (e, orderCustomer,orderMobile) => {
          //   e.preventDefault();
          //   e.stopPropagation();
          //   localStorage.setItem("page-no", pageParam);
          //   navigate(`/customer-view/${encodeURIComponent(orderCustomer)}/${orderMobile}`);
          // };
          const handleEdit = (e, id) => {
            e.preventDefault();
            e.stopPropagation();
            localStorage.setItem("page-no", pageParam);
            navigate(`/right-sidebar-content-edit/${id}`);
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
                    <div
                      onClick={(e) => handleEdit(e, id)}
                      className="flex items-center space-x-2"
                    >
                      <SquarePen className="h-5 w-5 cursor-pointer hover:text-blue-700">
                        <title>Edit Right Sidebar</title>
                      </SquarePen>
                    </div>
                  );
                },
              },
            },
            {
              name: "serviceDetails_image",
              label: "IMAGE",
              options: {
                filter: true,
                sort: false,
                customBodyRender: (image) => {
                  const imageUrl = image
                    ? `${RIGHTSIDEBAR_IMAGE}/${image}`
                    : `${NO_IMAGE_URL}`;
                  return (
                    <img
                      src={imageUrl}
                      alt="Right Sidebar"
                      loading="lazy"
                      decoding="async"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                  );
                },
              },
            },
            {
              name: "serviceDetails_name",
              label: "Name",
              options: {
                filter: true,
                sort: true,
              },
            },
            {
              name: "serviceDetails",
              label: "Details",
              options: {
                filter: true,
                sort: true,
              },
            },
       
            {
              name: "serviceDetails_status",
              label: "Status",
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
            count: rightSidebarListData?.length || 0,
            rowsPerPage: rowsPerPage,
            page: page,
        
            onChangePage: (currentPage) => {
              setPage(currentPage);
              navigate(`/right-sidebar-content?page=${currentPage + 1}`);
            },
            setRowProps: (rowData) => {
              return {
                style: {
                  borderBottom: "10px solid #f1f7f9",
                  cursor: "pointer",
                },
              };
            },
            // onRowClick: (rowData, rowMeta, e) => {
            //   const orderCustomer = rightSidebarListData[rowMeta.dataIndex].order_customer;
            //   const orderMobile = rightSidebarListData[rowMeta.dataIndex].order_customer_mobile;
            //   handleViewCustomerInfo(e, orderCustomer,orderMobile);
            // },
            customToolbar: () => {
              return (
                <>
                 
        
                  {( userType == "8") && (
                    <ButtonConfigColor
                      type="create"
                      label="Right Sidebar"
                      className="space-x-4"
                      onClick={() => navigate("/add-right-sidebar-content")}
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
          <>
          
          <div className='mt-1 bg-white p-2 rounded-sm'>
          <LoaderComponent />
        </div>
           </>
         ) : (
           <div className="mt-1">
             <MUIDataTable
               title="Right Sidebar Content"
               data={rightSidebarListData ? rightSidebarListData : []}
               columns={columns}
               options={options}
             />
           </div>
         )}
       </Layout>
  )
}

export default RightSidebarList