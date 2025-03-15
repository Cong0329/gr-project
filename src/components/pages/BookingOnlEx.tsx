import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import OnlExListPage from "../home_booking/details/OnlExListPage";

export const BookingOnlEx = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <OnlExListPage />
      </div>
      <Footer />
    </div>
  );
};
