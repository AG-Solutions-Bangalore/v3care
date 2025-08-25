import axios from "axios";
import Moment from "moment";
import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../base/BaseUrl";
import LoaderComponent from "../../components/common/LoaderComponent";
import Layout from "../../layout/Layout";
import UseEscapeKey from "../../utils/UseEscapeKey";

const WebEnquiry = () => {
  const [webenquirydata, setWEbEnquiryData] = useState(null);
  const [loading, setLoading] = useState(false);
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
        navigate(`/web-enquiry?page=${storedPageNo}`);
      } else {
        localStorage.setItem("page-no", 1);
        setPage(0);
      }
    }
  }, [location]);

  UseEscapeKey();

  useEffect(() => {
    const fetchWebEnquiryData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-web-enquiry-contact-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWEbEnquiryData(response.data?.enquiry);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWebEnquiryData();
  }, []);

  const columns = [
    {
      name: "webEnquiry_created",
      label: "Created",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "fullname",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "mobile_no",
      label: "Mobile No",
      options: {
        filter: true,
        sort: false,
      },
    },

    {
      name: "email_id",
      label: "Email",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "description",
      label: "Description",
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
    count: webenquirydata?.length || 0,
    rowsPerPage: rowsPerPage,
    page: page,
    onChangePage: (currentPage) => {
      setPage(currentPage);
      navigate(`/web-enquiry?page=${currentPage + 1}`);
    },
    setRowProps: () => {
      return {
        style: {
          borderBottom: "5px solid #f1f7f9",
        },
      };
    },
  };

  return (
    <Layout>
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title="Web Enquiry"
            data={webenquirydata ?? []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default WebEnquiry;
