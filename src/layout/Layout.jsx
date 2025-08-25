import { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import SideNav from "../components/SideNav";

const Layout = ({ children }) => {
  const [openSideNav, setOpenSideNav] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleCollapseChange = (newState) => {
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 ">
      <SideNav
        openSideNav={openSideNav}
        setOpenSideNav={setOpenSideNav}
        isCollapsed={isCollapsed}
      />
      <div
        className={`p-4 ${
          isCollapsed ? "xl:ml-28" : "xl:ml-72"
        } transition-all duration-300`}
      >
        <DashboardNavbar
          openSideNav={openSideNav}
          setOpenSideNav={setOpenSideNav}
          isCollapsed={isCollapsed}
          setIsCollapsed={handleCollapseChange}
        />
        {children}
      </div>
    </div>
  );
};

export default Layout;
