import { Route, Routes } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/profile/ChangePassword";
import AddBooking from "./pages/booking/addBooking/AddBooking";
import CancelBooking from "./pages/booking/cancel/CancelBooking";
import CompletedBooking from "./pages/booking/completed/CompletedBooking";
import ConfirmedBooking from "./pages/booking/confirmed/ConfirmedBooking";
import InspectionBooking from "./pages/booking/inspection/InspectionBooking";
import PendingBooking from "./pages/booking/pending/PendingBooking";
import TodayBooking from "./pages/booking/today/TodayBooking";
import TomorrowBooking from "./pages/booking/tomorrow/TomorrowBooking";
import VendorJobBooking from "./pages/booking/vendorJob/VendorJobBooking";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/add-booking" element={<AddBooking />} />
        <Route path="/cancel" element={<CancelBooking />} />
        <Route path="/completed" element={<CompletedBooking />} />
        <Route path="/confirmed" element={<ConfirmedBooking />} />
        <Route path="/inspection" element={<InspectionBooking />} />
        <Route path="/pending" element={<PendingBooking />} />
        <Route path="/today" element={<TodayBooking />} />
        <Route path="/tomorrow" element={<TomorrowBooking />} />
        <Route path="/vendor-job" element={<VendorJobBooking />} />

        <Route
          path="/profile"
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path="/change-password"
          element={<ProtectedRoute element={<ChangePassword />} />}
        />

        {/* <Route
          path="*"
          element={<ProtectedRoute element={<Navigate to="/" />} />}
        /> */}
      </Routes>
    </>
  );
};

export default App;
