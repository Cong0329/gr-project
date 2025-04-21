import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import AppointmentPage from "../home_booking/Appointment";

export const BookingAppoinment = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <AppointmentPage />
      </div>
      <Footer />
    </div>
  );
};
