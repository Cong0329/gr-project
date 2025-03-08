import { Footer } from "../footer/Footer"
import { Header } from "../header/Header"
import SpecialtyDetail from "../home_booking/details/SpecialtyDetail"



export const BookingSpecialty = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <SpecialtyDetail />
            <Footer />
        </div>
    )
}
