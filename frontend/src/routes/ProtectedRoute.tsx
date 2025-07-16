import { Navigate } from "react-router-dom";
import storage from "../utils/storage";
import { SettingProvider } from "../context/useSetting";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = storage.getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (<SettingProvider>{children}</SettingProvider>);
}