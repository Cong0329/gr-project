import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import DoctorList from "../home_booking/details/component_details/DoctorList";
import OnlExDetail from "../home_booking/details/OnlExDetail";

export const BookingOnlExDetail = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <OnlExDetail />
        <DoctorList />
      </div>
      <Footer />
    </div>
  );
};
