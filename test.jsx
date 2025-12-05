import { Bars3Icon, UserCircleIcon } from "@heroicons/react/24/solid";
import {
  Badge,
  Breadcrumbs,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { HiArrowRightStartOnRectangle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import Logout from "./Logout";
import ButtonConfigColor from "./common/ButtonConfig/ButtonConfigColor";
import { BellIcon } from "lucide-react";

const DashboardNavbar = ({
  openSideNav,
  setOpenSideNav,
  isCollapsed,
  setIsCollapsed,
}) => {
  const navigate = useNavigate();
  const useType = localStorage.getItem("user_type_id");
  const headerUserType = localStorage.getItem("header_user_type");
  const headerName = localStorage.getItem("name");
  const [openModal, setOpenModal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
 const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const handleOpenLogout = () => setOpenModal(!openModal);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleSidebarCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const fetchNotifications = async () => {
    // Abort previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const theLoginToken = localStorage.getItem("token");
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        'https://v3care.in/crmapi/public/api/panel-fetch-notification-booking',
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + theLoginToken,
          },
          signal: signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.bookingNotification && Array.isArray(data.bookingNotification)) {
        setNotifications(data.bookingNotification);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      // Only set error if it's not an abort error
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('Error fetching notifications:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = () => {
    setNotificationMenuOpen(!notificationMenuOpen);
    if (!notificationMenuOpen) {
      fetchNotifications();
    }
  };

  useEffect(()=>{
    fetchNotifications()
  },[])
  const handleNotificationItemClick = (orderId) => {
    setNotificationMenuOpen(false);
    navigate(`/view-booking/${orderId}`);
  };

  const formatNotificationText = (notification) => {
    return `${notification.notification_booking_heading} - ${notification.branch_name}`;
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const fixedNavbar = true;

  return (
    <Navbar
      color={fixedNavbar ? "transparent" : "transparent"}
      className="rounded-xl transition-all sticky top-4 z-40 py-3 bg-[#900002] text-white"
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex justify-between gap-6 flex-row md:items-center">
        <div className="capitalize flex flex-row items-center">
          <IconButton
            variant="text"
            color="white"
            onClick={toggleSidebarCollapse}
            className="hidden xl:inline-block"
          >
            <Bars3Icon strokeWidth={3} className="h-5 w-5 text-white" />
          </IconButton>
          <Breadcrumbs className="bg-transparent p-0 transition-all mt-1">
            <Link to="/home">
              <Typography
                variant="small"
                color="white"
                className="font-normal transition-all hover:text-blue-500 hover:opacity-100"
              >
                Home
              </Typography>
            </Link>
          </Breadcrumbs>
        </div>
        <div className="flex items-center gap-2">
          {(useType === "1" ||
            useType === "5" ||
            useType === "6" ||
            useType === "7" ||
            useType === "8") && (
            <ButtonConfigColor
              type="create"
              label="Booking"
              onClick={() => navigate("/add-booking")}
            />
          )}

          <IconButton
            variant="text"
            color="white"
            onClick={toggleFullscreen}
            className="hidden md:inline-block"
          >
            {isFullscreen ? (
              <BsFullscreenExit className="h-5 w-5" />
            ) : (
              <BsFullscreen className="h-5 w-5" />
            )}
          </IconButton>
          <Menu
  open={notificationMenuOpen}
  handler={setNotificationMenuOpen}
  placement="bottom-end"
>
  <MenuHandler >
    <div  onClick={handleNotificationClick}   role="button"  aria-label="notification-menu"  className="relative">

  
    <IconButton
      variant="text"
      color="white"
     
  
    >
      <BellIcon className="h-5 w-5" />
    
    </IconButton>
    {notifications.length > 0 && (
        <Badge
          color="red"
          content={notifications.length}
          className="absolute -top-5 right-2  text-[10px]"
        />
      )}
        </div>
  </MenuHandler>
  <MenuList className="max-h-80 overflow-y-auto w-80 bg-white p-0">
    <div className="sticky top-0 bg-white z-10 px-3 py-2 border-b">
      <Typography className="font-bold text-sm text-gray-800">
        Notifications
      </Typography>
    </div>

    {loading ? (
      <div className="p-4 text-center">
        <Typography className="text-gray-500 text-sm">Loading...</Typography>
      </div>
    ) : error ? (
      <div className="p-3 text-center">
        <Typography className="text-red-500 text-xs mb-1">{error}</Typography>
        <button
          onClick={fetchNotifications}
          className="text-blue-500 text-xs hover:text-blue-700"
        >
          Retry
        </button>
      </div>
    ) : notifications.length === 0 ? (
      <div className="p-4 text-center">
        <Typography className="text-gray-500 text-sm">No notifications</Typography>
      </div>
    ) : (
      <div className="max-h-64 overflow-y-auto">
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={() => handleNotificationItemClick(notification.order_id)}
            className="p-2 hover:bg-gray-50 border-b last:border-b-0"
          >
            <div className="w-full">
              <div className="flex justify-between items-start mb-1">
                <Typography className="font-semibold text-gray-900 text-xs line-clamp-1">
                  {notification.notification_booking_heading}
                </Typography>
                <Typography className="text-gray-500 text-xs ml-2 shrink-0">
                  {notification.branch_name}
                </Typography>
              </div>
              <Typography className="text-gray-600 text-xs line-clamp-2 mb-1">
                {notification.notification_booking_message}
              </Typography>
              <Typography className="text-blue-600 text-xs font-medium">
                Order #{notification.order_id}
              </Typography>
            </div>
          </MenuItem>
        ))}
      </div>
    )}

    {notifications.length > 0 && (
      <div className="sticky bottom-0 bg-gray-50 px-3 py-1 border-t">
        <Typography className="text-gray-600 text-xs text-center">
          {notifications.length} notification(s)
        </Typography>
      </div>
    )}
  </MenuList>
</Menu>
          
          <div className="flex flex-col items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-center">
            <span className="text-xs font-semibold leading-tight">
              {headerName}
            </span>
            <span className="text-[10px] font-medium leading-tight">
              {headerUserType}
            </span>
          </div>

          {/* Mobile Sidebar Toggle */}
          <IconButton
            variant="text"
            color="white"
            className="grid xl:hidden"
            onClick={() => setOpenSideNav(!openSideNav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-white" />
          </IconButton>

          {/* Profile Menu */}
      
          <Menu
            open={profileMenuOpen}
            handler={setProfileMenuOpen}
            placement="bottom-end"
          >
            <MenuHandler>
              <IconButton variant="text" color="white">
                <UserCircleIcon className="h-5 w-5 text-red" />
              </IconButton>
            </MenuHandler>
            <MenuList className="bg-gray-100">
              <Link to="/profile" className="text-black">
                <MenuItem>Profile</MenuItem>
              </Link>
              <Link to="/change-password" className="text-black">
                <MenuItem>Change Password</MenuItem>
              </Link>
            </MenuList>
          </Menu>

          {/* Logout Button */}
          <IconButton variant="text" color="white" onClick={handleOpenLogout}>
            <HiArrowRightStartOnRectangle className="h-5 w-5 text-red" />
          </IconButton>
        </div>
      </div>
      <Logout open={openModal} handleOpen={handleOpenLogout} />
    </Navbar>
  );
};

export default DashboardNavbar;
