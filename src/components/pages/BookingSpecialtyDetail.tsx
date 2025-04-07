import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchDoctors } from "../../redux/doctorSlice";
import { fetchDepartments } from "../../redux/departmentSlice";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import SpecialtyDetail from "../home_booking/details/SpecialtyDetail";
import DoctorSchedules from "../home_booking/details/component_details/DoctorSchedules";

export const BookingSpecialtyDetail = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchDepartments());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SpecialtyDetail />
      <DoctorSchedules />
      <Footer />
    </div>
  );
};
