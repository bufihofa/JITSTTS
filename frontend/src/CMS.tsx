import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import CMSRoutes from "./routes/CMSRoutes";
import { GoogleOAuthProvider } from "@react-oauth/google";

const CMSApp: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="426834421228-ij45p68hfap9gt0atdjivb03qehs5p7n.apps.googleusercontent.com">
      <Routes>
        <Route path="login" element={<LoginPage/>} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute> 
                <CMSRoutes/>
              </ProtectedRoute>
            } 
          />
        
      </Routes>
    </GoogleOAuthProvider>
  );
}
export default CMSApp;