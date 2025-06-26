import { Navigate, Route, Routes } from "react-router-dom";

const CMSRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path="/" element={<div>Home</div>} />

        <Route path="product" element={<div>Product</div>} />
        <Route path="about" element={<div>about</div>} />

        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default CMSRoutes;