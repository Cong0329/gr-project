import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import OnlExDetail from "../home_booking/details/OnlExDetail";
import { fetchDoctors } from "../../redux/doctorSlice";
import { fetchDepartments } from "../../redux/departmentSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import DoctorSchedules from "../home_booking/details/component_details/DoctorSchedules";

export const BookingOnlExDetail = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchDepartments());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <OnlExDetail />
        <DoctorSchedules />
      </div>
      <Footer />
    </div>
  );
};
