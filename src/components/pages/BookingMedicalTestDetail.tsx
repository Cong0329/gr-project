import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import DoctorList from "../home_booking/details/component_details/DoctorList";
import MedicalTestDetail from "../home_booking/details/MedicalTestDetail";

export const BookingMedicalTestDetail = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <MedicalTestDetail />
        <DoctorList />
      </div>
      <Footer />
    </div>
  );
};
