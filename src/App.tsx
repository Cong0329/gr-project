import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/pages/Home";
import { HomeBookingCare } from "./components/pages/HomeBooking";
import { BookingSpecialty } from "./components/pages/BookingSpecialty";
import { BookingSpecialtyDetail } from "./components/pages/BookingSpecialtyDetail";
import { BookingOnlEx } from "./components/pages/BookingOnlEx";
import { BookingOnlExDetail } from "./components/pages/BookingOnlExDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
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
      </Routes>
    </Router>
  );
}

export default App;
