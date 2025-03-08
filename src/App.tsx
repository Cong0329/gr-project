import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/pages/Home';
import {HomeBookingCare} from "./components/pages/HomeBooking"
import { BookingSpecialty } from './components/pages/BookingSpecialty';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking_home" element={<HomeBookingCare />} />
        <Route path="/booking_home/specialty_detail" element={<BookingSpecialty />} />
      </Routes>
    </Router>
  )
}

export default App
