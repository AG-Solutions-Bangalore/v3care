import { Link, NavLink, useLocation } from "react-router-dom";
import {
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
import { MdOutlineAdd, MdToday } from "react-icons/md";
const SideNav = ({ openSideNav, setOpenSideNav }) => {
  const sidenavRef = useRef(null);
  const { pathname } = useLocation();

  const [openBookingMenu, setOpenBookingMenu] = useState(false);

  // Hardcoded sidenavType to "dark"
  const sidenavType = "dark";

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-blue-800 to-red-300 shadow-lg shadow-blue-900",
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

  const handleBookingButtonClick = () => {
    // Toggle the booking menu open/close
    setOpenBookingMenu((prevState) => !prevState);
  };

  return (
    <aside
      ref={sidenavRef}
      className={`${sidenavTypes[sidenavType]} ${
        openSideNav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div className={`relative`}>
        <Link to="/home" className="flex items-center justify-center p-4">
          <div className="flex items-center">
            <img
              src="https://www.ag-solutions.in/assets/images/logo.png"
              alt="Logo"
              className="h-12 w-auto"
            />
            <div className="ml-3 logo-text">
              <div className="logo-title text-white text-lg font-bold">
                <span className="font-black">AG</span> Solution
              </div>
              <div className="logo-sub-title text-gray-400 text-sm">
                Single Click Solution
              </div>
            </div>
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
      <div className="m-4">
        <ul className="mb-4 flex flex-col gap-1">
          <li>
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
                  <HomeIcon className="w-5 h-5 text-inherit" />
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
                  <HomeIcon className="w-5 h-5 text-inherit" />
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
                  <HomeIcon className="w-5 h-5 text-inherit" />
                  <Typography
                    color="inherit"
                    className="font-medium capitalize"
                  >
                    Ideal Field List
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
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
          {/* Booking Dropdown */}
          <li>
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
          </li>

          {/* payment  */}
          <li>
            <NavLink to="/pending-payment">
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
                    Payment
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          {/* commission  */}
          <li>
            <NavLink to="/commission-pending">
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
                    Commission
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          {/* notification  */}
          <li>
            <NavLink to="/notification">
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
                    Notification
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>
          {/* download  */}
          <li>
            <NavLink to="/booking-download">
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
                    Download
                  </Typography>
                </Button>
              )}
            </NavLink>
          </li>

          {/* Add more hardcoded routes here as needed */}
        </ul>
      </div>
    </aside>
  );
};
export default SideNav;
