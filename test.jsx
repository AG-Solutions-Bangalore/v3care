import axios from "axios";
import { SquarePen } from "lucide-react";
import MUIDataTable from "mui-datatables";
import React, { useContext, useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../base/BaseUrl";
import ButtonConfigColor from "../../../components/common/ButtonConfig/ButtonConfigColor";
import LoaderComponent from "../../../components/common/LoaderComponent";
import MasterFilter from "../../../components/MasterFilter";
import Layout from "../../../layout/Layout";
import { ContextPanel } from "../../../utils/ContextPanel";
import UseEscapeKey from "../../../utils/UseEscapeKey";

const GroupBookingView = (groupbooking) => {
  console.log(groupbooking.groupbooking, "groupbookinggroupbooking");
  const [loading, setLoading] = useState(false);
  const { isPanelUp, userType } = useContext(ContextPanel);
  const navigate = useNavigate();
  //
  const location = useLocation();
  const [page, setPage] = useState(0);
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

  const handleEdit = (e, id) => {
    e.preventDefault();
    localStorage.setItem("page-no", pageParam);
    navigate(`/refer-by-edit/${id}`);
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
            <>
              {userType !== "4" && (
                <>
                  <div
                    onClick={(e) => handleEdit(e, id)}
                    className="flex items-center space-x-2"
                  >
                    <SquarePen className="h-5 w-5 cursor-pointer hover:text-blue-700">
                      <title>Booking Info</title>
                    </SquarePen>
                  </div>
                </>
              )}
            </>
          );
        },
      },
    },
    {
      name: "branch_name",
      label: "Branch Name",
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
    count: groupbooking.groupbooking?.length || 0,
    page: page,
  };

  return (
    <Layout>
      <MasterFilter />

      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="mt-1">
          <MUIDataTable
            title="Group Booking List"
            data={groupbooking.groupbooking ?? []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default GroupBookingView;
