import { Bars3Icon, UserCircleIcon } from "@heroicons/react/24/solid";
import {
  Breadcrumbs,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { HiArrowRightStartOnRectangle } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import Logout from "./Logout";
import ButtonConfigColor from "./common/ButtonConfig/ButtonConfigColor";

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
  const [isFullscreen, setIsFullscreen] = useState(false);

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
