import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import {
  Card,
  Input,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button
} from "@material-tailwind/react";
import { FaCalendarAlt, FaUserCheck, FaUserClock, FaUsers, FaMapMarkerAlt, FaPhone, FaTimes } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../base/BaseUrl";
import IdealFieldListFilter from "../../components/IdealFieldListFilter";
import UseEscapeKey from "../../utils/UseEscapeKey";
import LoaderComponent from "../../components/common/LoaderComponent";
import { months } from "moment/moment";

const IdealFieldList = () => {
  UseEscapeKey();
  const today = new Date();
  const [idealData, setIdealData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  );
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("ALL");
  const [activeTab, setActiveTab] = useState("all");
  
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  

  const [fromDate, setFromDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`
  );
  const [toDate, setToDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  );

  useEffect(() => {
    const fetchIdealData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${BASE_URL}/api/panel-fetch-ideal-field`,
          { from_date: selectedDate },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sortedData = response.data?.stock.sort((a, b) =>
          a.branch_name.localeCompare(b.branch_name)
        );
        setIdealData(sortedData);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIdealData();
  }, [selectedDate]);

  const uniqueBranches = Array.from(new Set(idealData.map(item => item.branch_name)));

  const filteredData = idealData
    .filter(data => selectedBranch === "ALL" || data.branch_name === selectedBranch)
    .filter(data => {
      if (activeTab === "all") return true;
      if (activeTab === "assigned") return data.o_id !== "0";
      if (activeTab === "unassigned") return data.o_id === "0";
      return true;
    });

  const getCardStyle = (o_id) => {
    return o_id !== "0" 
      ? {
          bg: "bg-green-100",
          border: "border-green-100",
          accent: "bg-green-200",
          textPrimary: "text-black/70",
          textSecondary: "text-black/80",
          shadow: "shadow-green-50"
        }
      : {
          bg: "bg-red-100",
          border: "border-red-100",
          accent: "bg-red-200",
          textPrimary: "text-black/70",
          textSecondary: "text-black/80",
          shadow: "shadow-red-50"
        };
  };

  const handleCardClick = (data) => {
    setSelectedUser(data);
    setIsModalOpen(true);
    setOrderData([]);
  };

  const handleModalSubmit = async () => {
    try {
      setModalLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/panel-fetch-ideal-field-details`,
        {
          from_date: fromDate,
          to_date: toDate,
          user_id: selectedUser.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrderData(response.data?.data || []);
      
    
      setTimeout(() => {
        initializeCalendar();
      }, 100);
      
    } catch (error) {
      console.error("Error fetching order data", error);
    } finally {
      setModalLoading(false);
    }
  };

  const initializeCalendar = () => {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

   
    calendarEl.innerHTML = '';

   
    const serviceDates = orderData.map(order => order.order_service_date);

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      height: 'auto',
      contentHeight: 'auto',
      aspectRatio: 1.5,
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: ''
      },
      events: serviceDates.map(date => ({
        title: 'Service',
        date: date,
        backgroundColor: '#10b981',
        borderColor: '#10b981',
        display: 'background'
      })),
      dayCellDidMount: function(info) {
        const dateStr = info.date.toISOString().split('T')[0];
        if (serviceDates.includes(dateStr)) {
          info.el.style.backgroundColor = '#dcfce7';
          info.el.style.border = '2px solid #10b981';
        }
      }
    });

    calendar.render();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setOrderData([]);
  };

  const renderCard = (data) => {
    const firstName = data.name.split(" ")[0];
    const cardStyle = getCardStyle(data.o_id);
    const isAssigned = data.o_id !== "0";

    return (
      <div 
        key={data.mobile} 
        className={`${cardStyle.bg} ${cardStyle.border} border rounded-lg p-2 ${cardStyle.shadow} shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 relative overflow-hidden cursor-pointer`}
        onClick={() => handleCardClick(data)}
      >
        <div className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md">
          <FaCalendarAlt className={`text-blue-800 text-[10px]`} />
        </div>
        
        <div className={`text-sm font-medium ${cardStyle.textPrimary} mb-1 truncate`}>
          {firstName}
        </div>

        <div className="flex items-center gap-1 mb-1">
          <FaMapMarkerAlt className={`${cardStyle.textSecondary}`} size={9} />
          <div className={`text-xs ${cardStyle.textSecondary} truncate`}>
            {data.branch_name}
          </div>
        </div>

        <div className={`text-xs font-medium ${isAssigned ? 'text-green-700' : 'text-orange-700'}`}>
          {isAssigned ? '' : ''}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <IdealFieldListFilter />
      
     
      <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.17/main.min.css" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.17/index.global.min.js"></script>
      
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className="p-2 space-y-2 bg-white mt-1">
          <Card className="p-3 bg-gray-300 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Typography variant="small" className="text-gray-700 font-medium text-xs">
                  📅 Date
                </Typography>
                <input
                  type="date"
                  labelProps={{ className: "hidden" }}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="!text-xs rounded-md px-2 bg-white border-gray-200 focus:border-blue-400 h-8 w-full"
                />
              </div>
              
              <div className="space-y-1">
                <Typography variant="small" className="text-gray-700 font-medium text-xs">
                  🏢 Branch
                </Typography>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full h-8 text-xs bg-white border border-gray-200 rounded-md px-2 focus:border-blue-400 focus:outline-none"
                >
                  <option value="ALL">All Branches</option>
                  {uniqueBranches.map((branch, index) => (
                    <option key={index} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1">
                <Typography variant="small" className="text-gray-700 font-medium text-xs">
                  📊 Status
                </Typography>
                <div className="flex bg-white rounded-md border border-gray-200 h-8">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`flex-1 text-xs px-2 py-1 rounded-l-md flex items-center justify-center gap-1 transition-colors ${
                      activeTab === "all" 
                        ? "bg-blue-500/80 text-white" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FaUsers size={10} />
                    <span>All</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("assigned")}
                    className={`flex-1 text-xs px-2 py-1 flex items-center justify-center gap-1 transition-colors ${
                      activeTab === "assigned" 
                        ? "bg-green-500 text-white" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FaUserCheck size={10} />
                    <span>Assigned</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("unassigned")}
                    className={`flex-1 text-xs px-2 py-1 rounded-r-md flex items-center justify-center gap-1 transition-colors ${
                      activeTab === "unassigned" 
                        ? "bg-red-500 text-white" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FaUserClock size={10} />
                    <span>Unassigned</span>
                  </button>
                </div>
                <p className="text-xs px-2 text-gray-900 mt-1 flex gap-4 items-center">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    Assigned
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                    Unassigned
                  </span>
                </p>
              </div>
            </div>
          </Card>

          {filteredData.length === 0 ? (
            <Card className="p-6 text-center bg-gray-50 border border-gray-100">
              <div className="text-gray-400 mb-2">
                <FaUsers size={20} className="mx-auto" />
              </div>
              <Typography variant="small" className="text-gray-600 font-medium">
                No data found for selected filters
              </Typography>
              <Typography variant="small" className="text-gray-500 text-xs mt-1">
                Try adjusting your filters or selecting a different date
              </Typography>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
              {filteredData.map((data) => renderCard(data))}
            </div>
          )}
        </div>
      )}

    
<Dialog open={isModalOpen} handler={closeModal} size="xl" className="bg-white">
  <DialogHeader className="flex items-center justify-between p-3 border-b">
    <div>
      <Typography variant="h6" color="blue-gray">
        {selectedUser?.name}
      </Typography>
      <Typography variant="small" color="gray" className="font-normal text-xs">
        {selectedUser?.branch_name} | {selectedUser?.mobile}
      </Typography>
    </div>
    
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Typography variant="small" color="blue-gray" className="font-medium text-xs whitespace-nowrap">
            From:
          </Typography>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-28 p-1 text-xs border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <div className="flex items-center gap-1">
          <Typography variant="small" color="blue-gray" className="font-medium text-xs whitespace-nowrap">
            To:
          </Typography>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-28 p-1 text-xs border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      
      <Button
        onClick={handleModalSubmit}
        disabled={modalLoading}
        className="bg-blue-500 hover:bg-blue-600 text-xs py-1 px-2"
        size="sm"
      >
        {modalLoading ? "..." : "Go"}
      </Button>
      
      <Button
        variant="text"
        color="blue-gray"
        onClick={closeModal}
        className="p-1 rounded-full"
      >
        <FaTimes size={14} />
      </Button>
    </div>
  </DialogHeader>
  
  <DialogBody className="p-0">
    {modalLoading ? (
      <div className="flex justify-center items-center h-96">
      <div className="flex justify-center items-center h-96">
    <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
      </div>
    ) : orderData.length > 0 ? (
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[650px]">
     
        <div className="border-r border-gray-200 p-4 h-full overflow-hidden">
          <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
            Service Calendar
          </Typography>
          <div id="calendar" className="h-[calc(100%-24px)]"></div>
        </div>
        

        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="small" color="blue-gray" className="font-medium">
              Orders Summary
            </Typography>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {orderData.length} orders
            </span>
          </div>
          <div className="flex-1 overflow-y-auto text-xs border border-gray-200 rounded-lg">
            {orderData.map((order, index) => (
              <div key={order.id} className="p-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate">{order.order_service}</span>
                  <span className="text-green-600 font-medium whitespace-nowrap">₹{order.order_amount}</span>
                </div>
                <div className="text-gray-700 mt-1">
                  <div className="truncate">{order.order_customer}</div>
                  <div className="flex justify-between text-xs">
                    <span>{order.order_service_date}</span>
                    <span className="text-blue-600">{order.order_ref}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="flex justify-center items-center h-96">
        <Card className="p-4 text-center bg-gray-50 border border-gray-100">
          <div className="text-gray-400 mb-2">
            <FaCalendarAlt size={20} className="mx-auto" />
          </div>
          <Typography variant="small" className="text-gray-600 font-medium">
            No orders found for selected date range
          </Typography>
          <Typography variant="small" className="text-gray-500 text-xs mt-1">
            Try selecting a different date range
          </Typography>
        </Card>
      </div>
    )}
  </DialogBody>
</Dialog>
    </Layout>
  );
};

export default IdealFieldList;