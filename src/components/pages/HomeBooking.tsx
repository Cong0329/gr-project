import HomeBooking from "../home_booking/booking"
import { Footer } from "../footer/Footer"
import { Header } from "../header/Header"
import Specialty from "../home_booking/sections/specialty"
import OnlEx from "../home_booking/sections/onl_ex"
import GeneralEx from "../home_booking/sections/general_ex"
import MedicalTest from "../home_booking/sections/medical_test"



export const HomeBookingCare = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <HomeBooking />
            <Specialty />
            <OnlEx />
            <GeneralEx />
            <MedicalTest />
            <Footer />
        </div>
    )
}
