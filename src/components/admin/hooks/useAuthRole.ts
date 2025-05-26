import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
export const useAuthRole = () => {
  const authState = useSelector((state: RootState) => state.auth);
  
  // Debug: Log toàn bộ auth state
  console.log('Auth state in hook:', authState);
  
  const roles = authState.admin?.roles || authState.user?.roles || [];
  console.log('Extracted roles:', roles);
  return {
    roles,
    isAdmin: roles.some((role: any) => role.code === "ROLE_ADMIN"),
    isDoctor: roles.some((role: any) => role.code === "ROLE_DOCTOR"),
    isUser: roles.some((role: any) => role.code === "ROLE_USER")
  };
};
// src/hooks/useAuth.ts
export const useAuth = () => {
  const authState = useSelector((state: RootState) => state.auth);
  
  // Kết hợp cả 3 điều kiện xác thực
  const isAuthenticated = 
    authState.isAuthenticated || 
    authState.isUserAuthenticated || 
    authState.verify;
  
  return { isAuthenticated };
};