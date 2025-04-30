import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import adminRoutes from "./components/pages/AdminRouter";
import UserProtectedRoute from "./components/pages/UserProtectedRoute copy";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medicine-detail" element={<MedicineDetail />} />
        <Route path="/medicine-search" element={<SearchPage />} />


        <Route element={<UserProtectedRoute />}>
          <Route path="/profile" element={<Navigate to="/profile/personal-info" replace />} />
          <Route path="/profile/:pageId" element={<ProfilePage />} />
          <Route path="/profile/orders/order-detail/:status" element={<OrderDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>


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

        {adminRoutes}
        <Route path="*" element={<InvalidPage />} />
      </Routes>
    </Router>
  );
}

export default App;
