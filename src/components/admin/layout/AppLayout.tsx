import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const LayoutContent: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.auth);
  const userRole = Array.isArray(role) ? role[0] : role || "";
  const isAdmin = userRole === "ROLE_ADMIN";
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div
      className={`min-h-screen xl:flex container mx-auto ${
        isAdmin ? "admin-theme" : "doctor-theme"
      }`}
    >
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader
          // title={isAdmin ? "Quản trị hệ thống" : "Phần mềm bác sĩ"}
          // role={isAdmin ? "admin" : "doctor"}
        />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;