import {
  Button,
  Card,
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaTimes,
  FaUserCheck,
  FaUserClock,
  FaUsers,
  FaCalendarCheck,
  FaListUl,
  FaPencilAlt,
} from "react-icons/fa";
import { BASE_URL } from "../../base/BaseUrl";
import LoaderComponent from "../../components/common/LoaderComponent";
import IdealFieldListFilter from "../../components/IdealFieldListFilter";
import Layout from "../../layout/Layout";
import UseEscapeKey from "../../utils/UseEscapeKey";
import CreateAttendanceDialog from "./AddtendanceMark";
import EmployeeMultiSelect from "../../components/common/EmployeeMultiSelect";
import moment from "moment";

const IdealFieldList = () => {
  UseEscapeKey();
  const today = new Date();
  const [idealData, setIdealData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(today.getDate()).padStart(2, "0")}`,
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
  const [attendanceView, setAttendanceView] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceMonth, setAttendanceMonth] = useState(today.getMonth());
  const [attendanceYear, setAttendanceYear] = useState(today.getFullYear());
  const [branches, setBranches] = useState([]);
  const [openAttendance, setOpenAttendance] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [attendanceFromDate, setAttendanceFromDate] = useState("");
  const [attendanceToDate, setAttendanceToDate] = useState("");
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
        },
      );

      const stockData = response?.data?.stock || [];
      const otherData = response?.data?.other || [];

      const mergedMap = new Map();
      stockData.forEach((item) => {
        mergedMap.set(item.id, {
          ...item,
          type: "stock",
        });
      });

      otherData.forEach((item) => {
        mergedMap.set(item.id, {
          ...item,
          type: "other",
        });
      });

      const mergedData = Array.from(mergedMap.values());

      const sortedData = mergedData
        .filter((item) => item?.branch_name)
        .sort((a, b) =>
          (a.branch_name || "").localeCompare(b.branch_name || ""),
        );

      setIdealData(sortedData);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchIdealData();
  }, [selectedDate]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/panel-fetch-branch`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBranches(response.data?.branch || []);
      } catch (error) {
        console.error("Error fetching branches", error);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    if (attendanceView) {
      fetchAttendanceData();
    }
  }, [
    attendanceView,
    attendanceMonth,
    attendanceYear,
    selectedBranch,
    attendanceFromDate,
    attendanceToDate,
  ]);

  const fetchAttendanceData = async () => {
    try {
      setAttendanceLoading(true);
      const token = localStorage.getItem("token");
      // const fromDate = `${attendanceYear}-${String(attendanceMonth + 1).padStart(2, "0")}-01`;
      // let toDate;
      // const now = new Date();
      // const isCurrentMonth =
      //   attendanceYear === now.getFullYear() &&
      //   attendanceMonth === now.getMonth();

      // if (isCurrentMonth) {
      //   toDate = `${attendanceYear}-${String(attendanceMonth + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      // } else {
      //   const lastDay = new Date(
      //     attendanceYear,
      //     attendanceMonth + 1,
      //     0,
      //   ).getDate();
      //   toDate = `${attendanceYear}-${String(attendanceMonth + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      // }
      const fromDate = attendanceFromDate
        ? attendanceFromDate
        : `${attendanceYear}-${String(attendanceMonth + 1).padStart(2, "0")}-01`;

      const toDate = attendanceToDate
        ? attendanceToDate
        : `${attendanceYear}-${String(attendanceMonth + 1).padStart(
            2,
            "0",
          )}-${new Date(attendanceYear, attendanceMonth + 1, 0).getDate()}`;
      let branchId = null;
      if (selectedBranch !== "ALL") {
        const selectedBranchData = branches.find(
          (b) => b.branch_name === selectedBranch,
        );
        branchId = selectedBranchData ? selectedBranchData.id : null;
      }

      const response = await axios.post(
        `${BASE_URL}/api/panel-fetch-field-attendance`,
        {
          from_date: fromDate,
          to_date: toDate,
          branch_id: branchId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const stockData = response.data?.stock || [];
      const otherData = response.data?.other || [];

      // Add type
      const formattedStock = stockData.map((item) => ({
        ...item,
        type: "stock",
      }));

      const formattedOther = otherData.map((item) => ({
        ...item,
        type: "other",
      }));

      const mergedMap = new Map();

      // First add stock
      formattedStock.forEach((item) => {
        mergedMap.set(item.id, { ...item });
      });

      // Then merge other
      formattedOther.forEach((item) => {
        if (mergedMap.has(item.id)) {
          const existing = mergedMap.get(item.id);

          // Merge dates safely
          const existingDates = existing.order_service_dates
            ? existing.order_service_dates.split(",")
            : [];

          const newDates = item.order_service_dates
            ? item.order_service_dates.split(",")
            : [];

          const mergedDates = Array.from(
            new Set([...existingDates, ...newDates]),
          ).join(",");

          mergedMap.set(item.id, {
            ...existing,
            order_service_dates: mergedDates,
            type: "other",
          });
        } else {
          mergedMap.set(item.id, { ...item });
        }
      });

      const mergedData = Array.from(mergedMap.values());

      const transformedData = transformAttendanceData(
        mergedData,
        fromDate,
        toDate,
      );

      setAttendanceData(transformedData);
    } catch (error) {
      console.error("Error fetching attendance data", error);
      setAttendanceData([]);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const transformAttendanceData = (apiData, fromDate, toDate) => {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    return apiData.map((user) => {
      const attendance = {};
      const presentDates = user.order_service_dates
        ? user.order_service_dates.split(",").map((date) => date.trim())
        : [];

      for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
        const day = currentDate.getDate();
        attendance[day] = presentDates.includes(dateStr) ? "P" : "";
      }

      const presentDays = Object.values(attendance).filter(
        (s) => s === "P",
      ).length;

      return {
        id: user.id,
        name: user.name,
        branch_name: user.branch_name,
        type: user.type,
        mobile: user.mobile,
        attendance: attendance,
        totalPresent: presentDays,
        totalDays: totalDays,
      };
    });
  };
  const handleRowClick = (row) => {
    setSelectedUserId(row.id);
    setOpenAttendance(true);
  };
  // const handleAttendancePrevMonth = () => {
  //   let newMonth = attendanceMonth - 1;
  //   let newYear = attendanceYear;

  //   if (newMonth < 0) {
  //     newMonth = 11;
  //     newYear = attendanceYear - 1;
  //   }

  //   setAttendanceMonth(newMonth);
  //   setAttendanceYear(newYear);
  // };

  // const handleAttendanceNextMonth = () => {
  //   let newMonth = attendanceMonth + 1;
  //   let newYear = attendanceYear;

  //   if (newMonth > 11) {
  //     newMonth = 0;
  //     newYear = attendanceYear + 1;
  //   }

  //   setAttendanceMonth(newMonth);
  //   setAttendanceYear(newYear);
  // };

  const handleAttendancePrevMonth = () => {
    const newMoment = moment()
      .year(attendanceYear)
      .month(attendanceMonth)
      .subtract(1, "month");

    const newMonth = newMoment.month();
    const newYear = newMoment.year();

    setAttendanceMonth(newMonth);
    setAttendanceYear(newYear);

    if (attendanceFromDate || attendanceToDate) {
      setAttendanceFromDate(
        newMoment.clone().startOf("month").format("YYYY-MM-DD"),
      );
      setAttendanceToDate(
        newMoment.clone().endOf("month").format("YYYY-MM-DD"),
      );
    }
  };

  const handleAttendanceNextMonth = () => {
    const newMoment = moment()
      .year(attendanceYear)
      .month(attendanceMonth)
      .add(1, "month");

    const newMonth = newMoment.month();
    const newYear = newMoment.year();

    setAttendanceMonth(newMonth);
    setAttendanceYear(newYear);

    if (attendanceFromDate || attendanceToDate) {
      setAttendanceFromDate(
        newMoment.clone().startOf("month").format("YYYY-MM-DD"),
      );
      setAttendanceToDate(
        newMoment.clone().endOf("month").format("YYYY-MM-DD"),
      );
    }
  };
  const uniqueBranches = Array.from(
    new Set(idealData.map((item) => item.branch_name)),
  );

  const filteredData = idealData
    .filter(
      (data) => selectedBranch === "ALL" || data.branch_name === selectedBranch,
    )
    .filter((data) => {
      if (activeTab === "all") return true;
      if (activeTab === "assigned") return data.o_id !== "0";
      if (activeTab === "unassigned") return data.o_id == "0";
      return true;
    });
  const getCardStyle = (o_id, type) => {
    if (type == "other") {
      return {
        bg: "bg-orange-100",
        border: "bg-orange-100",
        accent: "bg-orange-100",
        textPrimary: "text-black/70",
        textSecondary: "text-black/80",
        shadow: "shadow-orange-100",
      };
    }
    return o_id !== "0"
      ? {
          bg: "bg-green-100",
          border: "border-green-100",
          accent: "bg-green-200",
          textPrimary: "text-black/70",
          textSecondary: "text-black/80",
          shadow: "shadow-green-50",
        }
      : {
          bg: "bg-red-100",
          border: "border-red-100",
          accent: "bg-red-200",
          textPrimary: "text-black/70",
          textSecondary: "text-black/80",
          shadow: "shadow-red-50",
        };
  };
  const uniqueEmployees = Array.from(
    new Map(attendanceData.map((emp) => [emp.id, emp])).values(),
  );
  const handleCardClick = (data) => {
    if (attendanceView) {
      setSelectedUser(data);
      setIsModalOpen(true);
    } else {
      setSelectedUser(data);
      setIsModalOpen(true);
      setOrderData([]);
      const now = new Date();
      setCurrentMonth(now.getMonth());
      setCurrentYear(now.getFullYear());
      fetchMonthData(now.getMonth(), now.getFullYear(), data.id);
    }
  };

  const fetchMonthData = async (month, year, userId) => {
    try {
      setModalLoading(true);
      const token = localStorage.getItem("token");
      const lastDay = new Date(year, month + 1, 0);
      const fromDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const toDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;

      const response = await axios.post(
        `${BASE_URL}/api/panel-fetch-ideal-field-details`,
        {
          from_date: fromDate,
          to_date: toDate,
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const mainData = response?.data?.data || [];
      const otherData = response?.data?.other || [];

      const mergedMap = new Map();

      mainData.forEach((item) => {
        mergedMap.set(item.id, item);
      });

      otherData.forEach((item) => {
        const existing = mergedMap.get(item.order_user_id);

        if (existing) {
          mergedMap.set(item.order_user_id, {
            ...existing,
            ...item,
            type: "other",
          });
        } else {
          mergedMap.set(item.order_user_id, {
            id: item.order_user_id,
            ...item,
            type: "other",
          });
        }
      });

      const finalData = Array.from(mergedMap.values());
      setOrderData(finalData);
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
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDate = attendanceFromDate
      ? new Date(attendanceFromDate)
      : new Date(attendanceYear, attendanceMonth, 1);

    const endDate = attendanceToDate
      ? new Date(attendanceToDate)
      : new Date(attendanceYear, attendanceMonth + 1, 0);

    const totalDays = Math.ceil((endDate - startDate) / (1000 * 3600 * 24)) + 1;
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const formattedOrders =
      orderData?.map((order) => ({
        ...order,
        formattedDate: order?.order_service_date
          ? new Date(order.order_service_date).toISOString().split("T")[0]
          : null,
      })) || [];

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const orderForDate = formattedOrders.find(
        (order) => order.formattedDate === dateStr,
      );

      const hasService = !!orderForDate;
      const isOtherType = orderForDate?.type === "other";

      days.push(
        <div
          key={`day-${day}`}
          className={`h-10 w-10 flex items-center justify-center rounded-full text-sm transition-all
       ${
         hasService
           ? isOtherType
             ? "bg-orange-100 text-orange-800  border border-orange-300"
             : "bg-green-100 text-green-800 border border-green-300"
           : "text-gray-600"
       }
        `}
        >
          {day}
        </div>,
      );
    }

    const isCurrentMonth =
      currentYear === today.getFullYear() && currentMonth === today.getMonth();

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
            disabled={isCurrentMonth}
          >
            <FaChevronRight size={14} />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };
  // const renderAttendanceView = () => {
  //   const monthNames = [
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //     "August",
  //     "September",
  //     "October",
  //     "November",
  //     "December",
  //   ];
  //   const daysInMonth = new Date(
  //     attendanceYear,
  //     attendanceMonth + 1,
  //     0,
  //   ).getDate();
  //   const dayHeaders = [];

  //   for (let day = 1; day <= daysInMonth; day++) {
  //     const date = new Date(attendanceYear, attendanceMonth, day);
  //     const dayOfWeek = date.getDay();
  //     const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  //     dayHeaders.push(
  //       <div
  //         key={`header-${day}`}
  //         className={`p-1 border-r border-gray-300 text-center text-xs font-medium min-w-[28px] h-10 flex flex-col justify-center
  //           ${isWeekend ? "bg-blue-50" : "bg-gray-50"}`}
  //       >
  //         <div className="font-bold text-sm">{day}</div>
  //         <div className="text-[10px] text-gray-500 mt-[-2px]">
  //           {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
  //             dayOfWeek
  //           ].charAt(0)}
  //         </div>
  //       </div>,
  //     );
  //   }
  //   const filteredAttendanceData =
  //     selectedEmployees.length > 0
  //       ? attendanceData.filter((user) => selectedEmployees.includes(user.id))
  //       : attendanceData;
  //   return (
  //     <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-sm">
  //       <div className="p-4 border-b border-gray-200 bg-gray-50">
  //         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
  //           <div className="flex items-center gap-4">
  //             <div className="flex items-center gap-2">
  //               <IconButton
  //                 variant="text"
  //                 size="sm"
  //                 onClick={handleAttendancePrevMonth}
  //                 className="rounded-full hover:bg-gray-200"
  //               >
  //                 <FaChevronLeft size={14} />
  //               </IconButton>
  //               <div className="text-center">
  //                 <Typography variant="h5" className="font-bold text-gray-800">
  //                   {monthNames[attendanceMonth]} {attendanceYear}
  //                 </Typography>
  //                 <Typography variant="small" className="text-gray-600">
  //                   Attendance Report
  //                 </Typography>
  //               </div>
  //               <IconButton
  //                 variant="text"
  //                 size="sm"
  //                 onClick={handleAttendanceNextMonth}
  //                 className="rounded-full hover:bg-gray-200"
  //               >
  //                 <FaChevronRight size={14} />
  //               </IconButton>
  //             </div>
  //           </div>
  //           <div className="flex flex-wrap gap-3">
  //             <Tooltip content="Present - Marked with 'P'">
  //               <div className="flex items-center gap-1">
  //                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
  //                 <Typography variant="small" className="text-xs font-medium">
  //                   Present (P)
  //                 </Typography>
  //               </div>
  //             </Tooltip>
  //             <Tooltip content="Absent - Empty cell">
  //               <div className="flex items-center gap-1">
  //                 <div className="w-3 h-3 rounded-full bg-gray-300"></div>
  //                 <Typography variant="small" className="text-xs font-medium">
  //                   Absent (Empty)
  //                 </Typography>
  //               </div>
  //             </Tooltip>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="overflow-x-auto">
  //         <div className="min-w-max">
  //           <div className="flex border-b border-gray-300 bg-gray-50 sticky top-0">
  //             <div className="w-64 p-3 border-r border-gray-300 font-semibold text-sm bg-gray-50 sticky left-0">
  //               <div className="flex items-center justify-between">
  //                 <span>Employee Details</span>
  //                 <span className="text-xs font-normal text-gray-500">
  //                   {filteredAttendanceData.length} employees
  //                 </span>
  //               </div>
  //             </div>
  //             <div className="flex">
  //               {dayHeaders}
  //               <div className="w-16 p-2 border-r border-gray-300 text-center text-xs font-medium bg-gray-50 flex items-center justify-center">
  //                 Present
  //               </div>
  //             </div>
  //           </div>

  //           {attendanceLoading ? (
  //             <div className="flex justify-center items-center h-64">
  //               <div className="w-8 h-8 border-2 border-t-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  //             </div>
  //           ) : filteredAttendanceData.length > 0 ? (
  //             filteredAttendanceData.map((user, userIndex) => {
  //               const presentCount = user.totalPresent || 0;
  //               const totalDays = user.totalDays || daysInMonth;
  //               const percentage =
  //                 totalDays > 0
  //                   ? Math.round((presentCount / totalDays) * 100)
  //                   : 0;
  //               const isOtherService = user?.type == "other";
  //               return (
  //                 <div
  //                   key={user.id || userIndex}
  //                   className={`flex border-b border-gray-200 hover:bg-gray-50 ${
  //                     userIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
  //                   }`}
  //                 >
  //                   <div className="w-64 p-3 border-r border-gray-300 sticky left-0 z-1 bg-inherit">
  //                     <div className="min-w-0 flex-1">
  //                       <div className="font-medium text-sm truncate">
  //                         {user.name || "Unknown User"}
  //                       </div>
  //                     </div>
  //                   </div>
  //                   <div className="flex">
  //                     {Array.from({ length: daysInMonth }, (_, index) => {
  //                       const day = index + 1;

  //                       const fullDateStr = new Date(
  //                         attendanceYear,
  //                         attendanceMonth,
  //                         day,
  //                       )
  //                         .toISOString()
  //                         .split("T")[0];

  //                       const serviceItem = orderData?.find(
  //                         (o) =>
  //                           new Date(o.order_service_date)
  //                             .toISOString()
  //                             .split("T")[0] === fullDateStr,
  //                       );

  //                       const hasService = !!serviceItem;
  //                       const isOtherService = user?.type === "other";

  //                       const status = user.attendance?.[day] || "";
  //                       const isPresent = status === "P";
  //                       const isWithinRange = day <= totalDays;

  //                       const date = new Date(
  //                         attendanceYear,
  //                         attendanceMonth,
  //                         day,
  //                       );
  //                       const dayOfWeek = date.getDay();
  //                       const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  //                       return (
  //                         <Tooltip
  //                           key={`${user.id}-${day}`}
  //                           content={`${day} ${monthNames[attendanceMonth]}: ${
  //                             isPresent
  //                               ? "Present"
  //                               : hasService
  //                                 ? isOtherService
  //                                   ? "Other Service Added"
  //                                   : "Service Added"
  //                                 : isWithinRange
  //                                   ? "Absent"
  //                                   : "Not in range"
  //                           }`}
  //                         >
  //                           <div
  //                             className={`min-w-[28px] h-12 border-r border-gray-200 flex items-center justify-center text-sm font-medium transition-all

  //                 ${
  //                   isPresent
  //                     ? "bg-green-50 text-green-700"
  //                     : hasService
  //                       ? isOtherService
  //                         ? "bg-green-800 text-white"
  //                         : "bg-green-100 text-green-800"
  //                       : isWeekend
  //                         ? "bg-blue-50 text-gray-600"
  //                         : "bg-white text-gray-400"
  //                 }

  //                 ${!isWithinRange ? "opacity-50" : ""}
  //                 `}
  //                           >
  //                             {isPresent ? (
  //                               <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
  //                                 <span className="text-xs font-bold">P</span>
  //                               </div>
  //                             ) : hasService ? (
  //                               <div className="w-6 h-6 rounded-full flex items-center justify-center">
  //                                 <span className="text-xs font-bold">
  //                                   {isOtherService ? "O" : "S"}
  //                                 </span>
  //                               </div>
  //                             ) : (
  //                               <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
  //                                 <span className="text-xs text-gray-400">
  //                                   -
  //                                 </span>
  //                               </div>
  //                             )}
  //                           </div>
  //                         </Tooltip>
  //                       );
  //                     })}
  //                     <div className="w-16 border-r border-gray-200 flex flex-col items-center justify-center">
  //                       <div
  //                         className={`text-lg font-bold ${presentCount > 0 ? "text-green-700" : "text-gray-400"}`}
  //                       >
  //                         {presentCount}
  //                       </div>
  //                       <div className="text-[10px] text-gray-500 mt-[-4px]">
  //                         {percentage}%
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>
  //               );
  //             })
  //           ) : (
  //             <div className="flex justify-center items-center h-64 col-span-full">
  //               <div className="text-center">
  //                 <div className="text-gray-400 mb-2">
  //                   <FaUsers size={24} className="mx-auto" />
  //                 </div>
  //                 <Typography
  //                   variant="small"
  //                   className="text-gray-600 font-medium"
  //                 >
  //                   No attendance data available
  //                 </Typography>
  //                 <Typography
  //                   variant="small"
  //                   className="text-gray-500 text-xs mt-1"
  //                 >
  //                   Try selecting a different month or branch
  //                 </Typography>
  //               </div>
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //       <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
  //         <div className="flex justify-between items-center">
  //           <div>
  //             Total {attendanceData.length} employees •
  //             <span className="mx-2">🟢 Present: Shows &apos;P&apos;</span> •
  //             <span className="mx-2">⚪ Absent: Empty cell</span>
  //           </div>
  //           <div className="text-right">Click on any cell to view details</div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  // Drop-in replacement for renderAttendanceView
  // Requires: FaChevronLeft, FaChevronRight, FaUsers from react-icons/fa
  // Requires: Tooltip, Typography, IconButton from @material-tailwind/react

  const renderAttendanceView = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const startDate = attendanceFromDate
      ? new Date(attendanceFromDate)
      : new Date(attendanceYear, attendanceMonth, 1);

    const endDate = attendanceToDate
      ? new Date(attendanceToDate)
      : new Date(attendanceYear, attendanceMonth + 1, 0);

    const totalDays = Math.ceil((endDate - startDate) / (1000 * 3600 * 24)) + 1;

    const filteredAttendance =
      selectedEmployees.length > 0
        ? attendanceData.filter((u) => selectedEmployees.includes(u.id))
        : attendanceData;

    const dayHeaders = Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      const day = date.getDate();
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dayLabel = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][dayOfWeek];
      return { day, dayOfWeek, isWeekend, dayLabel, date };
    });

    return (
      <div
        className="mt-4 rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white"
        // style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 bg-white border-b border-gray-100">
          {/* Month nav */}
          <div className="flex items-center gap-2">
            <IconButton
              variant="text"
              size="sm"
              onClick={handleAttendancePrevMonth}
              className="rounded-full hover:bg-gray-100 text-gray-500"
            >
              <FaChevronLeft size={12} />
            </IconButton>
            <div className="text-center min-w-[150px]">
              <p className="text-base font-bold text-gray-800 leading-tight">
                {attendanceFromDate && attendanceToDate
                  ? (() => {
                      const from = new Date(attendanceFromDate);
                      const to = new Date(attendanceToDate);
                      const sameMonth =
                        from.getMonth() === to.getMonth() &&
                        from.getFullYear() === to.getFullYear();
                      return sameMonth
                        ? `${monthNames[from.getMonth()]} ${from.getFullYear()}`
                        : `${monthNames[from.getMonth()]} ${from.getFullYear()} – ${monthNames[to.getMonth()]} ${to.getFullYear()}`;
                    })()
                  : `${monthNames[attendanceMonth]} ${attendanceYear}`}
              </p>
              <p className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">
                Attendance Report
              </p>
            </div>
            <IconButton
              variant="text"
              size="sm"
              onClick={handleAttendanceNextMonth}
              className="rounded-full hover:bg-gray-100 text-gray-500"
            >
              <FaChevronRight size={12} />
            </IconButton>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-gray-500 font-medium flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-green-100 border border-green-300 flex items-center justify-center text-green-700 text-[9px] font-bold">
                P
              </span>
              Present
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100"></span>
              Weekend
            </span>

            {/* Rate legend */}
            <span className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-green-600 font-semibold">≥75%</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-amber-500 font-semibold">≥50%</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-400"></span>
                <span className="text-red-500 font-semibold">&lt;50%</span>
              </span>
              <span className="text-gray-400 font-normal">Rate</span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="sticky left-0 z-20 bg-gray-50 border-r border-gray-200 px-4 py-2 text-left text-[10px] font-semibold text-gray-800 uppercase tracking-wider whitespace-nowrap min-w-[180px]">
                  Employee
                </th>

                {dayHeaders.map(({ day, isWeekend, dayLabel }, i) => (
                  <th
                    key={i}
                    className={`text-center px-0 py-1.5 font-medium border-r min-w-[30px] w-[30px] ${
                      isWeekend
                        ? "bg-blue-50 text-blue-400 border-blue-100"
                        : "text-gray-800 border-gray-100"
                    }`}
                  >
                    <div className="flex flex-col items-center leading-none gap-0.5">
                      <span className="text-[8px] font-normal opacity-60">
                        {dayLabel}
                      </span>
                      <span className="text-[11px] font-bold">{day}</span>
                    </div>
                  </th>
                ))}

                <th className="text-center px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap border-l-2 border-gray-200 min-w-[60px]">
                  Days
                </th>
                <th className="text-center px-3 py-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">
                  Rate
                </th>
              </tr>
            </thead>

            <tbody>
              {attendanceLoading ? (
                <tr>
                  <td colSpan={totalDays + 3} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <div className="w-7 h-7 rounded-full border-2 border-gray-200 border-t-blue-400 animate-spin" />
                      <span className="text-xs">Loading attendance data…</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={totalDays + 3} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <FaUsers size={22} />
                      <p className="text-sm font-medium text-gray-600">
                        No attendance data available
                      </p>
                      <p className="text-xs text-gray-400">
                        Try selecting a different month or branch
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((user, userIndex) => {
                  const presentCount = user.totalPresent || 0;
                  const totalDaysCount = user.totalDays || totalDays;
                  const percentage =
                    totalDaysCount > 0
                      ? Math.round((presentCount / totalDaysCount) * 100)
                      : 0;
                  const isOtherService = user?.type === "other";

                  const pctColor =
                    percentage >= 75
                      ? "text-green-600"
                      : percentage >= 50
                        ? "text-amber-500"
                        : "text-red-500";
                  const barColor =
                    percentage >= 75
                      ? "bg-green-500"
                      : percentage >= 50
                        ? "bg-amber-400"
                        : "bg-red-400";

                  return (
                    <tr
                      key={user.id || userIndex}
                      className={`border-b border-gray-100 hover:bg-indigo-50/30 transition-colors duration-100 ${
                        userIndex % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                      }`}
                    >
                      <td className="sticky left-0 z-20 bg-white border-r border-gray-200 px-4 py-2 font-semibold text-gray-800 whitespace-nowrap text-xs">
                        {user.name || "Unknown User"}
                      </td>

                      {dayHeaders.map(({ day, isWeekend, date }, i) => {
                        const fullDateStr = date.toISOString().split("T")[0];

                        const serviceItem = orderData?.find(
                          (o) =>
                            new Date(o.order_service_date)
                              .toISOString()
                              .split("T")[0] === fullDateStr,
                        );
                        const hasService = !!serviceItem;
                        const status = user.attendance?.[day] || "";
                        const isPresent = status === "P";
                        const isWithinRange =
                          date >= startDate && date <= endDate;
                        const tooltipLabel = isPresent
                          ? "Present"
                          : hasService
                            ? isOtherService
                              ? "Other Service Added"
                              : "Service Added"
                            : isWithinRange
                              ? "Absent"
                              : "Out of range";

                        const cellBg = isPresent
                          ? "bg-green-50"
                          : hasService
                            ? isOtherService
                              ? "bg-emerald-700"
                              : "bg-green-100"
                            : isWeekend
                              ? "bg-blue-50"
                              : "";

                        return (
                          <Tooltip
                            key={i}
                            content={`${day} ${monthNames[attendanceMonth]}: ${tooltipLabel}`}
                          >
                            <td
                              className={`text-center px-0 py-2 border-r border-gray-100 ${cellBg} ${
                                !isWithinRange ? "opacity-40" : ""
                              } cursor-default`}
                            >
                              {isPresent ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs font-bold shadow-sm">
                                  P
                                </span>
                              ) : hasService ? (
                                <span
                                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold ${
                                    isOtherService
                                      ? "bg-white/20 text-white ring-1 ring-white/40"
                                      : "bg-green-600 text-white"
                                  }`}
                                >
                                  {isOtherService ? "O" : "S"}
                                </span>
                              ) : (
                                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                                  <span className="text-xs text-gray-400">
                                    -
                                  </span>
                                </div>
                              )}
                            </td>
                          </Tooltip>
                        );
                      })}

                      {/* Present count */}
                      <td className="text-center px-3 py-2 border-l-2 border-gray-200">
                        <span
                          className={`inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-md text-xs font-bold ${
                            presentCount > 0
                              ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {presentCount}
                        </span>
                      </td>

                      {/* Percentage + bar */}
                      <td className="text-center px-3 py-2">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`text-xs font-bold tabular-nums ${pctColor}`}
                          >
                            {percentage}%
                          </span>
                          <div className="w-10 h-1 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor} transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>
            {attendanceData.length} employees · Showing{" "}
            {monthNames[attendanceMonth]} {attendanceYear}
          </span>
          <span>Hover cells for details</span>
        </div>
      </div>
    );
  };
  const renderCard = (data) => {
    const firstName = data.name.split(" ")[0];
    const cardStyle = getCardStyle(data.o_id, data.type);
    const isAssigned = data.o_id !== "0";

    return (
      <div
        key={data.mobile}
        className={`${cardStyle.bg} ${cardStyle.border} border rounded-lg p-2 ${cardStyle.shadow} shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 relative overflow-hidden cursor-pointer`}
      >
        <div
          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md"
          onClick={() => handleCardClick(data)}
        >
          <FaCalendarAlt className={`text-blue-800 text-[10px]`} />
        </div>
        {!isAssigned && (
          <div
            className="absolute bottom-1 right-1 p-1 bg-white rounded-full shadow-md"
            onClick={() => handleRowClick(data)}
          >
            <FaPencilAlt className={`text-blue-800 text-[10px]`} />
          </div>
        )}
        <div
          className={`text-sm font-medium ${cardStyle.textPrimary} mb-1 truncate`}
        >
          {firstName}
        </div>

        <div className="flex items-center gap-1 mb-1">
          <FaMapMarkerAlt className={`${cardStyle.textSecondary}`} size={9} />
          <div className={`text-xs ${cardStyle.textSecondary} truncate`}>
            {data.branch_name}
          </div>
        </div>

        <div
          className={`text-xs font-medium ${
            isAssigned ? "text-green-700" : "text-orange-700"
          }`}
        >
          {isAssigned ? "" : ""}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <IdealFieldListFilter />

      <div className="p-2 space-y-2 bg-white mt-1">
        <Card className="p-3 bg-gray-300 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <Typography variant="h5" className="text-gray-800 font-bold">
              Ideal Field List {attendanceView ? "- Attendance View" : ""}
            </Typography>

            <Button
              variant={attendanceView ? "filled" : "outlined"}
              color={attendanceView ? "red" : "blue"}
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setAttendanceView(!attendanceView)}
            >
              {attendanceView ? (
                <>
                  <FaListUl size={14} />
                  List View
                </>
              ) : (
                <>
                  <FaCalendarCheck size={14} />
                  Attendance View
                </>
              )}
            </Button>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${
              attendanceView ? "lg:grid-cols-4" : "lg:grid-cols-3"
            } gap-3`}
          >
            {" "}
            {!attendanceView && (
              <div className="space-y-1">
                <Typography
                  variant="small"
                  className="text-gray-700 font-medium text-xs"
                >
                  📅 Date
                </Typography>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="!text-xs rounded-md px-2 bg-white border-gray-200 focus:border-blue-400 h-8 w-full"
                />
              </div>
            )}
            <div className="space-y-1">
              <Typography
                variant="small"
                className="text-gray-700 font-medium text-xs"
              >
                🏢 Branch
              </Typography>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full h-8 text-xs bg-white border border-gray-200 rounded-md px-2 focus:border-blue-400 focus:outline-none"
              >
                <option value="ALL">All Branches</option>
                {attendanceView
                  ? branches.map((branch) => (
                      <option key={branch.id} value={branch.branch_name}>
                        {branch.branch_name}
                      </option>
                    ))
                  : uniqueBranches.map((branch, index) => (
                      <option key={index} value={branch}>
                        {branch}
                      </option>
                    ))}
              </select>
            </div>
            {attendanceView && (
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                {" "}
                <div>
                  <Typography
                    variant="small"
                    className="text-gray-700 font-medium text-xs"
                  >
                    📅 From Date
                  </Typography>
                  <input
                    type="date"
                    value={attendanceFromDate}
                    onChange={(e) => setAttendanceFromDate(e.target.value)}
                    className="w-full h-8 text-xs bg-white border border-gray-200 rounded-md px-2"
                  />
                </div>
                <div className="space-y-1">
                  <Typography
                    variant="small"
                    className="text-gray-700 font-medium text-xs"
                  >
                    📅 To Date
                  </Typography>
                  <input
                    type="date"
                    value={attendanceToDate}
                    onChange={(e) => setAttendanceToDate(e.target.value)}
                    className="w-full h-8 text-xs bg-white border border-gray-200 rounded-md px-2"
                  />
                </div>
                <div>
                  <Typography
                    variant="small"
                    className="text-gray-700 font-medium text-xs"
                  >
                    👤 Employees
                  </Typography>

                  <EmployeeMultiSelect
                    employees={uniqueEmployees}
                    selectedEmployees={selectedEmployees}
                    setSelectedEmployees={setSelectedEmployees}
                  />
                </div>
              </div>
            )}
            {!attendanceView && (
              <div className="space-y-1">
                <Typography
                  variant="small"
                  className="text-gray-700 font-medium text-xs"
                >
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
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
                    Office
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-200"></span>
                    Unassigned
                  </span>
                </p>
              </div>
            )}
          </div>
        </Card>

        {loading ? (
          <LoaderComponent />
        ) : attendanceView ? (
          renderAttendanceView()
        ) : filteredData.length === 0 ? (
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

      <Dialog
        open={isModalOpen}
        handler={closeModal}
        size={attendanceView ? "lg" : "xs"}
        className="bg-white"
      >
        <DialogHeader className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Typography variant="h6" color="blue-gray">
              {selectedUser?.name}
            </Typography>
            {!attendanceView && (
              <>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <Typography variant="small" className="text-xs">
                    {
                      new Set(
                        orderData.map((order) => order.order_service_date),
                      ).size
                    }
                  </Typography>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <Typography variant="small" className="text-xs">
                    {new Date(currentYear, currentMonth + 1, 0).getDate() -
                      new Set(
                        orderData.map((order) => order.order_service_date),
                      ).size}
                  </Typography>
                </div>
              </>
            )}
            <Typography
              variant="small"
              color="gray"
              className="font-normal text-xs"
            >
              | {selectedUser?.branch_name}
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
              {attendanceView ? (
                <div className="text-center">
                  <Typography variant="h6" className="mb-4">
                    Monthly Attendance Summary
                  </Typography>
                  <div className="text-gray-500">
                    Detailed attendance view for {selectedUser?.name}
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  {renderCustomCalendar()}
                </div>
              )}

              {!attendanceView && orderData.length === 0 && (
                <div className="flex justify-center items-center">
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
      <CreateAttendanceDialog
        open={openAttendance}
        onClose={() => setOpenAttendance(false)}
        userId={selectedUserId}
        onSuccess={fetchIdealData}
      />
    </Layout>
  );
};

export default IdealFieldList;
