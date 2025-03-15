import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import MedicalTestListPage from "../home_booking/details/MedicalTestListPage";

export const BookingMedicalTest = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <MedicalTestListPage />
      </div>
      <Footer />
    </div>
  );
};
