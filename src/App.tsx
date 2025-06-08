import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Home } from "./components/pages/Home";
import { HomeBookingCare } from "./components/pages/HomeBooking";
import { BookingSpecialty } from "./components/pages/BookingSpecialty";
import { BookingSpecialtyDetail } from "./components/pages/BookingSpecialtyDetail";
import { BookingOnlEx } from "./components/pages/BookingOnlEx";
import { BookingOnlExDetail } from "./components/pages/BookingOnlExDetail";
import { BookingGeneralEx } from "./components/pages/BookingGeneralEx";
import { BookingGeneralExDetail } from "./components/pages/BookingGeneralExDetail";
import { BookingMedicalTest } from "./components/pages/BookingMedicalTest";
import { BookingMedicalTestDetail } from "./components/pages/BookingMedicalTestDetail";
import { MedicineDetail } from "./components/pages/MedicineDetail";
import { SearchPage } from "./components/pages/MedicineSearch";
import ScrollToTop from "./components/home_booking/details/component_details/ScrollToTop";
import { CartPage } from "./components/pages/CartPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import InvalidPage from "./components/information/InvalidPage";
import { OrderDetailPage } from "./components/pages/OrderDetailPage";
import UserProtectedRoute from "./components/pages/UserProtectedRoute copy";
// import { BookingAppoinment } from "./components/pages/BookingAppoinment";
import { ToastContainer } from "react-toastify";
import { Toaster } from 'react-hot-toast';
import ChatBoxWrapper from "./components/chatbox/chatboWrap";
import { BookingPayment } from "./components/pages/BookingPayment";
import appRoutes from "./components/pages/AppRoutes";
import PolicyPage from "./components/pages/PolicyPage";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer />
      <Toaster position="top-right" reverseOrder={false} />
      <ChatBoxWrapper />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medicine-detail/:slug" element={<MedicineDetail />} />
        <Route path="/medicine-search" element={<SearchPage />} />

        <Route element={<UserProtectedRoute />}>
          <Route
            path="/profile"
            element={<Navigate to="/profile/personal-info" replace />}
          />
          <Route path="/profile/:pageId" element={<ProfilePage />} />
          <Route
            path="/profile/orders/order-detail/:id"
            element={<OrderDetailPage />}
          />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        {/* <Route path="/cart" element={<CartPage />} /> */}
        <Route
          path="/profile"
          element={<Navigate to="/profile/personal-info" replace />}
        />
        <Route path="/profile/:pageId" element={<ProfilePage />} />
        <Route
          path="/profile/orders/order-detail/:status"
          element={<OrderDetailPage />}
        />

        <Route path="/booking-home" element={<HomeBookingCare />} />
        <Route
          path="/booking-home/specialty-list"
          element={<BookingSpecialty />}
        />
        <Route
          path="/booking-home/specialty-detail/:name"
          element={<BookingSpecialtyDetail />}
        />
        <Route path="/booking-home/onlex-list" element={<BookingOnlEx />} />
        <Route
          path="/booking-home/onlex-detail/:name"
          element={<BookingOnlExDetail />}
        />
        <Route
          path="/booking-home/generalex-list"
          element={<BookingGeneralEx />}
        />
        <Route
          path="/booking-home/generalex-detail/:name"
          element={<BookingGeneralExDetail />}
        />
        <Route
          path="/booking-home/medicaltest-list"
          element={<BookingMedicalTest />}
        />
        <Route
          path="/booking-home/medicaltest-detail/:name"
          element={<BookingMedicalTestDetail />}
        />
        <Route path="/booking-home/payment" element={<BookingPayment />} />

        {appRoutes}
        <Route path="*" element={<InvalidPage />} />
        <Route path="/privacy-policy" element={<PolicyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
