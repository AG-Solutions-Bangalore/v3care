import { Link, NavLink, useLocation } from "react-router-dom";
import {
  BuildingStorefrontIcon,
  HomeIcon,
  TableCellsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Typography,
  Collapse,
} from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import {
  MdOutlineAdd,
  MdOutlineLibraryBooks,
  MdOutlinePayment,
  MdToday,
} from "react-icons/md";
import logo from "../../public/img/v3logo.png";
import { RiAdminLine, RiGitRepositoryCommitsLine } from "react-icons/ri";
import { CiViewList } from "react-icons/ci";
import { FaBook } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoDownloadOutline } from "react-icons/io5";
const SideNav = ({ openSideNav, setOpenSideNav }) => {
  const sidenavRef = useRef(null);
  const { pathname } = useLocation();

  const [openBookingMenu, setOpenBookingMenu] = useState(false);
  const userType = localStorage.getItem("user_type_id");
  // Hardcoded sidenavType to "dark"
  const sidenavType = "dark";

  const sidenavTypes = {
    dark: "bg-[#900002] ",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  // close sidebar when clicking outside

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

  // Close sidebar on route change
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
    // Toggle the booking menu open/close
    setOpenBookingMenu((prevState) => !prevState);
  };
  // w - 72;
  return (
    <aside
      ref={sidenavRef}
      className={`${sidenavTypes[sidenavType]} ${
        openSideNav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-[272px] rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
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
      <div className="m-4 overflow-y-auto lg:h-[calc(100vh-150px)]  md:h-[calc(100vh-200px)] h-[calc(100vh-200px)] custom-scroll">
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
          {/* <li>
            <NavLink to="/home">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <HomeIcon className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Dashboard
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/branch">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <RiAdminLine className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Master
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/vendor-list">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <BuildingStorefrontIcon className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Vendor List
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/idealfield-list">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <CiViewList className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Ideal Field List
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li> */}
          {/* <li>
            <NavLink to="/add-booking">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <HomeIcon className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Add Booking
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <HomeIcon className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Today
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li> */}

          {/* this something  */}
          {/* Booking Dropdown */}
          {/* <li>
            <div>
              <Button
                variant="text"
                color="white"
                className="flex items-center justify-between px-4 capitalize"
                fullWidth
                onClick={handleBookingButtonClick}
              >
                <div className="flex items-center gap-4">
                  <HomeIcon className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Booking
                  </Typography>
                </div>
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform ${
                    openBookingMenu ? "rotate-180" : ""
                  }`}
                />
              </Button>
              {openBookingMenu && (
                <ul className="ml-8">
                  <li>
                    <NavLink to="/add-booking">
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "gradient" : "text"}
                          color="white"
                          className="flex items-center gap-4 px-4 capitalize"
                          fullWidth
                        >
                          <MdOutlineAdd className="w-5 h-5 text-inherit" />
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            Add Booking
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/today">
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "gradient" : "text"}
                          color="white"
                          className="flex items-center gap-4 px-4 capitalize"
                          fullWidth
                        >
                          <MdToday className="w-5 h-5 text-inherit" />
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            Booking
                          </Typography>
                        </Button>
                      )}
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>
          </li> */}
          {/* from here  */}
          {/* <li>
            <NavLink to="/today">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <MdOutlineLibraryBooks className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Booking
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li> */}

          {/* payment  */}
          {/* <li>
            <NavLink to="/pending-payment">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <MdOutlinePayment className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Payment
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li> */}
          {/* commission  */}
          {/* <li>
            <NavLink to="/commission-pending">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <RiGitRepositoryCommitsLine className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Commission
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li> */}
          {/* notification  */}
          {/* <li>
            <NavLink to="/notification">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <IoMdNotificationsOutline className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Notification
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li> */}
          {/* download  */}
          {/* <li>
            <NavLink to="/booking-download">
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color="white"
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  <IoDownloadOutline className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Download
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li> */}

          {/* Add more hardcoded routes here as needed */}
        </ul>
      </div>
    </aside>
  );
};
export default SideNav;
