import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import GeneralExDetail from "../home_booking/details/GeneralExDetail";

export const BookingGeneralExDetail = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow mb-10">
        <GeneralExDetail />
      </div>
      <Footer />
    </div>
  );
};
