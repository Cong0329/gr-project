import { Home } from "lucide-react";
import "./BreadCrumb.css";

export default function Breadcrumb() {
  return (
    <nav className="breadcrumb">
      <Home className="w-4 h-4" />
      <span>{">"}</span>
      <a href="#">Khám chuyên khoa</a>
    </nav>
  );
}
