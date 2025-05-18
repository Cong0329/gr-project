import { Navigate, Route, useLocation } from "react-router";
import SignIn from "../admin/pages/AuthPages/SignIn";
import SignUp from "../admin/pages/AuthPages/SignUp";
import { useAuthRole } from "../admin/hooks/useAuthRole";
import { PrivateRoute } from "./PrivateRoute";
import AppLayout from "../admin/layout/AppLayout";
import adminRoutes from "./AdminRouter";
import doctorRoutes from "./DoctorRouter";
import VerifyProtectedRoute from "./VerifyProtected";
import { VerifyCodePage } from "../admin/pages/AuthPages/VerifyCodePage";

const RoleBasedRedirect = () => {
  const { isAdmin, isDoctor } = useAuthRole();
  const location = useLocation();

  if (isAdmin) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }
  if (isDoctor) {
    return <Navigate to="/doctor" replace state={{ from: location }} />;
  }
  return <Navigate to="/admin/signin" replace />;
};

const appRoutes = (
  <>
    <Route
      path="/doctor/*"
      element={
        <PrivateRoute allowedRoles={["ROLE_DOCTOR"]}>
          <AppLayout />
        </PrivateRoute>
      }
    >
      {doctorRoutes}
    </Route>

    <Route
      path="/admin/*"
      element={
        <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
          <AppLayout />
        </PrivateRoute>
      }
    >
      {adminRoutes}
    </Route>

    <Route path="signin" element={<SignIn />} />
    <Route path="signup" element={<SignUp />} />

    <Route path="/" element={<RoleBasedRedirect />} />

    <Route element={<VerifyProtectedRoute />}>
      <Route path="verify" element={<VerifyCodePage />} />
    </Route>
  </>
);

export default appRoutes;
