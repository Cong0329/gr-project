import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { AppDispatch, RootState } from "../../redux/store";


export const HomeBookingCare = () => {
  const dispatch: AppDispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.doctors);

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
      {loading &&
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-sm">Đang tải...</p>
          </div>
        </div>
      }
    </div>
  );
};
