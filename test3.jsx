import { useState } from "react";
import Footer from "../components/Footer";
import DashboardNavbar from "../components/DashboardNavbar";
import SideNav from "../components/SideNav";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [openSideNav, setOpenSideNav] = useState(false);
 
  // xl:ml-80
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 ">
      <SideNav openSideNav={openSideNav} setOpenSideNav={setOpenSideNav} />
      <div className="p-4 xl:ml-72">
        <DashboardNavbar
          openSideNav={openSideNav}
          setOpenSideNav={setOpenSideNav}
        />
        {children}
        {/* <div className="text-blue-gray-600">
          <Footer />
        </div> */}
      </div>
      {/* {(useType === "1" ||
        useType === "5" ||
        useType === "6" ||
        useType === "7") && (
        <button
          className="fixed bottom-12 right-6 bg-gradient-to-r  from-purple-500 to-indigo-400 transform -translate-y-1 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition duration-300  "
          onClick={() => navigate("/add-booking")}
        >
          + Add Booking
        </button>
      )} */}
    </div>
  );
};

export default Layout;

// bg-gradient-to-br from-blue-200 to-gray-100






















import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import Logout from "./Logout";
import { useState } from "react";
import { HiArrowRightStartOnRectangle } from "react-icons/hi2";

const DashboardNavbar = ({ openSideNav, setOpenSideNav }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const useType = localStorage.getItem("user_type_id");

  const [openModal, setOpenModal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleOpenLogout = () => setOpenModal(!openModal);

  const pathSegments = pathname.split("/").filter((el) => el !== "");

  const breadcrumbs = [
    { name: "Home", link: "/home" },
    ...pathSegments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      link: `/${pathSegments.slice(0, index + 1).join("/")}`,
    })),
  ];

  const pageTitle =
    pathSegments.length === 0
      ? "Home"
      : pathSegments[pathSegments.length - 1]?.charAt(0).toUpperCase() +
        pathSegments[pathSegments.length - 1]?.slice(1);

  // Hardcode fixedNavbar to true
  const fixedNavbar = true;

  return (
    <Navbar
      color={fixedNavbar ? "transparent" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 bg-[#900002] text-white   "
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex  justify-between gap-6 flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to="/home">
              <Typography
                variant="small"
                color="white"
                className="font-normal  transition-all hover:text-blue-500 hover:opacity-100"
              >
                Home
              </Typography>
            </Link>
          </Breadcrumbs>
        </div>
        <div className="flex items-center">
          {/* Search and other elements can be added here */}

          {/* Sidebar toggle button for mobile view */}
          {(useType === "1" ||
            useType === "5" ||
            useType === "6" ||
            useType === "7") && (
            <button
              className=" text-white  hover:text-blue-700 animate-pulse   "
              onClick={() => navigate("/add-booking")}
            >
              + Booking
            </button>
          )}
          <IconButton
            variant="text"
            color="white"
            className="grid xl:hidden"
            onClick={() => setOpenSideNav(!openSideNav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-white" />
          </IconButton>
          {/* profile icon  */}
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
              <Link to="/profile" className="text-black ">
                <MenuItem>Profile</MenuItem>
              </Link>
              <Link to="/change-password" className="text-black">
                <MenuItem>Change Password</MenuItem>
              </Link>
            </MenuList>
          </Menu>
          {/* Settings icon */}
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























import { Link, NavLink, useLocation } from "react-router-dom";
import {
  BuildingStorefrontIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { MdOutlineLibraryBooks, MdOutlinePayment } from "react-icons/md";
import { RiAdminLine, RiGitRepositoryCommitsLine } from "react-icons/ri";
import { CiViewList } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoDownloadOutline } from "react-icons/io5";
const SideNav = ({ openSideNav, setOpenSideNav }) => {
  const sidenavRef = useRef(null);
  const { pathname } = useLocation();
  const [openBookingMenu, setOpenBookingMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const userType = localStorage.getItem("user_type_id");
  const sidenavType = "dark";
//sajid
  const sidenavTypes = {
    dark: "bg-[#001F3F] ",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    function handClickOutside(e) {
      if (sidenavRef.current && !sidenavRef.current.contains(e.target)) {
        setOpenSideNav(false);
      }
    }

    document.addEventListener("mousedown", handClickOutside);
    return () => {
      document.removeEventListener("mousedown", handClickOutside);
    };
  }, [setOpenSideNav]);

  useEffect(() => {
    setOpenSideNav(false);
  }, [pathname, setOpenSideNav]);

  const menuItems = [
    {
      to: "/home",
      icon: <HomeIcon className="w-5 h-5 text-inherit" />,
      text: "Dashboard",
      roles: [
        "user",
        "vendoruser",
        "vendor",
        "viewer",
        "admin",
        "superadmin",
        "operationteam",
      ],
    },
    {
      to: "/refer-by",
      icon: <RiAdminLine className="w-5 h-5 text-inherit" />,
      text: "Master",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
    {
      to: "/vendor-list",
      icon: <BuildingStorefrontIcon className="w-5 h-5 text-inherit" />,
      text: "Vendor List",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
    {
      to: "/idealfield-list",
      icon: <CiViewList className="w-5 h-5 text-inherit" />,
      text: "Ideal Field List",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
    {
      to: "/today",
      icon: <MdOutlineLibraryBooks className="w-5 h-5 text-inherit" />,
      text: "Booking",
      roles: ["user", "viewer", "admin", "superadmin", "operationteam"],
    },
    {
      to: "/pending-payment",
      icon: <MdOutlinePayment className="w-5 h-5 text-inherit" />,
      text: "Payment",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
    {
      to: "/commission-pending",
      icon: <RiGitRepositoryCommitsLine className="w-5 h-5 text-inherit" />,
      text: "Commission",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
    {
      to: "/notification",
      icon: <IoMdNotificationsOutline className="w-5 h-5 text-inherit" />,
      text: "Notification",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
    {
      to: "/booking-download",
      icon: <IoDownloadOutline className="w-5 h-5 text-inherit" />,
      text: "Download",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
  ];

  const roleMap = {
    1: "user",
    2: "vendoruser",
    3: "vendor",
    4: "viewer",
    5: "admin",
    6: "superadmin",
    7: "operationteam",
  };

  const getFilteredMenuItems = () => {
    const role = roleMap[userType];
    return role ? menuItems.filter((item) => item.roles.includes(role)) : [];
  };

  const handleBookingButtonClick = () => {
    
    setOpenBookingMenu((prevState) => !prevState);
  };
  
  return (
    <aside
      ref={sidenavRef}
      className={`${sidenavTypes[sidenavType]} ${
        openSideNav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-[272px] rounded-xl  transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className={`relative`}>
        <Link to="/home" className="flex items-center justify-center p-4">
          <div className="flex items-center">
            <img src="/velogo.png" alt="Logo" className=" h-20 w-full  " />
          </div>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSideNav(false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
      <div className="m-4 overflow-y-auto lg:h-[calc(100vh-290px)]   md:h-[calc(100vh-290px)] h-[calc(100vh-290px)] custom-scroll">
        <ul className="mb-4 flex flex-col gap-1">
          {getFilteredMenuItems().map((item) => (
            <li key={item.to}>
              <NavLink to={item.to}>
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color="white"
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    {item.icon}
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      {item.text}
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2 text-white">
          <div className="text-lg font-medium">{formatTime(currentTime)}</div>
          <div className="text-sm opacity-80">{formatDate(currentTime)}</div>
        </div>
      </div>
    </aside>
  );
};
export default SideNav;




