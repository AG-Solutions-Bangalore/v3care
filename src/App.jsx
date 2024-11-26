import { Route, Routes } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
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
import WorkInProgress from "./pages/booking/commonView/editBooking/WorkInProgress";
import PostponeBooking from "./pages/booking/commonView/editBooking/PostponeBooking";
import EditBookingAssign from "./pages/booking/commonView/bookingAssign/EditBookingAssign";
import EditAssignVendor from "./pages/booking/commonView/assignVendor/EditAssignVendor";
import IdealFieldListVendor from "./pages/idealFieldList/idealfieldVendor/IdealFieldListVendor";
import ReceivedDownload from "./pages/download/received/ReceivedDownload";
import PendingDownload from "./pages/download/pending/PendingDownload";
import VendorUserList from "./pages/vendorList/VendorUserList";
import EditVendorUser from "./pages/vendorList/EditVendorUser";
import AddVendorUser from "./pages/vendorList/AddVendorUser";
import AddBranch from "./pages/master/branch/AddBranch";
import AddReferBy from "./pages/master/referBy/AddReferBy";
import AddServiceMaster from "./pages/master/service/AddServiceMaster";
import AddServiceSubMaster from "./pages/master/serviceSub/AddServiceSubMaster";
import AddServicePrice from "./pages/master/servicePrice/AddServicePrice";
import AddFieldTeamMaster from "./pages/master/fieldTeam/AddFieldTeamMaster";
import AddOperationTeam from "./pages/master/operationTeam/AddOperationTeam";
import AddBackhandTeam from "./pages/master/backhandTeam/AddBackhandTeam";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookNow from "./pages/bookNowOutside/BookNow";
import BecomePartner from "./pages/becomePartnerOutside/BecomePartner";
import EditBookingInspection from "./pages/booking/commonView/editBooking/EditBookingInspection";
import AddBookingAssignUser from "./pages/booking/commonView/bookingAssign/AddBookingAssignUser";
import AddBookingVendor from "./pages/booking/commonView/assignVendor/AddBookingVendor";
import UseEscapeKey from "./utils/UseEscapeKey";
import RnrList from "./pages/booking/rnr/RnrList";
import { useContext } from "react";
import { ContextPanel } from "./utils/ContextPanel";
import AllBooking from "./pages/booking/allBooking/AllBooking";
const App = () => {
  const { userType } = useContext(ContextPanel);

  return (
    <>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/add-booking-outside" element={<BookNow />} />
        <Route path="/become-partner-outside" element={<BecomePartner />} />
        <Route path="/maintenance" element={<Maintenance />} />
        {/* dashboard  */}
        <Route path="/home" element={<Home />} />

        {/* booking  */}
        {(userType === "6" ||
          userType === "1" ||
          userType === "4" ||
          userType === "5" ||
          userType === "7") && (
          <>
            <Route path="/view-booking/:id" element={<ViewBooking />} />
            <Route path="/booking-assign/:id" element={<BookingAssign />} />
            <Route
              path="/add-booking-user/:id"
              element={<AddBookingAssignUser />}
            />
            <Route
              path="/add-booking-vendor/:id"
              element={<AddBookingVendor />}
            />

            <Route
              path="/edit-booking-assign/:id"
              element={<EditBookingAssign />}
            />
            <Route path="/assign-vendor/:id" element={<AssignVendor />} />
            <Route
              path="/edit-booking-vendor/:id"
              element={<EditAssignVendor />}
            />
            <Route path="/edit-booking/:id" element={<EditBookingAll />} />
            <Route
              path="/edit-booking-inspection/:id"
              element={<EditBookingInspection />}
            />
            <Route
              path="/booking-reschedule/:id"
              element={<WorkInProgress />}
            />
            <Route path="/postpone-booking/:id" element={<PostponeBooking />} />
            <Route path="/add-booking" element={<AddBooking />} />
            <Route path="/cancel" element={<CancelBooking />} />
            <Route path="/completed" element={<CompletedBooking />} />
            <Route path="/confirmed" element={<ConfirmedBooking />} />
            <Route path="/inspection" element={<InspectionBooking />} />
            <Route path="/pending" element={<PendingBooking />} />
            <Route path="/rnr" element={<RnrList />} />
            <Route path="/today" element={<TodayBooking />} />
            <Route path="/tomorrow" element={<TomorrowBooking />} />
            <Route path="/vendor-job" element={<VendorJobBooking />} />
            <Route path="/all-booking" element={<AllBooking />} />
          </>
        )}
        {/* master  */}
        {(userType === "6" ||
          userType === "4" ||
          userType === "5" ||
          userType === "7") && (
          <>
            <Route path="/branch" element={<BranchMaster />} />
            <Route path="/add-branch" element={<AddBranch />} />
            <Route path="/branch-edit/:id" element={<BranchEditMaster />} />
            <Route path="/refer-by" element={<ReferByMaster />} />
            <Route path="/add-referby" element={<AddReferBy />} />
            <Route path="/refer-by-edit/:id" element={<ReferByEditMaster />} />
            <Route path="/service" element={<ServiceMaster />} />
            <Route path="/add-service" element={<AddServiceMaster />} />
            <Route path="/service-edit/:id" element={<ServiceEditMaster />} />
            <Route path="/service-sub" element={<ServiceSubMaster />} />
            <Route path="/add-service-sub" element={<AddServiceSubMaster />} />
            <Route
              path="/service-sub-edit/:id"
              element={<ServiceSubEditMaster />}
            />
            <Route path="/service-price" element={<ServicePriceMaster />} />
            <Route path="/add-service-price" element={<AddServicePrice />} />
            <Route
              path="/service-price-edit/:id"
              element={<ServicePriceEditMaster />}
            />
            <Route path="/field-team" element={<FieldTeamMaster />} />
            <Route path="/add-field-team" element={<AddFieldTeamMaster />} />
            <Route
              path="/field-team-edit/:id"
              element={<FieldTeamEditMaster />}
            />

            <Route path="/operation-team" element={<OperationTeamMaster />} />
            <Route path="/add-operation-team" element={<AddOperationTeam />} />

            <Route
              path="/operation-team-edit/:id"
              element={<OperationEditTeamMaster />}
            />
            <Route path="/backhand-team" element={<BackhandTeamMaster />} />
            <Route path="/add-backhand-team" element={<AddBackhandTeam />} />
            <Route
              path="/backhand-team-view/:id"
              element={<BackhandViewTeamMaster />}
            />
            <Route
              path="/backhand-team-edit/:id"
              element={<BackhandEditTeamMaster />}
            />
          </>
        )}
        {(userType === "6" ||
          userType === "4" ||
          userType === "5" ||
          userType === "7") && (
          <>
            {/* vendor List  */}
            <Route path="/vendor-list" element={<VendorList />} />
            <Route path="/add-vendor" element={<AddVendor />} />
            <Route path="/vendor-view/:id" element={<ViewVendor />} />
            <Route path="/vendor-edit/:id" element={<EditVendor />} />
            <Route path="/vendor-user-list/:id" element={<VendorUserList />} />
            <Route path="/add-vendor-user/:id" element={<AddVendorUser />} />
            <Route
              path="/edit-vendor-user-list/:id"
              element={<EditVendorUser />}
            />
            <Route
              path="/vendor-pending-edit/:id"
              element={<VendorPendingEdit />}
            />
            <Route
              path="/add-vendor-service/:id"
              element={<AddVendorService />}
            />
          </>
        )}
        {(userType === "6" ||
          userType === "4" ||
          userType === "5" ||
          userType === "7") && (
          <>
            {/* ideal field list  */}
            <Route path="/idealfield-list" element={<IdealFieldList />} />
            <Route
              path="/idealfield-vendor-list"
              element={<IdealFieldListVendor />}
            />
          </>
        )}
        {(userType === "6" ||
          userType === "4" ||
          userType === "5" ||
          userType === "7") && (
          <>
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
          </>
        )}
        {(userType === "6" ||
          userType === "4" ||
          userType === "5" ||
          userType === "7") && (
          <>
            {/* commission  */}
            <Route path="/commission-pending" element={<PendingCommission />} />
            <Route
              path="/pending-commission-view/:id"
              element={<PendingCommissionView />}
            />
            <Route
              path="/commission-received"
              element={<ReceivedsCommission />}
            />
            <Route
              path="/received-commission-view/:id"
              element={<ReceivedCommissionView />}
            />
          </>
        )}
        {(userType === "6" ||
          userType === "4" ||
          userType === "5" ||
          userType === "7") && (
          <>
            {/* notification  */}
            <Route path="/notification" element={<NotificationList />} />
            <Route path="/add-notification" element={<AddNotification />} />
          </>
        )}
        {/* download  */}
        {(userType === "6" ||
          userType === "4" ||
          userType === "5" ||
          userType === "7") && (
          <>
            <Route path="/booking-download" element={<BookingDownload />} />
            <Route path="/vendor-download" element={<VendorDownload />} />
            <Route path="/received-download" element={<ReceivedDownload />} />
            <Route path="/pending-download" element={<PendingDownload />} />
          </>
        )}
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </>
  );
};

export default App;
