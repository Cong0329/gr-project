import { Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./BreadCrumb.css";

interface BreadcrumbItem {
  pathMatch: string;
  label: string;
  to: string;
}

// Cấu hình breadcrumb, đảm bảo breadcrumb cha sẽ luôn trỏ đến trang danh sách chính
const breadcrumbConfig: BreadcrumbItem[] = [
  { pathMatch: "/profile/orders/order-detail", label: "Chi tiết đơn hàng", to: "/profile/orders/order-detail" },
  { pathMatch: "/profile/orders", label: "Đơn hàng", to: "/profile/orders" },
  { pathMatch: "/profile/prescriptions", label: "Đơn thuốc", to: "/profile/prescriptions" },
  { pathMatch: "/profile/personal-info", label: "Thông tin cá nhân", to: "/profile/personal-info" },
  { pathMatch: "/profile", label: "Cá nhân", to: "/profile" },

  // Đảm bảo "Khám chuyên khoa" và "Khám từ xa" luôn dẫn đến trang danh sách chính
  { pathMatch: "/booking-home/specialty", label: "Khám chuyên khoa", to: "/booking-home/specialty-list" },
  { pathMatch: "/booking-home/specialty-detail", label: "Khám chuyên khoa", to: "/booking-home/specialty-list" },

  { pathMatch: "/booking-home/onlex", label: "Khám từ xa", to: "/booking-home/onlex-list" },
  { pathMatch: "/booking-home/onlex-detail", label: "Khám từ xa", to: "/booking-home/onlex-list" },

  { pathMatch: "/booking-home/generalex", label: "Khám tổng quát", to: "/booking-home/generalex-list" },
  { pathMatch: "/booking-home/generalex-detail", label: "Khám tổng quát", to: "/booking-home/generalex-list" },
  { pathMatch: "/booking-home/medicaltest", label: "Xét nghiệm y học", to: "/booking-home/medicaltest-list" },
  { pathMatch: "/booking-home/medicaltest-detail", label: "Xét nghiệm y học", to: "/booking-home/medicaltest-list" },
];

export default function Breadcrumb() {
  const location = useLocation();
  const path = location.pathname;

  // Tìm breadcrumb phù hợp với path hiện tại
  const matchedBreadcrumbs: BreadcrumbItem[] = [];
  breadcrumbConfig.forEach((item) => {
    if (path.startsWith(item.pathMatch)) {
      const exists = matchedBreadcrumbs.find((b) => b.label === item.label && b.to === item.to);
      if (!exists) matchedBreadcrumbs.push(item);
    }
  });

  // Sắp xếp breadcrumb theo độ dài của pathMatch (để hiển thị theo thứ tự chính xác)
  matchedBreadcrumbs.sort((a, b) => a.pathMatch.length - b.pathMatch.length);

  // Lấy segment cuối cùng của đường dẫn
  const pathSegments = decodeURIComponent(path).split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  // Điều kiện để không hiển thị nếu là "status" hay số liệu
  const isStatusSegment = lastSegment && lastSegment.match(/^([a-zA-Z0-9-]+)$/);

  const showLastSegment =
    lastSegment &&
    !matchedBreadcrumbs.some((b) => decodeURIComponent(lastSegment).includes(b.label)) &&
    !lastSegment.match(/^\d+$/) &&
    !lastSegment.includes("list") &&
    !isStatusSegment;

  return (
    <nav className="breadcrumb py-4 flex items-center space-x-2 text-gray-600 bg-gray-50">
      <Link
        to={path.startsWith("/booking-home") ? "/booking-home" : "/"}
        className="flex items-center hover:text-blue-500"
      >
        <Home className="w-4 h-4" />
      </Link>

      {matchedBreadcrumbs.map((item, index) => {
        const isLastBreadcrumb = index === matchedBreadcrumbs.length - 1;
        const isParentBreadcrumb = item.pathMatch === "/booking-home/specialty" || item.pathMatch === "/booking-home/onlex" || item.pathMatch === "/booking-home/generalex" || item.pathMatch === "/booking-home/medicaltest"; // Kiểm tra xem breadcrumb có phải là cha hay không

        return (
          <span key={index} className="flex items-center space-x-2">
            <span>{">"}</span>
            {isLastBreadcrumb && !isParentBreadcrumb ? (
              // Các breadcrumb cuối không thể nhấn và có màu khác (breadcrumb con)
              <span className="text-gray-500 font-semibold">{item.label}</span>
            ) : (
              // Các breadcrumb cha có thể nhấn
              <Link to={item.to} className="hover:text-blue-500">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}

      {/* Hiển thị lastSegment nếu không phải là route đã được config */}
      {showLastSegment && (
        <span className="flex items-center space-x-2">
          <span>{">"}</span>
          <span className="text-gray-900 font-semibold">
            {decodeURIComponent(lastSegment)}
          </span>
        </span>
      )}
    </nav>
  );
}
