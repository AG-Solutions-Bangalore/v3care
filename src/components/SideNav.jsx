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
const SideNav = ({ openSideNav, setOpenSideNav, isCollapsed }) => {
  const sidenavRef = useRef(null);
  const { pathname } = useLocation();
  const [openBookingMenu, setOpenBookingMenu] = useState(false);

  const userType = localStorage.getItem("user_type_id");
  const userName = localStorage.getItem("username");
  const sidenavType = "dark";

  const sidenavTypes = {
    dark: "bg-[#001F3F] ",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  useEffect(() => {
    function handClickOutside(e) {
      if (sidenavRef.current && !sidenavRef.current.contains(e.target)) {
        if (window.innerWidth < 1280) {
          // xl breakpoint
          setOpenSideNav(false);
        }
      }
    }

    document.addEventListener("mousedown", handClickOutside);
    return () => {
      document.removeEventListener("mousedown", handClickOutside);
    };
  }, [setOpenSideNav]);

  useEffect(() => {
    if (window.innerWidth < 1280) {
      // xl breakpoint
      setOpenSideNav(false);
    }
  }, [pathname, setOpenSideNav]);

  const menuItems = [
    {
      to: "/home",
      icon: <HomeIcon className="w-5 h-5 text-inherit" />,
      text: "Dashboard",
      title: "Dashboard",
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
      title: "Master",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
    {
      to: "/vendor-list",
      icon: <BuildingStorefrontIcon className="w-5 h-5 text-inherit" />,
      text: "Vendor List",
      title: "Vendor List",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
    {
      to: "/idealfield-list",
      icon: <CiViewList className="w-5 h-5 text-inherit" />,
      text: "Ideal Field List",
      title: "Ideal Field List",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
    {
      to: "/today",
      icon: <MdOutlineLibraryBooks className="w-5 h-5 text-inherit" />,
      text: "Booking",
      title: "Booking",
      roles: ["user", "viewer", "admin", "superadmin", "operationteam"],
    },
    {
      to: "/pending-payment",
      icon: <MdOutlinePayment className="w-5 h-5 text-inherit" />,
      text: "Payment",
      title: "Payment",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
    {
      to: "/commission-pending",
      icon: <RiGitRepositoryCommitsLine className="w-5 h-5 text-inherit" />,
      text: "Commission",
      title: "Commission",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
    {
      to: "/notification",
      icon: <IoMdNotificationsOutline className="w-5 h-5 text-inherit" />,
      text: "Notification",
      title: "Notification",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
    {
      to: "/booking-download",
      icon: <IoDownloadOutline className="w-5 h-5 text-inherit" />,
      text: "Download",
      title: "Download",
      roles: ["admin", "superadmin", "operationteam", "viewer"],
    },
    {
      to: "/report-quatation",
      icon: <IoDownloadOutline className="w-5 h-5 text-inherit" />,
      text: "Report",
      title: "Report",
      roles: ["superadmin"],
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

  // const getFilteredMenuItems = () => {
  //   const role = roleMap[userType];
  //   return role ? menuItems.filter((item) => item.roles.includes(role)) : [];
  // };

  const getFilteredMenuItems = () => {
    const role = roleMap[userType];

    return role
      ? menuItems.filter((item) =>
          item.text == "Report"
            ? userName == "superadmins"
            : item.roles.includes(role)
        )
      : [];
  };
  const handleItemClick = () => {
    // Clear page-no from localStorage
    localStorage.removeItem("page-no");
  };
  return (
    <aside
      ref={sidenavRef}
      className={`${sidenavTypes[sidenavType]} ${
        openSideNav ? "translate-x-0" : "-translate-x-80"
      } ${
        isCollapsed ? "xl:w-[5.5rem] w-[272px]" : " w-[272px] xl:w-[272px]"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)]  rounded-xl transition-all duration-300 ease-in-out xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className={`relative`}>
        <Link to="/home" className="flex items-center justify-center p-4">
          <div className="flex items-center">
            <img
              src="/velogo.png"
              alt="Logo"
              className={`h-20 ${
                isCollapsed ? "w-12" : "w-full"
              } transition-all duration-300`}
            />
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
      <div
        className={`m-4 overflow-y-auto ${
          isCollapsed
            ? "lg:h-[calc(100vh-200px)]    md:h-[calc(100vh-200px)] h-[calc(100vh-200px)]"
            : "lg:h-[calc(100vh-240px)]    md:h-[calc(100vh-2400px)] h-[calc(100vh-240px)]"
        }    custom-scroll`}
      >
        <ul className="mb-4 flex flex-col gap-1">
          {getFilteredMenuItems().map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} onClick={handleItemClick}>
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color="white"
                    title={item.title}
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    {item.icon}
                    {(!isCollapsed || window.innerWidth < 1280) && (
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {item.text}
                      </Typography>
                    )}
                  </Button>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      {!isCollapsed && (
        <div className="absolute transition-all duration-300 ease-in-out bottom-4 left-4 right-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2 text-white">
            {/* <div className="text-lg font-medium">{formatTime(currentTime)}</div> */}
            <div className="text-sm font-medium opacity-80">
              Version: 1.2.19
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
export default SideNav;
