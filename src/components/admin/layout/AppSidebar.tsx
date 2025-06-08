import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/user-logo-removebg-preview (1).png";
import webLogo from "../../../assets/logo-web2.svg";
// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ProductIcon,
  ListIcon,
  PageIcon,
  TableIcon,
  UserCircleIcon,
  ChatIcon,
  FileIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { CalendarIcon, ClipboardListIcon } from "lucide-react";

const getRoleBasedPath = (path: string, userRole: string) => {
  if (userRole === "ROLE_ADMIN") return path;
  return path.replace("/admin/", "/doctor/");
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// Admin nav items - Keep original paths
const adminNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Bảng thống kê",
    subItems: [{ name: "Doanh số bán hàng", path: "/admin", pro: false }],
  },
  {
    icon: <UserCircleIcon />,
    name: "Quản lý người dùng",
    path: "/admin/users",
  },
  {
    name: "Sản Phẩm",
    icon: <ProductIcon />,
    subItems: [
      { name: "Thêm sản phẩm", path: "/admin/create-product", pro: false },
      { name: "Danh sách sản phẩm", path: "/admin/products", pro: false },
    ],
  },
  {
    name: "Danh Mục",
    icon: <ListIcon />,
    subItems: [
      { name: "Thương hiệu", path: "/admin/brand", pro: false },
      { name: "Danh mục", path: "/admin/category", pro: false },
      { name: "Đối tượng", path: "/admin/medical-object", pro: false },
      { name: "Chỉ định", path: "/admin/indication", pro: false },
    ],
  },
  {
    name: "Đơn hàng",
    icon: <TableIcon />,
    subItems: [{ name: "Quản lý đơn hàng", path: "/admin/orders", pro: false }],
  },
  {
    name: "Chat",
    icon: <ChatIcon />,
    subItems: [
      { name: "Quản lý đánh giá", path: "/admin/reviews", pro: false },
      { name: "Quản lý chat", path: "/admin/chat", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Quản lý gói khám",
    path: "/admin/packages",
  },
  {
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "Blank Page", path: "/admin/blank", pro: false },
      { name: "404 Error", path: "/admin/error-404", pro: false },
    ],
  },
];

// Doctor nav items - Keep original paths
const doctorNavItems: NavItem[] = [
  {
    icon: <UserCircleIcon />,
    name: "Hồ sơ cá nhân",
    path: "/doctor",
  },
  {
    icon: <CalendarIcon />,
    name: "Lịch cá nhân",
    path: "/doctor/schedule",
  },
  {
    icon: <ClipboardListIcon />,
    name: "Yêu cầu gói khám",
    path: "/doctor/examination-requests",
  },
  {
    icon: <ChatIcon />,
    name: "Chat",
    path: "/doctor/chat",
  },
  {
    icon: <FileIcon />,
    name: "hồ sơ bệnh án",
    path: "/doctor/medical-record",
  },
];

// const othersItems: NavItem[] = [
//   {
//     icon: <PieChartIcon />,
//     name: "Charts",
//     subItems: [
//       { name: "Line Chart", path: "/admin/line-chart", pro: false },
//       { name: "Bar Chart", path: "/admin/bar-chart", pro: false },
//     ],
//   },
//   {
//     icon: <BoxCubeIcon />,
//     name: "UI Elements",
//     subItems: [
//       { name: "Alerts", path: "/admin/alerts", pro: false },
//       { name: "Avatar", path: "/admin/avatars", pro: false },
//       { name: "Badge", path: "/admin/badge", pro: false },
//       { name: "Buttons", path: "/admin/buttons", pro: false },
//       { name: "Images", path: "/admin/images", pro: false },
//       { name: "Videos", path: "/admin/videos", pro: false },
//     ],
//   },
//   {
//     icon: <PlugInIcon />,
//     name: "Authentication",
//     subItems: [
//       { name: "Sign In", path: "/signin", pro: false },
//       { name: "Sign Up", path: "/signup", pro: false },
//     ],
//   },
// ];

const AppSidebar: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.auth);
  const userRole = Array.isArray(role) ? role[0] : role || "";
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

  const isAdmin = userRole === "ROLE_ADMIN";
  const isDoctor = userRole === "ROLE_DOCTOR";

  // Select appropriate nav items and transform paths based on role
  const navItems = isAdmin ? adminNavItems : isDoctor ? doctorNavItems : [];

  // Transform paths using useMemo to prevent infinite re-renders
  const filteredNavItems = useMemo(() => {
    return navItems.map((item) => ({
      ...item,
      path: item.path ? getRoleBasedPath(item.path, userRole) : item.path,
      subItems: item.subItems?.map((subItem) => ({
        ...subItem,
        path: getRoleBasedPath(subItem.path, userRole),
      })),
    }));
  }, [navItems, userRole]);

  // Transform othersItems paths using useMemo
  // const filteredOthersItems = useMemo(() => {
  //   if (!isAdmin) return [];
  //   return othersItems.map((item) => ({
  //     ...item,
  //     path: item.path ? getRoleBasedPath(item.path, userRole) : item.path,
  //     subItems: item.subItems?.map((subItem) => ({
  //       ...subItem,
  //       path: getRoleBasedPath(subItem.path, userRole),
  //     })),
  //   }));
  // }, [isAdmin, userRole]);

  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => {
      const currentPath = location.pathname;

      const isMenuParent = navItems.some(
        (item) => item.path === path && item.subItems
      );

      return isMenuParent
        ? currentPath === path || currentPath.startsWith(path + "/")
        : currentPath === path;
    },
    [location.pathname, navItems]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main"].forEach((menuType) => {
      const items = menuType === "main" ? filteredNavItems : [];
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      // Check if current route matches any top-level menu item
      ["main"].forEach((menuType) => {
        const items = menuType === "main" ? filteredNavItems : [];
        items.forEach((nav) => {
          if (nav.path && isActive(nav.path)) {
            setOpenSubmenu(null); // Close submenus for direct links
          }
        });
      });
    }
  }, [location, isActive, filteredNavItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item text-md font-semibold group py-2 px-4 flex gap-2 items-center justify-between w-full text-left ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "bg-blue-100 text-blue-600 rounded-md"
                  : "menu-item-inactive hover:bg-gray-50"
              } cursor-pointer transition-colors duration-200 ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`menu-item-icon-size text-xl ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="text-left w-40">{nav.name}</span>
                )}
              </div>

              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-blue-600"
                      : "text-gray-400"
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group flex items-center px-4 py-2 rounded-md font-semibold text-md gap-2 transition-colors duration-200 ${
                  isActive(nav.path)
                    ? "bg-blue-100 text-blue-600"
                    : "menu-item-inactive hover:bg-gray-50"
                }`}
              >
                <span
                  className={`menu-item-icon-size text-lg ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-3 ml-9 space-y-2">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item text-sm px-4 py-2 font-semibold rounded-md transition-colors duration-200 ${
                        isActive(subItem.path)
                          ? "bg-blue-100 text-blue-600"
                          : "menu-dropdown-item-inactive hover:bg-gray-50 text-gray-600"
                      } block w-[210px]`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  // Get logo link based on role
  const logoLink = isAdmin ? "/admin" : isDoctor ? "/doctor" : "/";
  const appName = isAdmin
    ? "Quản trị hệ thống"
    : isDoctor
    ? "Phần mềm bác sĩ"
    : "Dược sĩ";

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-3 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to={logoLink}>
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-2">
              <img
                src={webLogo}
                className="w-[200px]   p-1"
                alt="Logo"
              />
              {/* <span className="font-bold text-2xl">{appName}</span> */}
            </div>
          ) : (
            <img
              src={logo}
              className="h-10 w-10  border rounded-md p-1 mt-5"
              alt="Logo"
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto scrollbar-hide duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  `Menu ${appName}`
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>
            {/* 
            {isAdmin && ( // Only show others menu for admin
              <div className="">
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    "Others"
                  ) : (
                    <HorizontaLDots />
                  )}
                </h2>
                {renderMenuItems(filteredOthersItems, "others")}
              </div>
            )} */}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
