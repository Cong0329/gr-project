// AppRoutes.tsx
import { Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRouter";
import AppLayout from "../admin/layout/AppLayout";
import adminRoutes from "./AdminRouter";
import doctorRoutes from "./DoctorRouter";
import SignIn from "../admin/pages/AuthPages/SignIn";
import SignUp from "../admin/pages/AuthPages/SignUp";
import { VerifyCodePage } from "../admin/pages/AuthPages/VerifyCodePage";
import RoleRedirect from "./RoleRedirect";
import AuthWrapper from "./AuthWrapper";
import VerifyProtectedRoute from "./VerifyProtected";

const appRoutes = (
  <>
    {/* Doctor */}
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

    {/* Admin */}
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

    {/* Auth Doctor */}
    <Route
      path="/doctor/signin"
      element={
        <AuthWrapper role="ROLE_DOCTOR" redirectTo="/doctor">
          <SignIn />
        </AuthWrapper>
      }
    />
    <Route
      path="/doctor/signup"
      element={
        <AuthWrapper role="ROLE_DOCTOR" redirectTo="/doctor">
          <SignUp />
        </AuthWrapper>
      }
    />
    <Route path="/doctor/verify" element={
      <VerifyProtectedRoute>
        <VerifyCodePage />
      </VerifyProtectedRoute>
    } />

    {/* Auth Admin */}
    <Route
      path="/admin/signin"
      element={
        <AuthWrapper role="ROLE_ADMIN" redirectTo="/admin">
          <SignIn />
        </AuthWrapper>
      }
    />
    <Route
      path="/admin/signup"
      element={
        <AuthWrapper role="ROLE_ADMIN" redirectTo="/admin">
          <SignUp />
        </AuthWrapper>
      }
    />
    <Route path="/admin/verify" element={
      <VerifyProtectedRoute>
        <VerifyCodePage />
      </VerifyProtectedRoute>
    } />

    {/* Default redirect */}
    <Route path="/" element={<RoleRedirect />} />

    {/* 404 */}
    {/* <Route path="*" element={<Navigate to="/admin/signin" replace />} /> */}
  </>
);

export default appRoutes;
