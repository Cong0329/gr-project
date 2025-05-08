import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import PaymentPage from "../home_booking/Payment";

export const BookingPayment = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <PaymentPage />
      </div>
      <Footer />
    </div>
  );
};
