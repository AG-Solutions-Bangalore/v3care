import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import BookingOrder from "./bookingOrders/BookingOrder";
import Cards from "./cards/Cards";
import Jobs from "./jobs/Jobs";
import Revenue from "./revenue/Revenue";
import { toast } from "react-toastify";
import DashboardGraph from "./DashboardGraph/DashboardGraph";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [graphLoading, setGraphLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  const { currentYear, userType } = useContext(ContextPanel);
  const [data, setData] = useState({});
  const [graphData, setGraphData] = useState({});

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Set default dates (first day of current month to today)
  const getDefaultDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return {
      fromDate: formatDate(firstDay),
      toDate: formatDate(now)
    };
  };

  // Fetch branch list
  const fetchBranches = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/panel-fetch-branch-list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data && response.data.branch) {
        const branchList = response.data.branch;
        setBranches(branchList);
        // Select first branch by default
        if (branchList.length > 0) {
          const firstBranchId = branchList[0].id.toString();
          setSelectedBranch(firstBranchId);
          
          // Set default dates and fetch graph data for first branch
          const defaultDates = getDefaultDates();
          setFromDate(defaultDates.fromDate);
          setToDate(defaultDates.toDate);
        }
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to fetch branch list");
    }
  };

  // Fetch main dashboard data
  const fetchData = async () => {
    if (currentYear) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-dashboard-data/${currentYear}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching booking data:", error);
        toast.error("Failed to fetch dashboard data");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch graph data
  const fetchGraphData = async (branchId, fromDate, toDate) => {
    if (!branchId) {
      toast.error("Please select a branch");
      return;
    }
    
    setGraphLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-fetch-dashboard-data-new`,
        {
          branch_id: branchId,
          from_date: fromDate,
          to_date: toDate
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setGraphData(response.data);
    } catch (error) {
      console.error("Error fetching graph data:", error);
      toast.error("Failed to fetch graph data");
    } finally {
      setGraphLoading(false);
    }
  };

  // Handle graph filter change
  const handleGraphFilterChange = (branchId, fromDate, toDate) => {
    if (!branchId) {
      toast.error("Please select a branch");
      return;
    }
    setSelectedBranch(branchId);
    setFromDate(fromDate);
    setToDate(toDate);
    fetchGraphData(branchId, fromDate, toDate);
  };

  // Initialize
  useEffect(() => {
    fetchData();
    fetchBranches();
  }, [currentYear]);

  // Fetch graph data when dates or branch changes
  useEffect(() => {
    if (selectedBranch && fromDate && toDate) {
      fetchGraphData(selectedBranch, fromDate, toDate);
    }
  }, [selectedBranch, fromDate, toDate]);

  return (
    <Layout>
      <div className="p-2">
        <div className="mt-2">
          <Cards datas={data} loading={loading} />
        </div>
        
        <div className="mt-4">
          <DashboardGraph
            graphData={graphData?.graph || []}
            graph2Data={graphData?.graph2 || []}
            branches={branches}
            selectedBranch={selectedBranch}
            fromDate={fromDate}
            toDate={toDate}
            isLoadingdashboord={graphLoading}
            isErrordashboord={false}
            refetchdashboord={() => fetchGraphData(selectedBranch, fromDate, toDate)}
            handleChange={handleGraphFilterChange}
          />
        </div>
        
        <div className={`grid gap-4 ${userType == 8 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          <div className="mt-4">
            <Jobs loading={loading} datas={data} userType={userType} />
          </div>
          {userType == 8 && (
            <div className="mt-4">
              <Revenue loading={loading} datas={data} userType={userType} />
            </div>
          )}
        </div>

        <div className="mt-4">
          <BookingOrder loading={loading} datas={data} fetchData={fetchData} />
        </div>
      </div>
    </Layout>
  );
};

export default Home;