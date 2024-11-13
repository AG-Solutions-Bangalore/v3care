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
      <div className="m-4 overflow-y-auto lg:h-[calc(100vh-230px)]   md:h-[calc(100vh-230px)] h-[calc(100vh-230px)] custom-scroll">
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
      <div className="flex flex-row items-center justify-around">
        <div className=" font-serif font-[400]  text-white   ">
          {" "}
          {formatTime(currentTime)}
        </div>
        <div className="font-serif font-[400]  text-white  ">
          {" "}
          {formatDate(currentTime)}
        </div>
      </div>
    </aside>
  );
};
export default SideNav;
