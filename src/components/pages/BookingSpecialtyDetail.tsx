import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import DoctorList from "../home_booking/details/component_details/DoctorList";
import ScheduleList from "../home_booking/details/component_details/ScheduleList";
import SpecialtyDetail from "../home_booking/details/SpecialtyDetail";

export const BookingSpecialtyDetail = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SpecialtyDetail />
      <DoctorList />
      <ScheduleList />
      <Footer />
    </div>
  );
};
