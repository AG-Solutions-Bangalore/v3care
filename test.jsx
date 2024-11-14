// Layout.jsx
import { useState, useEffect } from "react";
import DashboardNavbar from "./DashboardNavbar";
import SideNav from "./SideNav";

const Layout = ({ children }) => {
  const [openSideNav, setOpenSideNav] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Initialize from localStorage, default to false if not set
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Persist collapse state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleCollapseChange = (newState) => {
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100">
      <SideNav 
        openSideNav={openSideNav} 
        setOpenSideNav={setOpenSideNav}
        isCollapsed={isCollapsed} 
      />
      <div className={`p-4 ${isCollapsed ? 'xl:ml-28' : 'xl:ml-72'} transition-all duration-300`}>
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

// DashboardNavbar.jsx
const DashboardNavbar = ({ openSideNav, setOpenSideNav, isCollapsed, setIsCollapsed }) => {
  // ... other code remains the same

  const toggleSidebarCollapse = () => {
    setIsCollapsed(!isCollapsed); // This will now use the handler that updates localStorage
  };

  // ... rest of the component remains the same
};

// SideNav.jsx
const SideNav = ({ openSideNav, setOpenSideNav, isCollapsed }) => {
  const sidenavRef = useRef(null);
  const { pathname } = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const userType = localStorage.getItem("user_type_id");
  const sidenavType = "dark";

  // Modified to only handle mobile navigation
  useEffect(() => {
    if (window.innerWidth < 1280) {
      setOpenSideNav(false);
    }
  }, [pathname, setOpenSideNav]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (sidenavRef.current && !sidenavRef.current.contains(e.target)) {
        if (window.innerWidth < 1280) {
          setOpenSideNav(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenSideNav]);

  return (
    <aside
      ref={sidenavRef}
      className={`${sidenavTypes[sidenavType]} ${
        openSideNav ? "translate-x-0" : "-translate-x-80"
      } ${
        isCollapsed ? "xl:w-[5.5rem]" : "w-[272px] xl:w-[272px]"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] rounded-xl transition-all duration-300 ease-in-out xl:translate-x-0 border border-blue-gray-100`}
    >
      {/* Rest of your sidebar JSX remains the same */}
    </aside>
  );
};