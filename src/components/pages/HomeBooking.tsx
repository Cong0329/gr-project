import HomeBooking from "../home_booking/booking"
import { Footer } from "../footer/Footer"
import { Header } from "../header/Header"
import Specialty from "../home_booking/sections/specialty"
import OnlEx from "../home_booking/sections/onl_ex"
import GeneralEx from "../home_booking/sections/general_ex"



export const HomeBookingCare = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <HomeBooking />
            <Specialty />
            <OnlEx />
            <GeneralEx />
            <Footer />
        </div>
    )
}
