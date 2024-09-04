import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomeBooking from "./components/booking-care/booking"

function App() {

  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/booking-home" element={<HomeBooking />} />
        </Routes>
    </Router>
    </>
  )
}

export default App