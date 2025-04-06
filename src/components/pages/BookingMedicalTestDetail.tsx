import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import MedicalTestDetail from "../home_booking/details/MedicalTestDetail";

export const BookingMedicalTestDetail = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <MedicalTestDetail />
      </div>
      <Footer />
    </div>
  );
};
