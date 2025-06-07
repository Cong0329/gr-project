import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchDoctors } from "../../redux/doctorSlice";
import { fetchDepartments } from "../../redux/departmentSlice";
import HomeBooking from "../home_booking/booking";
import { Footer } from "../footer/Footer";
import { Header } from "../header/Header";
import Specialty from "../home_booking/sections/specialty";
import OnlEx from "../home_booking/sections/OnlEx";
import GeneralEx from "../home_booking/sections/GeneralEx";
import MedicalTest from "../home_booking/sections/MedicalTest";
import ChatBox from "../chatbox/chatbox";
import { AppDispatch } from "../../redux/store";

export const HomeBookingCare = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchDepartments());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HomeBooking />
      <Specialty />
      <OnlEx />
      <GeneralEx />
      <MedicalTest />
      <Footer />
      <ChatBox />
    </div>
  );
};
