import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import DoctorList from "../home_booking/details/component_details/DoctorList";
import GeneralExDetail from "../home_booking/details/GeneralExDetail";

export const BookingGeneralExDetail = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <GeneralExDetail />
        <DoctorList />
      </div>
      <Footer />
    </div>
  );
};
