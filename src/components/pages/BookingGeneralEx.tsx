import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import GeneralExListPage from "../home_booking/details/GeneralExListPage";

export const BookingGeneralEx = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <GeneralExListPage />
      </div>
      <Footer />
    </div>
  );
};
