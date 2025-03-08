import HomeBooking from "../home_booking/Booking"
import { Footer } from "../footer/Footer"
import { Header } from "../header/Header"
import Specialty from "../home_booking/sections/Specialty"
import OnlEx from "../home_booking/sections/OnlEx"
import GeneralEx from "../home_booking/sections/GeneralEx"
import MedicalTest from "../home_booking/sections/MedicalTest"
import ChatBox from "../chatbox/chatbox"



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
            <ChatBox />
        </div>
    )
}
