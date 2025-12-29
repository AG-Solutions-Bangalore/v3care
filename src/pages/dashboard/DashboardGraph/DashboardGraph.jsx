import React, { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ChevronDown, Loader2, BarChart3, PieChart, TrendingUp, Building, Calendar } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const transformBarData = (graphData = []) => {
  if (!Array.isArray(graphData)) return [];

  const branchMap = {};
  
  graphData.forEach(item => {
    const { branch_name, order_status, order_count } = item;
    
    if (!branchMap[branch_name]) {
      branchMap[branch_name] = {};
    }
    
    branchMap[branch_name][order_status] = order_count;
  });

  const statuses = [...new Set(graphData.map(item => item.order_status))];
  const branches = Object.keys(branchMap);
  
  return {
    branches,
    statuses,
    data: branchMap
  };
};

const transformPieData = (graphData = []) => {
  if (!Array.isArray(graphData)) return [];
  
  const statusMap = {};
  
  graphData.forEach(item => {
    const { order_status, order_count } = item;
    statusMap[order_status] = (statusMap[order_status] || 0) + order_count;
  });
  
  return Object.entries(statusMap).map(([status, count]) => ({
    status,
    count
  }));
};

const transformGraph2BarData = (graph2Data = []) => {
  if (!Array.isArray(graph2Data)) return { labels: [], datasets: [] };

  // Group data by month and status
  const monthData = {};
  const statuses = new Set();
  
  graph2Data.forEach(item => {
    const monthKey = item.order_month_name || item.order_year_month;
    const status = item.order_status;
    const count = item.order_count;
    
    statuses.add(status);
    
    if (!monthData[monthKey]) {
      monthData[monthKey] = {};
    }
    
    monthData[monthKey][status] = (monthData[monthKey][status] || 0) + count;
  });

  // Sort months chronologically
  const months = Object.keys(monthData).sort((a, b) => {
    const monthOrder = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const yearMonthOrder = (month) => {
      // Handle YYYY-MM format
      if (month.includes('-')) {
        const [year, monthNum] = month.split('-');
        return parseInt(year) * 100 + parseInt(monthNum);
      }
      // Handle month names
      return monthOrder.indexOf(month) + 1;
    };
    return yearMonthOrder(a) - yearMonthOrder(b);
  });

  const allStatuses = Array.from(statuses);
  
  // Create datasets for each status
  const datasets = allStatuses.map((status, index) => {
    const colors = [
      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
      "#FF9F40", "#8AC926", "#1982C4", "#6A4C93", "#FF595E",
      "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"
    ];
    
    return {
      label: status,
      data: months.map(month => monthData[month][status] || 0),
      backgroundColor: colors[index % colors.length],
      borderRadius: 6,
    };
  });

  return {
    labels: months,
    datasets
  };
};

const DashboardGraph = ({
  graphData = [],
  graph2Data = [],
  branches = [],
  selectedBranch = "",
  fromDate = "",
  toDate = "",
  handleChange,
  isLoadingdashboord,
  isErrordashboord,
  refetchdashboord,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [localFromDate, setLocalFromDate] = useState(fromDate);
  const [localToDate, setLocalToDate] = useState(toDate);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Update local dates when props change
  useEffect(() => {
    setLocalFromDate(fromDate);
    setLocalToDate(toDate);
  }, [fromDate, toDate]);

  // Handle apply filter
  const handleApplyFilter = () => {
    if (!selectedBranch) {
      alert("Please select a branch first");
      return;
    }
    if (handleChange) {
      handleChange(selectedBranch, localFromDate, localToDate);
    }
  };

  const barData = transformBarData(graphData);
  const pieData = transformPieData(graphData);
  const graph2BarData = transformGraph2BarData(graph2Data);

  // First Bar Chart Configuration (graph)
  const barChartData = {
    labels: barData.branches || [],
    datasets: barData.statuses?.map((status, index) => {
      const colors = [
        "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
        "#FF9F40", "#8AC926", "#1982C4", "#6A4C93", "#FF595E"
      ];
      
      return {
        label: status,
        data: barData.branches?.map(branch => barData.data[branch]?.[status] || 0) || [],
        backgroundColor: colors[index % colors.length],
        borderRadius: 6,
      };
    }) || []
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: true,
        position: 'top'
      } 
    },
    scales: {
      x: {
        stacked: false,
        title: {
          display: true,
          text: 'Branches'
        }
      },
      y: {
        stacked: false,
        title: {
          display: true,
          text: 'Order Count'
        },
        beginAtZero: true
      }
    }
  };

  // Second Bar Chart Configuration (graph2)
  const graph2BarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: true,
        position: 'top'
      } 
    },
    scales: {
      x: {
        stacked: false,
        title: {
          display: true,
          text: 'Months'
        }
      },
      y: {
        stacked: false,
        title: {
          display: true,
          text: 'Order Count'
        },
        beginAtZero: true
      }
    }
  };

  // Pie Chart Configuration
  const pieTotal = pieData.reduce((a, b) => a + b.count, 0);
  const pieChartData = {
    labels: pieData.map(d => d.status),
    datasets: [
      {
        data: pieData.map(d => d.count),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
          "#FF9F40", "#8AC926", "#1982C4", "#6A4C93", "#FF595E"
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "55%",
    plugins: { 
      legend: { 
        display: false 
      } 
    },
  };

  return (
    <div className="border rounded-lg w-full bg-white shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-t-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="font-bold text-gray-800 text-xl flex items-center gap-2">
              <BarChart3 className="text-blue-600" />
              Booking Analytics Dashboard
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Branch-wise orders, status distribution & monthly trends
            </p>
          </div>

          {/* Filters */}
          <div className="w-full lg:w-auto">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Branch Select - No "All Branches" option */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building className="inline w-4 h-4 mr-1" />
                  Branch *
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => {
                    const branchId = e.target.value;
                    if (branchId && handleChange) {
                      handleChange(branchId, localFromDate, localToDate);
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoadingdashboord || branches.length === 0}
                >
                  <option value="" disabled>Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branch_name}
                    </option>
                  ))}
                </select>
                {branches.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">No branches available</p>
                )}
              </div>

              {/* From Date */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  From Date
                </label>
                <input
                  type="date"
                  value={localFromDate}
                  onChange={(e) => setLocalFromDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoadingdashboord}
                />
              </div>

              {/* To Date */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  To Date
                </label>
                <input
                  type="date"
                  value={localToDate}
                  onChange={(e) => setLocalToDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoadingdashboord}
                />
              </div>

              {/* Apply Button */}
              <div className="flex items-end">
                <button
                  onClick={handleApplyFilter}
                  disabled={isLoadingdashboord || !selectedBranch}
                  className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoadingdashboord ? (
                    <Loader2 className="animate-spin w-4 h-4 mx-2" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoadingdashboord ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 w-8 h-8 mb-4" />
            <p className="text-gray-600">Loading chart data...</p>
          </div>
        ) : isErrordashboord ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-semibold mb-2">
              Failed to load data
            </p>
            <button
              onClick={refetchdashboord}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* First Row: Bar Chart and Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* First Bar Chart (graph) */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="text-blue-600 w-5 h-5" />
                  Orders by Branch & Status
                </h3>
                <div className="h-[350px]">
                  {graphData.length ? (
                    <Bar data={barChartData} options={barOptions} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <BarChart3 className="w-12 h-12 mb-2 opacity-50" />
                      <p>No branch data available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pie Chart */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <PieChart className="text-green-600 w-5 h-5" />
                  Order Status Distribution
                </h3>
                <div className="h-[350px]">
                  {pieData.length ? (
                    <>
                      <Doughnut data={pieChartData} options={pieOptions} />
                      <div className="text-center mt-4">
                        <p className="text-sm font-medium text-gray-700">
                          Total Orders: <span className="text-blue-600">{pieTotal.toLocaleString()}</span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <PieChart className="w-12 h-12 mb-2 opacity-50" />
                      <p>No status data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Second Row: Bar Chart (graph2) */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="text-purple-600 w-5 h-5" />
                Monthly Order Trends by Status
              </h3>
              <div className="h-[350px]">
                {graph2Data.length ? (
                  <Bar data={graph2BarData} options={graph2BarOptions} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <TrendingUp className="w-12 h-12 mb-2 opacity-50" />
                    <p>No monthly trend data available</p>
                  </div>
                )}
              </div>
              {graph2Data.length > 0 && (
                <div className="mt-4 text-sm text-gray-600 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <p>Showing data from <span className="font-medium">{fromDate}</span> to <span className="font-medium">{toDate}</span></p>
                  <p>Total months: <span className="font-medium">{graph2BarData.labels.length}</span></p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardGraph;