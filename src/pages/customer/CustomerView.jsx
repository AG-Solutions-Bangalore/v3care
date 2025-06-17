import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../base/BaseUrl";
import LoaderComponent from "../../components/common/LoaderComponent";
import MUIDataTable from "mui-datatables";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import PageHeader from "../../components/common/PageHeader/PageHeader";

const CustomerView = () => {
  const { customer_name, customer_mobile } = useParams();
 const [customerListData, setCustomerListData] = useState(null);
      const [loading, setLoading] = useState(false);
  
      useEffect(() => {
        const fetchcustomerListData = async () => {
          try {
         
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.post(
              `${BASE_URL}/api/panel-fetch-customer-booking-order-list`,
              {
                order_customer:customer_name,
                order_customer_mobile:customer_mobile
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
    
            setCustomerListData(response.data?.booking);
          } catch (error) {
            console.error("Error fetching customer list data", error);
          } finally {
            setLoading(false);
          }
        };
        fetchcustomerListData();
      }, []);

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
        // rowsPerPage: 5,
        // rowsPerPageOptions: [5, 10, 25],
        responsive: "standard",
        viewColumns: true,
        download: false,
        print: false,
   
    
       
        setRowProps: (rowData) => {
          return {
            style: {
              borderBottom: "10px solid #f1f7f9",
              cursor: "pointer",
            },
          };
        },
      
       
        
      };

  return (
    <Layout>
         <PageHeader
                title="Customer Info"
                
              />
    {loading ? (
      <LoaderComponent />
    ) : (
      <div className="mt-5">
        <MUIDataTable
         
          data={customerListData ? customerListData : []}
          columns={columns}
          options={options}
        />
      </div>
    )}
  </Layout>
  );
};

export default CustomerView;
