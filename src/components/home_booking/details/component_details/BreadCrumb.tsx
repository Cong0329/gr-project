import { Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./BreadCrumb.css";

interface BreadcrumbItem {
  pathMatch: string;
  label: string;
  to: string;
}

const breadcrumbConfig: BreadcrumbItem[] = [
  { pathMatch: "/profile/orders/order-detail", label: "Chi tiết đơn hàng", to: "/profile/orders/order-detail" },
  { pathMatch: "/profile/orders", label: "Đơn hàng", to: "/profile/orders" },
  { pathMatch: "/profile/chat", label: "Tin nhắn", to: "/profile/chat" },
  { pathMatch: "/profile/addresses", label: "Địa chỉ", to: "/profile/addresses" },
  { pathMatch: "/profile/health-check", label: "Lịch khám sức khoẻ", to: "/profile/health-check" },
  { pathMatch: "/profile/prescriptions", label: "Đơn thuốc", to: "/profile/prescriptions" },
  { pathMatch: "/profile/personal-info", label: "Thông tin cá nhân", to: "/profile/personal-info" },
  { pathMatch: "/profile", label: "Cá nhân", to: "/profile" },
  { pathMatch: "/medicine-search", label: "Danh mục", to: "/medicine-search" },

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
  const searchParams = new URLSearchParams(location.search);

  const [queryKey] = Array.from(searchParams.keys());
  const queryValue = queryKey ? searchParams.get(queryKey) : null;

  const matchedBreadcrumbs: BreadcrumbItem[] = [];
  breadcrumbConfig.forEach((item) => {
    if (path.startsWith(item.pathMatch)) {
      const exists = matchedBreadcrumbs.find((b) => b.label === item.label && b.to === item.to);
      if (!exists) matchedBreadcrumbs.push(item);
    }
  });

  // Nếu là medicine-search và có query là brand => đổi label thành Thương hiệu
  const medicineBreadcrumbIndex = matchedBreadcrumbs.findIndex(
    (b) => b.pathMatch === "/medicine-search"
  );

  if (medicineBreadcrumbIndex !== -1 && queryKey === "brand") {
    matchedBreadcrumbs[medicineBreadcrumbIndex] = {
      ...matchedBreadcrumbs[medicineBreadcrumbIndex],
      label: "Thương hiệu",
    };
  }

  matchedBreadcrumbs.sort((a, b) => a.pathMatch.length - b.pathMatch.length);

  const pathSegments = decodeURIComponent(path).split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  const isStatusSegment = lastSegment && lastSegment.match(/^([a-zA-Z0-9-]+)$/);
  const showLastSegment =
    lastSegment &&
    !matchedBreadcrumbs.some((b) => decodeURIComponent(lastSegment).includes(b.label)) &&
    !lastSegment.match(/^\d+$/) &&
    !lastSegment.includes("list") &&
    !isStatusSegment;

  const formatLabel = (text: string) => {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
        const isParentBreadcrumb = [
          "/booking-home/specialty",
          "/booking-home/onlex",
          "/booking-home/generalex",
          "/booking-home/medicaltest",
        ].includes(item.pathMatch);

        return (
          <span key={index} className="flex items-center space-x-2">
            <span>{">"}</span>
            {isLastBreadcrumb && !isParentBreadcrumb ? (
              <span className="text-gray-500 font-semibold">{item.label}</span>
            ) : (
              <Link to={item.to} className="hover:text-blue-500">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}

      {/* Hiển thị query param nếu đang ở medicine-search */}
      {path.startsWith("/medicine-search") && queryValue && (
        <span className="flex items-center space-x-2">
          <span>{">"}</span>
          <span className="text-gray-900 font-semibold">
            {formatLabel(decodeURIComponent(queryValue))}
          </span>
        </span>
      )}

      {/* Hiển thị lastSegment nếu không phải là route đã được config */}
      {!path.startsWith("/medicine-search") && showLastSegment && (
        <span className="flex items-center space-x-2">
          <span>{">"}</span>
          <span className="text-gray-900 font-semibold">
            {formatLabel(decodeURIComponent(lastSegment))}
          </span>
        </span>
      )}
    </nav>
  );
}
