import { useState } from "react";
import Footer from "../components/Footer";
import DashboardNavbar from "../components/DashboardNavbar";
import SideNav from "../components/SideNav";

const Layout = ({ children }) => {
  const [openSideNav, setOpenSideNav] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 relative">
      <SideNav openSideNav={openSideNav} setOpenSideNav={setOpenSideNav} />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar
          openSideNav={openSideNav}
          setOpenSideNav={setOpenSideNav}
        />
        {children}
        {/* Uncomment Footer if needed */}
        {/* <div className="text-blue-gray-600">
          <Footer />
        </div> */}
      </div>

      {/* Floating Add Booking Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition duration-300"
        onClick={() => alert("Add Booking")}
      >
        Add Booking
      </button>
    </div>
  );
};

export default Layout;
