import { Navigate, Route, Routes } from "react-router-dom";

const CMSRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path="home" element={<div>Home</div>} />

        <Route path="product" element={<div>Product</div>} />
        <Route path="user" element={<div>User</div>} />
        
        <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
export default CMSRoutes;