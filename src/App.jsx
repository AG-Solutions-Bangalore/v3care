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
import BranchMaster from "./pages/master/branch/BranchMaster";
import ReferByMaster from "./pages/master/referBy/ReferByMaster";
import ServiceMaster from "./pages/master/service/ServiceMaster";
import ServiceSubMaster from "./pages/master/serviceSub/ServiceSubMaster";
import ServicePriceMaster from "./pages/master/servicePrice/ServicePriceMaster";
import FieldTeamMaster from "./pages/master/fieldTeam/FieldTeamMaster";
import OperationTeamMaster from "./pages/master/operationTeam/OperationTeamMaster";
import BackhandTeamMaster from "./pages/master/backhandTeam/BackhandTeamMaster";
import VendorList from "./pages/vendorList/VendorList";
import IdealFieldList from "./pages/idealFieldList/IdealFieldList";
import PendingPayment from "./pages/payment/pending/PendingPayment";
import ReceivedPayment from "./pages/payment/received/ReceivedPayment";
import PendingCommission from "./pages/commission/pending/PendingCommission";
import ReceivedsCommission from "./pages/commission/received/ReceivedsCommission";
import NotificationList from "./pages/notification/NotificationList";
import BookingDownload from "./pages/download/booking/BookingDownload";
import VendorDownload from "./pages/download/vendor/VendorDownload";
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
        {/* master  */}
        <Route path="/branch" element={<BranchMaster />} />
        <Route path="/refer-by" element={<ReferByMaster />} />
        <Route path="/service" element={<ServiceMaster />} />
        <Route path="/service-sub" element={<ServiceSubMaster />} />
        <Route path="/service-price" element={<ServicePriceMaster />} />
        <Route path="/field-team" element={<FieldTeamMaster />} />
        <Route path="operation-team" element={<OperationTeamMaster />} />
        <Route path="/backhand-team" element={<BackhandTeamMaster />} />
        {/* vendor List  */}
        <Route path="/vendor-list" element={<VendorList />} />
        {/* ideal field list  */}
        <Route path="/idealfield-list" element={<IdealFieldList />} />
        {/* payment  */}
        <Route path="/pending-payment" element={<PendingPayment />} />
        <Route path="/received-payment" element={<ReceivedPayment />} />
        {/* commission  */}
        <Route path="/commission-pending" element={<PendingCommission />} />
        <Route path="/commission-received" element={<ReceivedsCommission />} />
        {/* notification  */}
        <Route path="/notification" element={<NotificationList />} />
        {/* download  */}
        <Route path="/booking-download" element={<BookingDownload />} />
        <Route path="/vendor-download" element={<VendorDownload />} />
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
