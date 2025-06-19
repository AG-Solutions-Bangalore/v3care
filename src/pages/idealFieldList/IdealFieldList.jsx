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
import { FaCalendarAlt, FaUserCheck, FaUserClock, FaUsers, FaMapMarkerAlt, FaPhone, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { BASE_URL } from "../../base/BaseUrl";
import IdealFieldListFilter from "../../components/IdealFieldListFilter";
import UseEscapeKey from "../../utils/UseEscapeKey";
import LoaderComponent from "../../components/common/LoaderComponent";

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
  
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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
    
    
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    
   
    fetchMonthData(now.getMonth(), now.getFullYear(), data.id);
  };

  const fetchMonthData = async (month, year, userId) => {
    try {
      setModalLoading(true);
      const token = localStorage.getItem("token");
      

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const fromDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const toDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;
      
      const response = await axios.post(
        `${BASE_URL}/api/panel-fetch-ideal-field-details`,
        {
          from_date: fromDate,
          to_date: toDate,
          user_id: userId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrderData(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching order data", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handlePrevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear = currentYear - 1;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    fetchMonthData(newMonth, newYear, selectedUser.id);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear = currentYear + 1;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    fetchMonthData(newMonth, newYear, selectedUser.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setOrderData([]);
  };

  const renderCustomCalendar = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    

    const serviceDates = orderData.map(order => order.order_service_date);
    

    const serviceCount = serviceDates.length;
    const nonServiceCount = daysInMonth - serviceCount;
    

    const days = [];
    
   
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
   
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const hasService = serviceDates.includes(dateStr);
      
      days.push(
        <div 
          key={`day-${day}`}
          className={`h-10 w-10 flex items-center justify-center rounded-full text-sm
            ${hasService ? 'bg-green-100 text-green-800 border border-green-300' : 'text-gray-600'}`}
        >
          {day}
        </div>
      );
    }
    
    // comaparision of the date 
    const now = new Date();
    const currentMonthNow = now.getMonth();
    const currentYearNow = now.getFullYear();
    const isCurrentMonth = currentYear === currentYearNow && currentMonth === currentMonthNow;

    return (
      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <Button
            variant="text"
            size="sm"
            onClick={handlePrevMonth}
            className="p-1 rounded-full"
          >
            <FaChevronLeft size={14} />
          </Button>
          
          <Typography variant="h6" className="font-medium">
            {monthNames[currentMonth]} {currentYear}
          </Typography>
          
          <Button
            variant="text"
            size="sm"
            onClick={handleNextMonth}
            className="p-1 rounded-full"
            disabled={isCurrentMonth && now.getDate() < daysInMonth}
          >
            <FaChevronRight size={14} />
          </Button>
        </div>
        
      
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>
        
     
        <div className="grid grid-cols-7 gap-1 mb-4">
          {days}
        </div>
        
       
        {/* <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <Typography variant="small" className="text-xs">
              Service Days: {serviceCount}
            </Typography>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <Typography variant="small" className="text-xs">
              Non-Service Days: {nonServiceCount}
            </Typography>
          </div>
        </div> */}
      </div>
    );
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
                    <span className="inline-block w-2 h-2 rounded-full bg-red-200"></span>
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

      <Dialog open={isModalOpen} handler={closeModal} size="xs" className="bg-white">
        <DialogHeader className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Typography variant="h6" color="blue-gray">
              {selectedUser?.name}
            </Typography>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <Typography variant="small" className="text-xs">
              {new Set(orderData.map(order => order.order_service_date)).size}
              </Typography>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <Typography variant="small" className="text-xs">
              {new Date(currentYear, currentMonth + 1, 0).getDate() - new Set(orderData.map(order => order.order_service_date)).size}
              </Typography>
            </div>
            <Typography variant="small" color="gray" className="font-normal text-xs">
             |  {selectedUser?.branch_name} 
            </Typography>
          </div>
          
          <Button
            variant="text"
            color="blue-gray"
            onClick={closeModal}
            className="p-1 rounded-full"
          >
            <FaTimes size={14} />
          </Button>
        </DialogHeader>
        
        <DialogBody className="p-4">
          {modalLoading ? (
            <div className="flex justify-center items-center h-80">
              <div className="w-8 h-8 border-2 border-t-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-0">
              <div className="flex justify-center">
                {renderCustomCalendar()}
              </div>
              
              {orderData.length === 0 && (
                <div className="flex justify-center items-center ">
                  <div className="p-1 rounded-lg text-center bg-gray-50 border border-gray-100">

                    <span className="text-red-900 text-xs font-medium">
                      No jobs found for selected month
                    </span>
                   
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogBody>
      </Dialog>
    </Layout>
  );
};

export default IdealFieldList;