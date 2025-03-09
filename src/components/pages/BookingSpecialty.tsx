import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import SpecialistPage from "../home_booking/details/SpecialListPage";

export const BookingSpecialty = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SpecialistPage />
      <Footer />
    </div>
  );
};
