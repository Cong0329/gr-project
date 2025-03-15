import { Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./BreadCrumb.css";

export default function Breadcrumb({ current }) {
  const location = useLocation();
  const isSpecialty = location.pathname.includes("/booking-home/specialty");
  const isOnlex = location.pathname.includes("/booking-home/onlex");
  const isGeneralEx = location.pathname.includes("/booking-home/generalex");
  const isMedicalTest = location.pathname.includes("/booking-home/medicaltest");

  return (
    <nav className="breadcrumb py-4 flex items-center space-x-2 text-gray-600">
      <Link
        to="/booking-home"
        className="flex items-center hover:text-blue-500"
      >
        <Home className="w-4 h-4" />
      </Link>
      <span>{">"}</span>

      {isSpecialty && (
        <>
          <Link
            to="/booking-home/specialty-list"
            className="hover:text-blue-500"
          >
            Khám chuyên khoa
          </Link>
          <span>{">"}</span>
        </>
      )}

      {isOnlex && (
        <>
          <Link to="/booking-home/onlex-list" className="hover:text-blue-500">
            Khám từ xa
          </Link>
          <span>{">"}</span>
        </>
      )}

      {isGeneralEx && (
        <>
          <Link
            to="/booking-home/generalex-list"
            className="hover:text-blue-500"
          >
            Khám tổng quát
          </Link>
          <span>{">"}</span>
        </>
      )}

      {isMedicalTest && (
        <>
          <Link
            to="/booking-home/medicaltest-list"
            className="hover:text-blue-500"
          >
            Xét nghiệm y học
          </Link>
          <span>{">"}</span>
        </>
      )}

      {current && (
        <span className="text-gray-900 font-semibold">{current}</span>
      )}
    </nav>
  );
}
