import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomeComponets from "./components/booking-care/booking"

function App() {

  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/booking-home" element={<HomeComponets />} />
        </Routes>
    </Router>
    </>
  )
}

export default App