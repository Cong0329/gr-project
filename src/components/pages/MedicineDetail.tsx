
import { Footer } from "../footer/Footer"
import { Header } from "../header/Header"
import { MedicineBody } from "../medicine_detail/MediBody"


export const MedicineDetail = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <MedicineBody />
            <Footer />
        </div>
    )
}
