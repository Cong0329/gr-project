import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/pages/Home';
import {HomeBookingCare} from "./components/pages/HomeBooking"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking-home" element={<HomeBookingCare />} />
      </Routes>
    </Router>
  )
}

export default App
