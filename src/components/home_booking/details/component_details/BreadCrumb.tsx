import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import "./BreadCrumb.css";

export default function Breadcrumb({ current }) {
  return (
    <nav className="breadcrumb py-4 flex items-center space-x-2 text-gray-600">
      <Link
        to="/booking_home"
        className="flex items-center hover:text-blue-500"
      >
        <Home className="w-4 h-4" />
      </Link>
      <span>{">"}</span>
      <Link to="/booking_home/specialty_list" className="hover:text-blue-500">
        Khám chuyên khoa
      </Link>
      {current && (
        <>
          <span>{">"}</span>
          <span className="text-gray-900 font-semibold">{current}</span>
        </>
      )}
    </nav>
  );
}
