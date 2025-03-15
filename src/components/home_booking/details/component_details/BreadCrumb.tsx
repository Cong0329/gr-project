import { Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./BreadCrumb.css";

export default function Breadcrumb({ current }) {
  const location = useLocation();

  return (
    <nav className="breadcrumb py-4 flex items-center space-x-2 text-gray-600">
      <Link
        to="/booking-home"
        className="flex items-center hover:text-blue-500"
      >
        <Home className="w-4 h-4" />
      </Link>
      <span>{">"}</span>

      {location.pathname.includes("/booking-home/specialty-list") && (
        <Link to="/booking-home/specialty-list" className="hover:text-blue-500">
          Khám chuyên khoa
        </Link>
      )}

      {location.pathname.includes("/booking-home/onlex-list") && (
        <Link to="/booking-home/onlex-list" className="hover:text-blue-500">
          Khám từ xa
        </Link>
      )}

      {current && (
        <>
          <span>{">"}</span>
          <span className="text-gray-900 font-semibold">{current}</span>
        </>
      )}
    </nav>
  );
}
