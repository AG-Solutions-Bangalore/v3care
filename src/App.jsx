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
import BranchEditMaster from "./pages/master/branch/BranchEditMaster";
import ReferByEditMaster from "./pages/master/referBy/ReferByEditMaster";
import ServiceEditMaster from "./pages/master/service/ServiceEditMaster";
import ServiceSubEditMaster from "./pages/master/serviceSub/ServiceSubEditMaster";
import ServicePriceEditMaster from "./pages/master/servicePrice/ServicePriceEditMaster";
import FieldTeamEditMaster from "./pages/master/fieldTeam/FieldTeamEditMaster";
import FieldTeamViewMaster from "./pages/master/fieldTeam/FieldTeamViewMaster";
import OperationViewTeamMaster from "./pages/master/operationTeam/OperationViewTeamMaster";
import OperationEditTeamMaster from "./pages/master/operationTeam/OperationEditTeamMaster";
import BackhandViewTeamMaster from "./pages/master/backhandTeam/BackhandViewTeamMaster";
import BackhandEditTeamMaster from "./pages/master/backhandTeam/BackhandEditTeamMaster";
import AddVendor from "./pages/vendorList/AddVendor";
import ViewVendor from "./pages/vendorList/ViewVendor";
import EditVendor from "./pages/vendorList/EditVendor";
import VendorPendingEdit from "./pages/vendorList/VendorPendingEdit";
import AddVendorService from "./pages/vendorList/AddVendorService";
import PendingPaymentView from "./pages/payment/pending/PendingPaymentView";
import PendingReceivedView from "./pages/payment/received/PendingReceivedView";
import PendingCommissionView from "./pages/commission/pending/PendingCommissionView";
import AddNotification from "./pages/notification/AddNotification";
import ReceivedCommissionView from "./pages/commission/received/ReceivedCommissionView";
import ViewBooking from "./pages/booking/commonView/ViewBooking";
import BookingAssign from "./pages/booking/commonView/bookingAssign/BookingAssign";
import AssignVendor from "./pages/booking/commonView/assignVendor/AssignVendor";
import EditBookingAll from "./pages/booking/commonView/editBooking/EditBookingAll";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/maintenance" element={<Maintenance />} />
        {/* booking  */}
        <Route path="/view-booking/:id" element={<ViewBooking />} />
        <Route path="/booking-assign/:id" element={<BookingAssign />} />
        <Route path="/assign-vendor/:id" element={<AssignVendor />} />
        <Route path="/edit-booking/:id" element={<EditBookingAll />} />
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
        <Route path="/branch-edit/:id" element={<BranchEditMaster />} />
        <Route path="/refer-by" element={<ReferByMaster />} />
        <Route path="/refer-by-edit/:id" element={<ReferByEditMaster />} />
        <Route path="/service" element={<ServiceMaster />} />
        <Route path="/service-edit/:id" element={<ServiceEditMaster />} />
        <Route path="/service-sub" element={<ServiceSubMaster />} />
        <Route
          path="/service-sub-edit/:id"
          element={<ServiceSubEditMaster />}
        />
        <Route path="/service-price" element={<ServicePriceMaster />} />
        <Route
          path="/service-price-edit/:id"
          element={<ServicePriceEditMaster />}
        />
        <Route path="/field-team" element={<FieldTeamMaster />} />
        <Route path="/field-team-edit/:id" element={<FieldTeamEditMaster />} />
        <Route path="/field-team-view/:id" element={<FieldTeamViewMaster />} />
        <Route path="operation-team" element={<OperationTeamMaster />} />
        <Route
          path="/operation-team-view/:id"
          element={<OperationViewTeamMaster />}
        />
        <Route
          path="/operation-team-edit/:id"
          element={<OperationEditTeamMaster />}
        />
        <Route path="/backhand-team" element={<BackhandTeamMaster />} />
        <Route
          path="/backhand-team-view/:id"
          element={<BackhandViewTeamMaster />}
        />
        <Route
          path="/backhand-team-edit/:id"
          element={<BackhandEditTeamMaster />}
        />
        {/* vendor List  */}
        <Route path="/vendor-list" element={<VendorList />} />
        <Route path="/add-vendor" element={<AddVendor />} />
        <Route path="/vendor-view/:id" element={<ViewVendor />} />
        <Route path="/vendor-edit/:id" element={<EditVendor />} />
        <Route
          path="/vendor-pending-edit/:id"
          element={<VendorPendingEdit />}
        />
        <Route path="/add-vendor-service/:id" element={<AddVendorService />} />
        {/* ideal field list  */}
        <Route path="/idealfield-list" element={<IdealFieldList />} />
        {/* payment  */}
        <Route path="/pending-payment" element={<PendingPayment />} />
        <Route
          path="/pending-payment-view/:id"
          element={<PendingPaymentView />}
        />
        <Route path="/received-payment" element={<ReceivedPayment />} />
        <Route
          path="/pending-received-view/:id"
          element={<PendingReceivedView />}
        />
        {/* commission  */}
        <Route path="/commission-pending" element={<PendingCommission />} />
        <Route
          path="/pending-commission-view/:id"
          element={<PendingCommissionView />}
        />
        <Route path="/commission-received" element={<ReceivedsCommission />} />
        <Route
          path="/received-commission-view/:id"
          element={<ReceivedCommissionView />}
        />
        {/* notification  */}
        <Route path="/notification" element={<NotificationList />} />
        <Route path="/add-notification" element={<AddNotification />} />
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
