import axios from "axios";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../base/BaseUrl";
import LoaderComponent from "../../components/common/LoaderComponent";
import Layout from "../../layout/Layout";
import UseEscapeKey from "../../utils/UseEscapeKey";

const CustomerList = () => {
     const [customerListData, setCustomerListData] = useState(null);
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
            navigate(`/customer?page=${storedPageNo}`);
          } else {
            localStorage.setItem("page-no", 1);
            setPage(0);
          }
        }
      }, [location]);
      const navigate = useNavigate();
      UseEscapeKey();
      useEffect(() => {
        const fetchcustomerListData = async () => {
          try {
         
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(
              `${BASE_URL}/api/panel-fetch-booking-customer-list`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
    
            setCustomerListData(response.data?.bookingCustomer);
          } catch (error) {
            console.error("Error fetching customer list data", error);
          } finally {
            setLoading(false);
          }
        };
        fetchcustomerListData();
      }, []);
    
     
    
      const handleViewCustomerInfo = (e, orderCustomer,orderMobile) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem("page-no", pageParam);
        navigate(`/customer-view/${encodeURIComponent(orderCustomer)}/${orderMobile}`);
      };
   
      const columns = [
       
        {
          name: "branch_name",
          label: "Branch",
          options: {
            filter: true,
            sort: true,
          },
        },
        {
          name: "order_customer",
          label: "Customer Name",
          options: {
            filter: true,
            sort: true,
          },
        },
   
        {
          name: "order_customer_mobile",
          label: "Mobile",
          options: {
            filter: true,
            sort: true,
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
        count: customerListData?.length || 0,
        rowsPerPage: rowsPerPage,
        page: page,
    
        onChangePage: (currentPage) => {
          setPage(currentPage);
          navigate(`/customer?page=${currentPage + 1}`);
        },
        setRowProps: () => {
          return {
            style: {
              borderBottom: "10px solid #f1f7f9",
              cursor: "pointer",
            },
          };
        },
        onRowClick: (rowData, rowMeta, e) => {
          const orderCustomer = customerListData[rowMeta.dataIndex].order_customer;
          const orderMobile = customerListData[rowMeta.dataIndex].order_customer_mobile;
          handleViewCustomerInfo(e, orderCustomer,orderMobile);
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
         {loading ? (
           <div className="mt-5">
            <LoaderComponent />
           </div>
         ) : (
           <div className="mt-5">
             <MUIDataTable
               title="Customer List"
               data={customerListData ? customerListData : []}
               columns={columns}
               options={options}
             />
           </div>
         )}
       </Layout>
  )
}

export default CustomerList