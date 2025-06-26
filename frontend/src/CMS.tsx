import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import CMSRoutes from "./routes/CMSRoutes";

const CMSApp: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage/>} />
      <Route path="/" element={<div>About</div>} />

      <Route 
        path="/*" 
        element={
          <ProtectedRoute> 
            <CMSRoutes/>
          </ProtectedRoute>
        } 
      />


    </Routes>
  );
}
export default CMSApp;