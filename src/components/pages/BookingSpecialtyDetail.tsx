import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchDoctors } from "../../redux/doctorSlice";
import { fetchDepartments } from "../../redux/departmentSlice";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import DoctorList from "../home_booking/details/component_details/DoctorList";
import SpecialtyDetail from "../home_booking/details/SpecialtyDetail";

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
      <DoctorList />
      <Footer />
    </div>
  );
};
