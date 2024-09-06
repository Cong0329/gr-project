import HomeBooking from "../home_booking/booking"
import { Footer } from "../footer/Footer"
import { Header } from "../header/Header"
import Specialty from "../home_booking/sections/specialty"


export const HomeBookingCare = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <HomeBooking />
            <Specialty />
            <Footer />
        </div>
    )
}
