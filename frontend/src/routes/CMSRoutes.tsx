import { Navigate, Route, Routes } from "react-router-dom";
import ProductManagePage from "../pages/manage/Product";
import CMSLayout from "../component/layout/CMSLayout";

const CMSRoutes: React.FC = () => {
  return (
    <CMSLayout>
        <Routes>
            <Route path="home" element={<div>Home</div>} />

            <Route path="product" element={<ProductManagePage   />} />
            <Route path="user" element={<div>User</div>} />

            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    </CMSLayout>
  );
}
export default CMSRoutes;