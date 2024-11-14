import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  IconButton,
  Breadcrumbs,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { HiArrowRightStartOnRectangle } from "react-icons/hi2";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs"; // Added fullscreen icons
import { useState, useEffect } from "react";
import Logout from "./Logout";

const DashboardNavbar = ({ openSideNav, setOpenSideNav, isCollapsed, setIsCollapsed }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const useType = localStorage.getItem("user_type_id");
  const [openModal, setOpenModal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleOpenLogout = () => setOpenModal(!openModal);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.log(`Error attempting to enable fullscreen: ${e.message}`);
      });
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const pathSegments = pathname.split("/").filter((el) => el !== "");
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
          {/* Booking Button */}
          {(useType === "1" || useType === "5" || useType === "6" || useType === "7") && (
            <button
              className="text-white hover:text-blue-700 animate-pulse"
              onClick={() => navigate("/add-booking")}
            >
              + Booking
            </button>
          )}

          {/* Fullscreen Toggle */}
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